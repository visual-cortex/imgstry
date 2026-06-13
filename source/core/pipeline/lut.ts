/**
 * Per-channel 256-entry lookup tables.
 */
export interface ChannelLut {
    r: Uint8Array
    g: Uint8Array
    b: Uint8Array
}

const clampU8 = (value: number): number =>
    value <= 0 ? 0 : value >= 255 ? 255 : (value + .5) | 0;

const identity = (): Uint8Array => {
    const lut = new Uint8Array(256);
    for (let i = 0; i < 256; i++) {
        lut[i] = i;
    }
    return lut;
};

const sharedLut = (transform: (i: number) => number): ChannelLut => {
    const lut = new Uint8Array(256);
    for (let i = 0; i < 256; i++) {
        lut[i] = clampU8(transform(i));
    }
    return { r: lut, g: lut, b: lut };
};

const channelLut = (
    transformR: (i: number) => number,
    transformG: (i: number) => number,
    transformB: (i: number) => number,
): ChannelLut => {
    const r = new Uint8Array(256);
    const g = new Uint8Array(256);
    const b = new Uint8Array(256);

    for (let i = 0; i < 256; i++) {
        r[i] = clampU8(transformR(i));
        g[i] = clampU8(transformG(i));
        b[i] = clampU8(transformB(i));
    }

    return { r, g, b };
};

/**
 * Compose two channel LUTs so that the resulting LUT[i] = next[prev[i]].
 * @param prev previously accumulated lookup
 * @param next next lookup to compose on top
 * @returns composed lookup
 */
export const composeLut = (prev: ChannelLut, next: ChannelLut): ChannelLut => {
    const composeChannel = (a: Uint8Array, b: Uint8Array): Uint8Array => {
        const result = new Uint8Array(256);
        for (let i = 0; i < 256; i++) {
            result[i] = b[a[i]];
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
    const delta = Math.floor(255 * (value / 100));
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
    const fromMapping = (source?: number[]): Uint8Array => {
        if (!source) {
            return identity();
        }
        const lut = new Uint8Array(256);
        for (let i = 0; i < 256; i++) {
            lut[i] = clampU8(source[i] ?? i);
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

/**
 * Apply a per-channel LUT to RGBA data in place.
 * @param data the rgba buffer
 * @param lut the channel lookup
 */
export const applyChannelLut = (data: Uint8ClampedArray, lut: ChannelLut): void => {
    const { r, g, b } = lut;
    const length = data.length;
    for (let i = 0; i < length; i += 4) {
        data[i] = r[data[i]];
        data[i + 1] = g[data[i + 1]];
        data[i + 2] = b[data[i + 2]];
    }
};
