/* eslint-disable sonarjs/cognitive-complexity */
// Float32 versions of the per-pixel ops. All math runs on RGBA values
// in [0, 1] (overshoot allowed); the canvas-write step is responsible
// for the final clamp + quantise.

import { luma709, parseHexFloat as parseHex } from '~/utils/color';

/**
 * Saturation as a luma-preserving push along the (luma -> channel)
 * axis. value > 0 pushes channels away from luma, value < 0 pulls them
 * toward luma. A fully-desaturated red lands on its luma gray rather
 * than on white.
 * @param data RGBA float buffer
 * @param value saturation intensity, [-100, 100]
 */
export const applySaturation = (data: Float32Array, value: number): void => {
    const factor = -value * .01;
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i]; const g = data[i + 1]; const b = data[i + 2];
        const y = luma709(r, g, b);
        data[i]     = r + factor * (y - r);
        data[i + 1] = g + factor * (y - g);
        data[i + 2] = b + factor * (y - b);
    }
};

/**
 * Vibrance: stronger saturation push for less-saturated pixels, gentle
 * for already-saturated ones. Also luma-preserving.
 * @param data RGBA float buffer
 * @param value vibrance intensity, [-100, 100]
 */
export const applyVibrance = (data: Float32Array, value: number): void => {
    const intensity = -value;
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i]; const g = data[i + 1]; const b = data[i + 2];
        const y = luma709(r, g, b);
        const max = r > g ? (r > b ? r : b) : (g > b ? g : b);
        const min = r < g ? (r < b ? r : b) : (g < b ? g : b);
        const chroma = max - min;
        const amount = (1 - Math.min(1, Math.max(0, chroma))) * intensity / 100;
        data[i]     = r + amount * (y - r);
        data[i + 1] = g + amount * (y - g);
        data[i + 2] = b + amount * (y - b);
    }
};

/**
 * Sepia: same 3x3 matrix as u8, weighted by intensity / 100.
 * @param data RGBA float buffer
 * @param value sepia intensity
 */
export const applySepia = (data: Float32Array, value: number): void => {
    const v = (value || 100) / 100;
    const rr = 1 - .607 * v; const rg = .769 * v; const rb = .189 * v;
    const gr = .349 * v;     const gg = 1 - .314 * v; const gb = .168 * v;
    const br = .272 * v;     const bg = .534 * v;     const bb = 1 - .869 * v;

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i]; const g = data[i + 1]; const b = data[i + 2];
        data[i]     = r * rr + g * rg + b * rb;
        data[i + 1] = r * gr + g * gg + b * gb;
        data[i + 2] = r * br + g * bg + b * bb;
    }
};

/**
 * Black & white via per-channel luminance weights.
 * @param data RGBA float buffer
 * @param ratio per-channel weights, must sum to 1 (else defaults applied)
 */
export const applyBlackAndWhite = (
    data: Float32Array,
    ratio: [number, number, number],
): void => {
    let [rR, gR, bR] = ratio;
    if (rR + gR + bR !== 1) {
        rR = .3; gR = .59; bR = .11;
    }
    for (let i = 0; i < data.length; i += 4) {
        const grey = data[i] * rR + data[i + 1] * gR + data[i + 2] * bR;
        data[i] = grey;
        data[i + 1] = grey;
        data[i + 2] = grey;
    }
};

/**
 * Screen each channel toward `color`.
 * @param data RGBA float buffer
 * @param color hex string
 */
export const applyTint = (data: Float32Array, color: string): void => {
    const { r: tr, g: tg, b: tb } = parseHex(color);
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i]; const g = data[i + 1]; const b = data[i + 2];
        data[i]     = r + (1 - r) * tr;
        data[i + 1] = g + (1 - g) * tg;
        data[i + 2] = b + (1 - b) * tb;
    }
};

/**
 * Overwrite every pixel with `color` (alpha unchanged).
 * @param data RGBA float buffer
 * @param color hex string
 */
export const applyFill = (data: Float32Array, color: string): void => {
    const { r, g, b } = parseHex(color);
    for (let i = 0; i < data.length; i += 4) {
        data[i] = r; data[i + 1] = g; data[i + 2] = b;
    }
};

/**
 * Additive noise in [-value/100, +value/100] per pixel.
 * @param data RGBA float buffer
 * @param value noise amount, [0, 100]
 */
export const applyNoise = (data: Float32Array, value: number): void => {
    const amplitude = value / 100;
    for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - .5) * 2 * amplitude;
        data[i]     += noise;
        data[i + 1] += noise;
        data[i + 2] += noise;
    }
};

