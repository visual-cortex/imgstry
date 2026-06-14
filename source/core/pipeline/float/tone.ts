// Float32 versions of the LUT-shaped tone ops. Each evaluates per-pixel
// in the encoded sRGB-ish 0..1 space (with overshoot preserved). No
// LUT quantisation, so heavy stacks compose without comb artifacts.

/**
 * Brightness shift expressed in 0..100 units (matches the u8 version).
 * @param data RGBA float buffer
 * @param value brightness intensity, [-100, 100]
 */
export const applyBrightness = (data: Float32Array, value: number): void => {
    const delta = value / 100;
    for (let i = 0; i < data.length; i += 4) {
        data[i]     += delta;
        data[i + 1] += delta;
        data[i + 2] += delta;
    }
};

/**
 * Contrast around 0.5. Matches the u8 contrastLut semantics.
 * @param data RGBA float buffer
 * @param value contrast intensity, [-100, 100]
 */
export const applyContrast = (data: Float32Array, value: number): void => {
    if (value < 0) {
        value /= 10;
    }
    const factor = Math.pow((value + 100) / 100, 2);
    for (let i = 0; i < data.length; i += 4) {
        data[i]     = (data[i]     - .5) * factor + .5;
        data[i + 1] = (data[i + 1] - .5) * factor + .5;
        data[i + 2] = (data[i + 2] - .5) * factor + .5;
    }
};

/**
 * Gamma. Matches the u8 gammaLut: positive lifts midtones, negative
 * crushes them.
 * @param data RGBA float buffer
 * @param value gamma intensity, [-100, 100]
 */
export const applyGamma = (data: Float32Array, value: number): void => {
    let exponent: number;
    if (value >= 0) {
        exponent = 1 - (value / 100);
    } else {
        exponent = value / -10;
    }
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i]; const g = data[i + 1]; const b = data[i + 2];
        data[i]     = r <= 0 ? 0 : Math.pow(r, exponent);
        data[i + 1] = g <= 0 ? 0 : Math.pow(g, exponent);
        data[i + 2] = b <= 0 ? 0 : Math.pow(b, exponent);
    }
};

/**
 * Invert about 1 (0..1 domain).
 * @param data RGBA float buffer
 */
export const applyInvert = (data: Float32Array): void => {
    for (let i = 0; i < data.length; i += 4) {
        data[i]     = 1 - data[i];
        data[i + 1] = 1 - data[i + 1];
        data[i + 2] = 1 - data[i + 2];
    }
};

/**
 * Exposure in stops, applied as a multiplier in the encoded domain.
 * For "real" exposure-from-linear, the RAW ingest path already bakes
 * the requested stops into the float buffer at decode time.
 * @param data RGBA float buffer
 * @param stops exposure, [-5, 5]
 */
export const applyExposure = (data: Float32Array, stops: number): void => {
    const factor = Math.pow(2, stops);
    for (let i = 0; i < data.length; i += 4) {
        data[i]     *= factor;
        data[i + 1] *= factor;
        data[i + 2] *= factor;
    }
};

/**
 * Per-channel gain (e.g. temperature, tint, white balance).
 * @param data RGBA float buffer
 * @param gain per-channel multipliers
 * @param gain.r red multiplier
 * @param gain.g green multiplier
 * @param gain.b blue multiplier
 */
export const applyGain = (
    data: Float32Array,
    gain: { r: number; g: number; b: number },
): void => {
    for (let i = 0; i < data.length; i += 4) {
        data[i]     *= gain.r;
        data[i + 1] *= gain.g;
        data[i + 2] *= gain.b;
    }
};

export interface LevelsOptions {
    inLow?: number
    inHigh?: number
    gamma?: number
    outLow?: number
    outHigh?: number
}

/**
 * Levels remap: source range [inLow, inHigh] (0..255 domain to match
 * the u8 op) into [outLow, outHigh] through a gamma curve.
 * @param data RGBA float buffer
 * @param options levels parameters
 */
