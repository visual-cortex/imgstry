// sRGB gamma encoding (IEC 61966-2-1). Two variants:
//   - `srgbEncode`            clamps to [0, 1]; safe to multiply by 255.
//   - `srgbEncodeUnclamped`   preserves overshoot (negative + >1) so the
//                              Float32 pipeline can carry RAW headroom
//                              through subsequent ops without clipping.

/**
 * sRGB gamma encode clamped to the [0, 1] range.
 * @param linear linear-light value
 * @returns the encoded value, clamped to [0, 1]
 */
export const srgbEncode = (linear: number): number => {
    if (linear <= 0) {
        return 0;
    }
    if (linear >= 1) {
        return 1;
    }
    if (linear <= 0.0031308) {
        return 12.92 * linear;
    }
    return 1.055 * Math.pow(linear, 1 / 2.4) - 0.055;
};

/**
 * sRGB gamma encode that preserves overshoot. Use for the Float32
 * pipeline where downstream ops need to see the headroom.
 * @param linear linear-light value (any magnitude)
 * @returns the encoded value (may be <0 or >1)
 */
export const srgbEncodeUnclamped = (linear: number): number => {
    if (linear <= 0) {
        return linear;
    }
    if (linear <= 0.0031308) {
        return 12.92 * linear;
    }
    return 1.055 * Math.pow(linear, 1 / 2.4) - 0.055;
};
