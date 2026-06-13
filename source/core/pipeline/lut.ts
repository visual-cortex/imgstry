/**
 * Per-channel 256-entry lookup tables.
 *
 * Tables hold the *float* target value for each u8 input so that
 * sequential composition does not re-quantize at every step. The
 * Uint8ClampedArray quantization happens once in {@link applyChannelLut}.
 */
export interface ChannelLut {
    r: Float32Array
    g: Float32Array
    b: Float32Array
}

const clampF = (value: number): number =>
    value <= 0 ? 0 : value >= 255 ? 255 : value;

const identity = (): Float32Array => {
    const lut = new Float32Array(256);
    for (let i = 0; i < 256; i++) {
        lut[i] = i;
    }
    return lut;
};

const sharedLut = (transform: (i: number) => number): ChannelLut => {
    const lut = new Float32Array(256);
    for (let i = 0; i < 256; i++) {
        lut[i] = clampF(transform(i));
    }
    return { r: lut, g: lut, b: lut };
};

const channelLut = (
    transformR: (i: number) => number,
    transformG: (i: number) => number,
    transformB: (i: number) => number,
): ChannelLut => {
    const r = new Float32Array(256);
    const g = new Float32Array(256);
    const b = new Float32Array(256);

    for (let i = 0; i < 256; i++) {
        r[i] = clampF(transformR(i));
        g[i] = clampF(transformG(i));
        b[i] = clampF(transformB(i));
    }

    return { r, g, b };
};

/**
 * Compose two channel LUTs so that the resulting LUT[i] = next[prev[i]],
 * using linear interpolation on the float target so the second lookup
 * does not have to round its input down to a u8 boundary.
 * @param prev previously accumulated lookup
 * @param next next lookup to compose on top
 * @returns composed lookup
 */
export const composeLut = (prev: ChannelLut, next: ChannelLut): ChannelLut => {
    const composeChannel = (a: Float32Array, b: Float32Array): Float32Array => {
        const result = new Float32Array(256);
        for (let i = 0; i < 256; i++) {
            const x = a[i] <= 0 ? 0 : a[i] >= 255 ? 255 : a[i];
            const lo = x | 0;
            const hi = lo < 255 ? lo + 1 : 255;
            const t = x - lo;
            result[i] = b[lo] + (b[hi] - b[lo]) * t;
        }
        return result;
    };

    return {
        r: composeChannel(prev.r, next.r),
        g: composeChannel(prev.g, next.g),
        b: composeChannel(prev.b, next.b),
    };
};

export const brightnessLut = (value: number): ChannelLut => {
    const delta = 255 * (value / 100);
    return sharedLut((i) => i + delta);
};

export const contrastLut = (value: number): ChannelLut => {
    if (value < 0) {
        value /= 10;
    }
    const factor = Math.pow((value + 100) / 100, 2);
    return sharedLut((i) => {
        let v = i / 255;
        v -= .5;
        v *= factor;
        v += .5;
        return v * 255;
    });
};

export const gammaLut = (value: number): ChannelLut => {
    let exponent: number;
    if (value >= 0) {
        exponent = 1 - (value / 100);
    } else {
        exponent = value / -10;
    }
    return sharedLut((i) => Math.pow(i / 255, exponent) * 255);
};

export const invertLut = (): ChannelLut => sharedLut((i) => 255 - i);

export const exposureLut = (stops: number): ChannelLut => {
    const factor = Math.pow(2, stops);
    return sharedLut((i) => i * factor);
};

/**
 * Per-channel gain (no value clipping beyond u8 clamp).
 * @param gain per-channel multipliers
 * @param gain.r red multiplier
 * @param gain.g green multiplier
 * @param gain.b blue multiplier
 * @returns the channel lookup
 */
export const gainLut = (gain: { r: number; g: number; b: number }): ChannelLut =>
    channelLut(
        (i) => i * gain.r,
        (i) => i * gain.g,
        (i) => i * gain.b,
    );

/**
 * Image levels: input remap [inLow, inHigh] mapped through gamma to [outLow, outHigh].
 * @param options levels parameters
 * @param options.inLow source range floor
 * @param options.inHigh source range ceiling
 * @param options.gamma midtone exponent (>0)
 * @param options.outLow destination range floor
 * @param options.outHigh destination range ceiling
 * @returns the channel lookup
 */
