// Camera RGB -> sRGB linear 3x3 matrix derivation. Uses DNG's
// ColorMatrix1 (XYZ -> camera native space under the first calibration
// illuminant, typically D65 / Daylight). The result is then row-
// normalised so neutral camera RGB (post-WB) maps back to neutral sRGB.
//
// This is a deliberate simplification of the full DNG spec (no
// ForwardMatrix, no CameraCalibration, no illuminant blend between
// ColorMatrix1 and ColorMatrix2). The output is "good enough" - colours
// are far closer to the camera's intended look than identity, but a
// production pipeline would still want the full matrix chain.

// Standard sRGB_from_XYZ matrix for the D65 white point (IEC 61966-2-1).
const SRGB_FROM_XYZ_D65: readonly number[] = [
    3.2404542, -1.5371385, -0.4985314,
    -0.9692660,  1.8760108,  0.0415560,
    0.0556434, -0.2040259,  1.0572252,
];

/**
 * Inverts a row-major 3x3 matrix via cofactors. Returns null when the
 * matrix is singular.
 * @param m the 9-entry row-major matrix
 * @returns the inverse, or null
 */
const invert3x3 = (m: readonly number[]): number[] | null => {
    const [a, b, c, d, e, f, g, h, i] = m;
    const det = a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
    if (det === 0 || !isFinite(det)) {
        return null;
    }
    const inv = 1 / det;
    return [
        (e * i - f * h) * inv, (c * h - b * i) * inv, (b * f - c * e) * inv,
        (f * g - d * i) * inv, (a * i - c * g) * inv, (c * d - a * f) * inv,
        (d * h - e * g) * inv, (b * g - a * h) * inv, (a * e - b * d) * inv,
    ];
};

/**
 * Multiplies two row-major 3x3 matrices: result = a * b.
 * @param a left operand
 * @param b right operand
 * @returns the product
 */
const multiply3x3 = (a: readonly number[], b: readonly number[]): number[] => {
    return [
        a[0] * b[0] + a[1] * b[3] + a[2] * b[6],
        a[0] * b[1] + a[1] * b[4] + a[2] * b[7],
        a[0] * b[2] + a[1] * b[5] + a[2] * b[8],
        a[3] * b[0] + a[4] * b[3] + a[5] * b[6],
        a[3] * b[1] + a[4] * b[4] + a[5] * b[7],
        a[3] * b[2] + a[4] * b[5] + a[5] * b[8],
        a[6] * b[0] + a[7] * b[3] + a[8] * b[6],
        a[6] * b[1] + a[7] * b[4] + a[8] * b[7],
        a[6] * b[2] + a[7] * b[5] + a[8] * b[8],
    ];
};

/**
 * Normalises a 3x3 matrix so that `M * [1, 1, 1]^T = [1, 1, 1]^T`.
 * Achieves it by dividing each row by its sum, which lets neutral camera
 * RGB land back on neutral sRGB once the matrix is applied to WB-balanced
 * input.
 * @param m the input matrix
 * @returns the row-normalised copy
 */
const normaliseRows = (m: readonly number[]): number[] => {
    const r0 = m[0] + m[1] + m[2];
    const r1 = m[3] + m[4] + m[5];
    const r2 = m[6] + m[7] + m[8];
    if (r0 === 0 || r1 === 0 || r2 === 0) {
        return [...m];
    }
    return [
        m[0] / r0, m[1] / r0, m[2] / r0,
        m[3] / r1, m[4] / r1, m[5] / r1,
        m[6] / r2, m[7] / r2, m[8] / r2,
    ];
};

/**
 * Builds the camera RGB -> sRGB linear 3x3 matrix from DNG's
 * ColorMatrix1. Returns null when the input is missing or singular.
 * @param colorMatrix1 nine row-major DNG ColorMatrix1 values (XYZ -> camera)
 * @returns the 9-entry row-major camera-to-sRGB matrix, or null
 */
export const cameraToSrgbFromDng = (
    colorMatrix1: readonly number[],
): number[] | null => {
    if (colorMatrix1.length < 9) {
        return null;
    }
    const cameraFromXyz = invert3x3(colorMatrix1);
    if (!cameraFromXyz) {
        return null;
    }
    const cameraToSrgb = multiply3x3(SRGB_FROM_XYZ_D65, cameraFromXyz);
    return normaliseRows(cameraToSrgb);
};