const sectorOf = (h: number): number => {
    if (h < 0) {
        h = (h % 360) + 360;
    }
    if (h >= 360) {
        h = h % 360;
    }
    return h;
};

/**
 * Hue shift via RGB -> HSV -> RGB.
 * @param data RGBA float buffer
 * @param value hue shift in degrees
 */
export const applyHue = (data: Float32Array, value: number): void => {
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i]; const g = data[i + 1]; const b = data[i + 2];
        const max = r > g ? (r > b ? r : b) : (g > b ? g : b);
        const min = r < g ? (r < b ? r : b) : (g < b ? g : b);
        const delta = max - min;

        let h = 0;
        if (delta !== 0) {
            if (max === r) {
                h = ((g - b) / delta) % 6;
            } else if (max === g) {
                h = (b - r) / delta + 2;
            } else {
                h = (r - g) / delta + 4;
            }
            h *= 60;
            if (h < 0) {
                h += 360;
            }
        }
        const s = max === 0 ? 0 : delta / max;
        const v = max;

        const newH = sectorOf(h + value);
        const c = v * s;
        const hPrime = newH / 60;
        const sector = hPrime | 0;
        const x = c * (1 - Math.abs((hPrime % 2) - 1));
        const m = v - c;

        let rr = m, gg = m, bb = m;
        switch (sector) {
            case 0: rr += c; gg += x; break;
            case 1: rr += x; gg += c; break;
            case 2: gg += c; bb += x; break;
            case 3: gg += x; bb += c; break;
            case 4: rr += x; bb += c; break;
            case 5: rr += c; bb += x; break;
            default: break;
        }

        data[i]     = rr;
        data[i + 1] = gg;
        data[i + 2] = bb;
    }
};

export interface ChannelMixerRow {
    r: number
    g: number
    b: number
    constant?: number
}

export interface ChannelMixerMatrix {
    r: ChannelMixerRow
    g: ChannelMixerRow
    b: ChannelMixerRow
}

/**
 * 3x3 channel mixer with optional per-channel constant.
 * Coefficients are in u8 terms (matching the u8 op); the constants
 * are interpreted in u8 too and rescaled.
 * @param data RGBA float buffer
 * @param matrix the mixer matrix
 */
export const applyChannelMixer = (data: Float32Array, matrix: ChannelMixerMatrix): void => {
    const { r: rR, g: gR, b: bR } = matrix;
    const cR = (rR.constant ?? 0) / 255;
    const cG = (gR.constant ?? 0) / 255;
    const cB = (bR.constant ?? 0) / 255;
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i]; const g = data[i + 1]; const b = data[i + 2];
        data[i]     = r * rR.r + g * rR.g + b * rR.b + cR;
        data[i + 1] = r * gR.r + g * gR.g + b * gR.b + cG;
        data[i + 2] = r * bR.r + g * bR.g + b * bR.b + cB;
    }
};

export interface SplitToneOptions {
    shadows: string
    highlights: string
    balance?: number
    amount?: number
}

/**
 * Tone the shadow / highlight regions with two distinct hues.
 * @param data RGBA float buffer
 * @param options split-tone parameters
 */
// Mirrors the u8 op's 128 offset (mid-gray sentinel). In the 0..1 domain
// that's 128/255, not the rounded 0.5 used previously - the rounded
// value drifts ~0.2% per weighted pixel and breaks parity with the u8
// pipeline's split-tone result.
const SPLIT_TONE_MIDGRAY = 128 / 255;

export const applySplitTone = (data: Float32Array, options: SplitToneOptions): void => {
    const shadow = parseHex(options.shadows);
    const high = parseHex(options.highlights);
    const balance = (options.balance ?? 0) / 200;
    const amount = (options.amount ?? 50) / 100;

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i]; const g = data[i + 1]; const b = data[i + 2];
        const luma = r * .3 + g * .59 + b * .11;
        const shadowWeight = Math.max(0, .5 - luma - balance) * 2 * amount;
        const highlightWeight = Math.max(0, luma - .5 + balance) * 2 * amount;
        const offset = SPLIT_TONE_MIDGRAY * (shadowWeight + highlightWeight);

        data[i]     = r + shadow.r * shadowWeight + high.r * highlightWeight - offset;
        data[i + 1] = g + shadow.g * shadowWeight + high.g * highlightWeight - offset;
        data[i + 2] = b + shadow.b * shadowWeight + high.b * highlightWeight - offset;
    }
};
