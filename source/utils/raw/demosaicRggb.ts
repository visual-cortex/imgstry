// Bilinear demosaic for an RGGB Bayer pattern. Each output pixel takes
// its native CFA sample directly and averages the closest neighbours of
// the missing two channels. Edge pixels clamp neighbour coordinates.
//
// RGGB layout:
//   (even y, even x) = R       (even y, odd x)  = G1
//   (odd y,  even x) = G2      (odd y,  odd x)  = B

/**
 * Demosaics an RGGB Bayer plane into an interleaved RGB16 buffer using
 * bilinear interpolation.
 * @param bayer the single-channel CFA samples (length = width * height)
 * @param width the image width
 * @param height the image height
 * @returns interleaved RGB samples (length = width * height * 3)
 */
export const demosaicRggbBilinear = (
    bayer: Uint16Array,
    width: number,
    height: number,
): Uint16Array => {
    const out = new Uint16Array(width * height * 3);

    const sample = (x: number, y: number): number => {
        const cx = x < 0 ? 0 : x >= width ? width - 1 : x;
        const cy = y < 0 ? 0 : y >= height ? height - 1 : y;
        return bayer[cy * width + cx];
    };

    for (let y = 0; y < height; y++) {
        const evenY = (y & 1) === 0;
        for (let x = 0; x < width; x++) {
            const evenX = (x & 1) === 0;
            const offset = (y * width + x) * 3;
            const here = bayer[y * width + x];

            const up = sample(x, y - 1);
            const down = sample(x, y + 1);
            const left = sample(x - 1, y);
            const right = sample(x + 1, y);

            if (evenY && evenX) {
                // R native; G = cross-shaped avg; B = diagonal avg
                out[offset] = here;
                out[offset + 1] = (up + down + left + right) >> 2;
                out[offset + 2] = (
                    sample(x - 1, y - 1) + sample(x + 1, y - 1) +
                    sample(x - 1, y + 1) + sample(x + 1, y + 1)
                ) >> 2;
            } else if (evenY && !evenX) {
                // G1: R from left/right, B from up/down
                out[offset] = (left + right) >> 1;
                out[offset + 1] = here;
                out[offset + 2] = (up + down) >> 1;
            } else if (!evenY && evenX) {
                // G2: R from up/down, B from left/right
                out[offset] = (up + down) >> 1;
                out[offset + 1] = here;
                out[offset + 2] = (left + right) >> 1;
            } else {
                // B native; R = diagonal avg; G = cross-shaped avg
                out[offset] = (
                    sample(x - 1, y - 1) + sample(x + 1, y - 1) +
                    sample(x - 1, y + 1) + sample(x + 1, y + 1)
                ) >> 2;
                out[offset + 1] = (up + down + left + right) >> 2;
                out[offset + 2] = here;
            }
        }
    }

    return out;
};
