// 16-bit linear sensor data -> 8-bit RGBA via:
//   1. Subtract black level + normalise against white-black span
//   2. Apply per-channel white-balance multipliers
//   3. Multiply by 2^exposure (stops)
//   4. Apply sRGB-ish gamma encoding (piecewise approximation)
//   5. Quantise to 8 bits + write alpha = 255
//
// White-balance multipliers should be normalised so that the largest is
// the channel needing least gain. Callers commonly pass 1 / AsShotNeutral
// per channel, with the green channel scaled to its native max.

import { srgbEncode } from '~/utils/color';

export interface TonemapOptions {
    /** Sensor black-level (0..maxRaw). */
    blackLevel: number
    /** Sensor white-level (> blackLevel, <= 2^precision - 1). */
    whiteLevel: number
    /** Per-channel multipliers applied in linear space, R/G/B order. */
    whiteBalance: readonly [number, number, number]
    /** Exposure compensation in stops (additive, applied after WB). */
    exposure: number
}

/**
 * Converts a linear 16-bit RGB buffer to 8-bit RGBA in sRGB.
 * @param rgb16 interleaved RGB samples (length = width * height * 3)
 * @param width image width
 * @param height image height
 * @param options black/white levels, white balance, exposure
 * @returns RGBA8 buffer suitable for ImageData
 */
export const tonemap16to8 = (
    rgb16: Uint16Array,
    width: number,
    height: number,
    options: TonemapOptions,
): Uint8ClampedArray => {
    const { blackLevel, whiteLevel, whiteBalance, exposure } = options;
    const span = whiteLevel - blackLevel;
    if (span <= 0) {
        throw new Error('tonemap16to8: whiteLevel must exceed blackLevel');
    }

    const stops = Math.pow(2, exposure);
    const gainR = whiteBalance[0] * stops;
    const gainG = whiteBalance[1] * stops;
    const gainB = whiteBalance[2] * stops;
    const inv = 1 / span;

    const out = new Uint8ClampedArray(width * height * 4);

    for (let i = 0, o = 0; i < rgb16.length; i += 3, o += 4) {
        const lr = (rgb16[i] - blackLevel) * inv * gainR;
        const lg = (rgb16[i + 1] - blackLevel) * inv * gainG;
        const lb = (rgb16[i + 2] - blackLevel) * inv * gainB;

        out[o]     = (srgbEncode(lr) * 255 + .5) | 0;
        out[o + 1] = (srgbEncode(lg) * 255 + .5) | 0;
        out[o + 2] = (srgbEncode(lb) * 255 + .5) | 0;
        out[o + 3] = 255;
    }

    return out;
};