export const applyLevels = (data: Float32Array, options: LevelsOptions): void => {
    const inLow = (options.inLow ?? 0) / 255;
    const inHigh = (options.inHigh ?? 255) / 255;
    const gamma = options.gamma ?? 1;
    const outLow = (options.outLow ?? 0) / 255;
    const outHigh = (options.outHigh ?? 255) / 255;
    const span = inHigh - inLow;
    const outSpan = outHigh - outLow;
    const invGamma = 1 / gamma;

    if (span === 0) {
        for (let i = 0; i < data.length; i += 4) {
            data[i]     = outLow;
            data[i + 1] = outLow;
            data[i + 2] = outLow;
        }
        return;
    }

    for (let i = 0; i < data.length; i += 4) {
        for (let c = 0; c < 3; c++) {
            const v = data[i + c];
            const n = v <= inLow ? 0 : v >= inHigh ? 1 : (v - inLow) / span;
            data[i + c] = Math.pow(n, invGamma) * outSpan + outLow;
        }
    }
};

export type ToneRegion = 'shadows' | 'highlights' | 'whites' | 'blacks';

const regionWeight = (x: number, region: ToneRegion): number => {
    switch (region) {
        case 'shadows':    return Math.pow(1 - x, 2);
        case 'highlights': return Math.pow(x, 2);
        case 'blacks':     return Math.pow(1 - x, 4);
        case 'whites':     return Math.pow(x, 4);
        default:           return 0;
    }
};

/**
 * Shadows / highlights / whites / blacks lifts, matching the u8
 * toneRegionLut semantics.
 * @param data RGBA float buffer
 * @param amount lift amount, [-100, 100]
 * @param region region selector
 */
export const applyToneRegion = (
    data: Float32Array,
    amount: number,
    region: ToneRegion,
): void => {
    const strength = amount / 100;
    for (let i = 0; i < data.length; i += 4) {
        for (let c = 0; c < 3; c++) {
            const x = data[i + c];
            const xClamped = x <= 0 ? 0 : x >= 1 ? 1 : x;
            data[i + c] = x + strength * regionWeight(xClamped, region);
        }
    }
};

export interface CurveMapping {
    r?: number[]
    g?: number[]
    b?: number[]
    rgb?: number[]
}

const sampleCurve = (mapping: number[] | undefined, value: number): number => {
    if (!mapping) {
        return value;
    }
    if (value <= 0) {
        return (mapping[0] ?? 0) / 255;
    }
    if (value >= 1) {
        return (mapping[255] ?? 255) / 255;
    }
    // Linearly interpolate the 256-entry u8-domain mapping in float
    // space; the | 0 truncate-back-to-u8 from the prior implementation
    // dropped the precision win, so we keep the interpolated value as a
    // float and only divide once at the end.
    const x = value * 255;
    const lo = x | 0;
    const hi = lo < 255 ? lo + 1 : 255;
    const t = x - lo;
    const a = mapping[lo] ?? lo;
    const b = mapping[hi] ?? hi;
    return (a + (b - a) * t) / 255;
};

/**
 * Tone curve per channel. Mapping is a 256-entry u8-domain lookup
 * (compatible with the existing u8 op), interpolated for float input.
 * @param data RGBA float buffer
 * @param mapping per-channel or shared 256-entry mapping
 */
export const applyCurve = (data: Float32Array, mapping: CurveMapping): void => {
    const shared = mapping.rgb;
    const r = shared ?? mapping.r;
    const g = shared ?? mapping.g;
    const b = shared ?? mapping.b;

    for (let i = 0; i < data.length; i += 4) {
        data[i]     = sampleCurve(r, data[i]);
        data[i + 1] = sampleCurve(g, data[i + 1]);
        data[i + 2] = sampleCurve(b, data[i + 2]);
    }
};

/**
 * Maps the [-100, +100] temperature slider onto a warm/cool gain.
 * Mirrors the u8 `temperatureGain` factor exactly.
 * @param value temperature shift, [-100, 100]
 * @returns per-channel gain triplet
 */
export const temperatureGain = (value: number): { r: number; g: number; b: number } => {
    const amount = value / 100;
    return {
        r: 1 + amount * .2,
        g: 1,
        b: 1 - amount * .2,
    };
};

/**
 * Maps the [-100, +100] tint slider onto a green/magenta gain.
 * Mirrors the u8 `tintGain` factor exactly.
 * @param value tint shift, [-100, 100]
 * @returns per-channel gain triplet
 */
export const tintGain = (value: number): { r: number; g: number; b: number } => {
    const amount = value / 100;
    return {
        r: 1 + amount * .08,
        g: 1 - amount * .15,
        b: 1 + amount * .08,
    };
};
