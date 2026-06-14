// Convert between the canvas-native 8-bit RGBA representation and the
// engine's internal Float32 RGBA buffer. The float buffer keeps values
// in normalised sRGB-encoded space (0..1) but is allowed to over- and
// undershoot during intermediate computations; the final canvas write
// is the only place we clamp + quantise back to 8 bits.

/**
 * Builds a Float32 RGBA buffer from a Uint8ClampedArray. Each channel
 * is divided by 255 so values land in [0, 1].
 * @param data the source canvas pixel data
 * @returns a new Float32 buffer of the same length
 */
export const u8ToFloat = (data: Uint8ClampedArray): Float32Array => {
    const length = data.length;
    const out = new Float32Array(length);
    const inv = 1 / 255;
    for (let i = 0; i < length; i++) {
        out[i] = data[i] * inv;
    }
    return out;
};

/**
 * Clamp + quantise a single float channel to 8 bits.
 * @param value the float channel value (any magnitude)
 * @returns the quantised 0..255 integer
 */
const quantiseU8 = (value: number): number =>
    value <= 0 ? 0 : value >= 1 ? 255 : (value * 255 + .5) | 0;

/**
 * Writes a Float32 RGBA buffer into a Uint8ClampedArray, clamping and
 * quantising each channel. Alpha is forced to fully-opaque when the
 * source value is missing or out of range.
 * @param source the float buffer to read from
 * @param target the canvas-shaped buffer to write into
 */
export const floatToU8 = (
    source: Float32Array,
    target: Uint8ClampedArray,
): void => {
    const length = source.length;
    for (let i = 0; i < length; i += 4) {
        target[i]     = quantiseU8(source[i]);
        target[i + 1] = quantiseU8(source[i + 1]);
        target[i + 2] = quantiseU8(source[i + 2]);
        target[i + 3] = quantiseU8(source[i + 3]);
    }
};

/**
 * Builds an opaque RGBA float buffer (alpha = 1) from interleaved 16-bit
 * linear sensor samples, given black/white levels, per-channel white
 * balance multipliers, and exposure compensation in stops. Output is in
 * sRGB-encoded space with values >1 preserved so subsequent ops still
 * see the headroom.
 * @param rgb16 interleaved RGB linear samples (length = width*height*3)
 * @param options sensor pipeline parameters
 * @param options.blackLevel black level (raw counts)
 * @param options.whiteLevel white level (raw counts)
 * @param options.whiteBalance per-channel multipliers (R, G, B)
 * @param options.exposure exposure compensation in stops
 * @returns a Float32 RGBA buffer (length = width*height*4)
 */
export const rgb16ToFloat = (
    rgb16: Uint16Array,
    options: {
        blackLevel: number
        whiteLevel: number
        whiteBalance: readonly [number, number, number]
        exposure: number
    },
): Float32Array => {
    const pixels = rgb16.length / 3;
    const out = new Float32Array(pixels * 4);

    const { blackLevel, whiteLevel, whiteBalance, exposure } = options;
    const span = whiteLevel - blackLevel;
    if (span <= 0) {
        throw new Error('rgb16ToFloat: whiteLevel must exceed blackLevel');
    }

    const stops = Math.pow(2, exposure);
    const gainR = whiteBalance[0] * stops;
    const gainG = whiteBalance[1] * stops;
    const gainB = whiteBalance[2] * stops;
    const inv = 1 / span;

    for (let i = 0, o = 0; i < rgb16.length; i += 3, o += 4) {
        const lr = (rgb16[i] - blackLevel) * inv * gainR;
        const lg = (rgb16[i + 1] - blackLevel) * inv * gainG;
        const lb = (rgb16[i + 2] - blackLevel) * inv * gainB;

        // sRGB encode, preserving overshoot for headroom downstream.
        out[o]     = srgbEncodeAllowOvershoot(lr);
        out[o + 1] = srgbEncodeAllowOvershoot(lg);
        out[o + 2] = srgbEncodeAllowOvershoot(lb);
        out[o + 3] = 1;
    }

    return out;
};

const srgbEncodeAllowOvershoot = (linear: number): number => {
    if (linear <= 0) {
        return linear;
    }
    if (linear <= 0.0031308) {
        return 12.92 * linear;
    }
    return 1.055 * Math.pow(linear, 1 / 2.4) - 0.055;
};