export const levelsLut = ({
    inLow = 0,
    inHigh = 255,
    gamma = 1,
    outLow = 0,
    outHigh = 255,
}: {
    inLow?: number
    inHigh?: number
    gamma?: number
    outLow?: number
    outHigh?: number
}): ChannelLut => {
    const span = inHigh - inLow;
    return sharedLut((i) => {
        if (span === 0) {
            return outLow;
        }
        const normalized = Math.min(1, Math.max(0, (i - inLow) / span));
        return Math.pow(normalized, 1 / gamma) * (outHigh - outLow) + outLow;
    });
};

/**
 * Shadows / highlights / whites / blacks: smooth weight curves
 * tied to four luminance regions.
 * @param amount lift amount (-100, 100)
 * @param region region selector
 * @returns the channel lookup
 */
export const toneRegionLut = (
    amount: number,
    region: 'shadows' | 'highlights' | 'whites' | 'blacks',
): ChannelLut => {
    const strength = amount / 100;

    const weight = (i: number): number => {
        const x = i / 255;
        switch (region) {
            case 'shadows':
                return Math.pow(1 - x, 2);
            case 'highlights':
                return Math.pow(x, 2);
            case 'blacks':
                return Math.pow(1 - x, 4);
            case 'whites':
                return Math.pow(x, 4);
            default:
                return 0;
        }
    };

    return sharedLut((i) => i + 255 * strength * weight(i));
};

/**
 * Build a tone-curve LUT from a 256-entry remap.
 * @param mapping the precomputed mapping
 * @param mapping.r red channel mapping
 * @param mapping.g green channel mapping
 * @param mapping.b blue channel mapping
 * @param mapping.rgb shared mapping for all channels
 * @returns the channel lookup
 */
export const curveLut = (mapping: { r?: number[]; g?: number[]; b?: number[]; rgb?: number[] }): ChannelLut => {
    const fromMapping = (source?: number[]): Float32Array => {
        if (!source) {
            return identity();
        }
        const lut = new Float32Array(256);
        for (let i = 0; i < 256; i++) {
            lut[i] = clampF(source[i] ?? i);
        }
        return lut;
    };

    if (mapping.rgb) {
        const shared = fromMapping(mapping.rgb);
        return { r: shared, g: shared, b: shared };
    }

    return {
        r: fromMapping(mapping.r),
        g: fromMapping(mapping.g),
        b: fromMapping(mapping.b),
    };
};

// 4x4 Bayer threshold matrix in [-.5, +.5], pre-scaled so a slope-of-2 LUT
// dithers across the full ±1 output range. Bayer is deterministic, has no
// low-frequency drift and is dramatically cheaper than Math.random per pixel.
const BAYER_SIZE = 4;
const BAYER = (() => {
    const raw = [
        0, 8, 2, 10,
        12, 4, 14, 6,
        3, 11, 1, 9,
        15, 7, 13, 5,
    ];
    return new Float32Array(raw.map((v) => (v + .5) / 16 - .5));
})();

/**
 * Apply a per-channel LUT to RGBA data in place. Float LUT outputs are
 * dithered against a 4x4 ordered Bayer matrix before the Uint8ClampedArray
 * quantizes them, so heavy curve stacks do not produce comb artifacts in
 * the resulting histogram.
 * @param data the rgba buffer
 * @param lut the channel lookup
 * @param width image width in pixels, needed to address the Bayer matrix
 */
export const applyChannelLut = (
    data: Uint8ClampedArray,
    lut: ChannelLut,
    width = 1,
): void => {
    const { r, g, b } = lut;
    const length = data.length;
    let x = 0;
    let y = 0;
    for (let i = 0; i < length; i += 4) {
        const bayer = BAYER[(y & (BAYER_SIZE - 1)) * BAYER_SIZE + (x & (BAYER_SIZE - 1))];
        data[i]     = r[data[i]]     + bayer;
        data[i + 1] = g[data[i + 1]] + bayer;
        data[i + 2] = b[data[i + 2]] + bayer;

        if (++x === width) {
            x = 0;
            y++;
        }
    }
};
