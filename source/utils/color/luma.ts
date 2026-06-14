// Luma coefficients used across the pipeline. Rec. 709 matches sRGB
// primaries (modern displays) and is the right choice for both u8 and
// float pipelines. Some ops historically used Rec. 601 (NTSC); we
// standardise on 709 for new code and document divergence in op
// comments where the legacy weights still ship.

/** Rec. 709 luma weight for the red channel. */
export const LUMA_R = 0.2126;
/** Rec. 709 luma weight for the green channel. */
export const LUMA_G = 0.7152;
/** Rec. 709 luma weight for the blue channel. */
export const LUMA_B = 0.0722;

/**
 * Computes Rec. 709 luma for an RGB triplet in any consistent domain
 * (u8 0..255 or float 0..1). Output domain matches input.
 * @param r red channel
 * @param g green channel
 * @param b blue channel
 * @returns the weighted luminance
 */
export const luma709 = (r: number, g: number, b: number): number =>
    r * LUMA_R + g * LUMA_G + b * LUMA_B;
