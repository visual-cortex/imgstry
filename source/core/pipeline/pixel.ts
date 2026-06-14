/* eslint-disable sonarjs/cognitive-complexity */
import { luma709, parseHexU8 as parseHex } from '~/utils/color';

const clampU8 = (value: number): number =>
    value <= 0 ? 0 : value >= 255 ? 255 : value;

/**
 * Saturation as a luma-preserving push along the (luma -> channel) axis.
 * value > 0 pushes channels away from luma (more saturated); value < 0
 * pulls channels toward luma (desaturated, ending on the luma gray at
 * value = -100). Matches Photoshop/Lightroom: a fully-desaturated red
 * lands on its luma gray, not on white.
 * @param data the rgba buffer
 * @param value saturation intensity, [-100, 100]
 */
export const applySaturation = (data: Uint8ClampedArray, value: number): void => {
    // factor in [-1, 1]: positive pulls toward luma, negative pushes away.
    const factor = -value * .01;

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const y = luma709(r, g, b);

        data[i]     = clampU8(r + factor * (y - r));
        data[i + 1] = clampU8(g + factor * (y - g));
        data[i + 2] = clampU8(b + factor * (y - b));
    }
};

/**
 * Vibrance: stronger saturation push for less-saturated pixels, gentle
 * for already-saturated ones. Like {@link applySaturation} but the
 * push magnitude scales with chroma (distance from luma). Also
 * luma-preserving.
 * @param data the rgba buffer
 * @param value vibrance intensity, [-100, 100]
 */
export const applyVibrance = (data: Uint8ClampedArray, value: number): void => {
    const intensity = -value;

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const y = luma709(r, g, b);
        const max = r > g ? (r > b ? r : b) : (g > b ? g : b);
        const min = r < g ? (r < b ? r : b) : (g < b ? g : b);
        // Chroma proxy: distance between extremes, normalised to 0..1.
        const chroma = (max - min) / 255;
        // Scale push by (1 - chroma) so saturated pixels move less.
        const amount = (1 - chroma) * intensity / 100;

        data[i]     = clampU8(r + amount * (y - r));
        data[i + 1] = clampU8(g + amount * (y - g));
        data[i + 2] = clampU8(b + amount * (y - b));
    }
};

export const applySepia = (data: Uint8ClampedArray, value: number): void => {
    const v = (value || 100) / 100;
    const rr = 1 - .607 * v;
    const rg = .769 * v;
    const rb = .189 * v;
    const gr = .349 * v;
    const gg = 1 - .314 * v;
    const gb = .168 * v;
    const br = .272 * v;
    const bg = .534 * v;
    const bb = 1 - .869 * v;

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        data[i]     = clampU8(r * rr + g * rg + b * rb);
        data[i + 1] = clampU8(r * gr + g * gg + b * gb);
        data[i + 2] = clampU8(r * br + g * bg + b * bb);
    }
};

export const applyBlackAndWhite = (
    data: Uint8ClampedArray,
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

export const applyTint = (data: Uint8ClampedArray, color: string): void => {
    const { r: tr, g: tg, b: tb } = parseHex(color);
    const rRatio = tr / 255;
    const gRatio = tg / 255;
    const bRatio = tb / 255;

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        data[i] = r + (255 - r) * rRatio;
        data[i + 1] = g + (255 - g) * gRatio;
        data[i + 2] = b + (255 - b) * bRatio;
    }
};

export const applyFill = (data: Uint8ClampedArray, color: string): void => {
    const { r, g, b } = parseHex(color);

    for (let i = 0; i < data.length; i += 4) {
        data[i] = r;
        data[i + 1] = g;
        data[i + 2] = b;
        data[i + 3] = 255;
    }
};

export const applyNoise = (data: Uint8ClampedArray, value: number): void => {
    const amplitude = value * (255 / 100);

    for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - .5) * 2 * amplitude;
        data[i] += noise;
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

export const applyHue = (data: Uint8ClampedArray, value: number): void => {
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i] / 255;
        const g = data[i + 1] / 255;
        const b = data[i + 2] / 255;

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

        data[i] = (rr * 255 + .5) | 0;
        data[i + 1] = (gg * 255 + .5) | 0;
        data[i + 2] = (bb * 255 + .5) | 0;
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

export const applyChannelMixer = (data: Uint8ClampedArray, matrix: ChannelMixerMatrix): void => {
    const { r: rR, g: gR, b: bR } = matrix;
    const cR = rR.constant ?? 0;
    const cG = gR.constant ?? 0;
    const cB = bR.constant ?? 0;

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        data[i]     = clampU8(r * rR.r + g * rR.g + b * rR.b + cR);
        data[i + 1] = clampU8(r * gR.r + g * gR.g + b * gR.b + cG);
        data[i + 2] = clampU8(r * bR.r + g * bR.g + b * bR.b + cB);
    }
};

export interface SplitToneOptions {
    shadows: string
    highlights: string
    balance?: number
    amount?: number
}

export const applySplitTone = (data: Uint8ClampedArray, options: SplitToneOptions): void => {
    const shadow = parseHex(options.shadows);
    const high = parseHex(options.highlights);
    const balance = (options.balance ?? 0) / 200; // -100..100 → -.5..+.5
    const amount = (options.amount ?? 50) / 100;

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const luma = (r * .3 + g * .59 + b * .11) / 255;

        const shadowWeight = Math.max(0, .5 - luma - balance) * 2 * amount;
        const highlightWeight = Math.max(0, luma - .5 + balance) * 2 * amount;

        data[i] = clampU8(r + shadow.r * shadowWeight + high.r * highlightWeight - 128 * (shadowWeight + highlightWeight));
        data[i + 1] = clampU8(g + shadow.g * shadowWeight + high.g * highlightWeight - 128 * (shadowWeight + highlightWeight));
        data[i + 2] = clampU8(b + shadow.b * shadowWeight + high.b * highlightWeight - 128 * (shadowWeight + highlightWeight));
    }
};

/**
 * Kelvin temperature ([-100, +100] mapped onto a warm/cool gain).
 * Positive values warm the image, negative values cool it.
 * @param value temperature shift
 * @returns the per-channel gain triplet
 */
export const temperatureGain = (value: number): { r: number; g: number; b: number } => {
    const amount = value / 100;
    return {
        r: 1 + amount * .2,
        g: 1 + Math.abs(amount) * 0,
        b: 1 - amount * .2,
    };
};

/**
 * Tint shift ([-100, +100] magenta/green axis).
 * @param value tint shift
 * @returns the per-channel gain triplet
 */
export const tintGain = (value: number): { r: number; g: number; b: number } => {
    const amount = value / 100;
    return {
        r: 1 + amount * .08,
        g: 1 - amount * .15,
        b: 1 + amount * .08,
    };
};
