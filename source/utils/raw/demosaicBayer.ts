
// Bilinear demosaic for any 2x2 Bayer CFA pattern. Each output pixel
// keeps its native sample and bilinearly interpolates the missing two
// channels from neighbours; edge pixels clamp neighbour coordinates.
//
// Site classification:
//   R   - red native;        G = cross-avg, B = diagonal-avg
//   B   - blue native;       G = cross-avg, R = diagonal-avg
//   G_r - green near R row;  R = horizontal avg, B = vertical avg
//   G_b - green near B row;  R = vertical avg,   B = horizontal avg

export type BayerPattern = 'RGGB' | 'BGGR' | 'GRBG' | 'GBRG';

type Site = 'R' | 'B' | 'Gr' | 'Gb';

const PATTERN_SITES: Readonly<Record<BayerPattern, [Site, Site, Site, Site]>> = {
    // Order: (even y, even x), (even y, odd x), (odd y, even x), (odd y, odd x)
    RGGB: ['R',  'Gr', 'Gb', 'B'],
    BGGR: ['B',  'Gb', 'Gr', 'R'],
    GRBG: ['Gr', 'R',  'B',  'Gb'],
    GBRG: ['Gb', 'B',  'R',  'Gr'],
};

/**
 * Maps a 4-byte CFA pattern (DNG / TIFF-EP CFAPattern tag) to the
 * matching `BayerPattern` symbol. Returns null for non-Bayer or
 * unsupported layouts (e.g. Fuji X-Trans).
 * @param pattern the 4-entry CFA array (values: 0=R, 1=G, 2=B)
 * @returns the matched pattern, or null
 */
export const cfaPatternFromBytes = (
    pattern: readonly number[],
): BayerPattern | null => {
    if (pattern.length < 4) {
        return null;
    }
    const [a, b, c, d] = pattern;
    if (a === 0 && b === 1 && c === 1 && d === 2) {
        return 'RGGB';
    }
    if (a === 2 && b === 1 && c === 1 && d === 0) {
        return 'BGGR';
    }
    if (a === 1 && b === 0 && c === 2 && d === 1) {
        return 'GRBG';
    }
    if (a === 1 && b === 2 && c === 0 && d === 1) {
        return 'GBRG';
    }
    return null;
};

/**
 * Demosaics a Bayer-patterned plane into an interleaved RGB16 buffer
 * using bilinear interpolation.
 * @param bayer the single-channel CFA samples (length = width * height)
 * @param width image width
 * @param height image height
 * @param pattern the 2x2 Bayer pattern
 * @returns interleaved RGB samples (length = width * height * 3)
 */
export const demosaicBayerBilinear = (
    bayer: Uint16Array,
    width: number,
    height: number,
    pattern: BayerPattern,
): Uint16Array => {
    const out = new Uint16Array(width * height * 3);
    const sites = PATTERN_SITES[pattern];

    const sample = (x: number, y: number): number => {
        const cx = x < 0 ? 0 : x >= width ? width - 1 : x;
        const cy = y < 0 ? 0 : y >= height ? height - 1 : y;
        return bayer[cy * width + cx];
    };

    for (let y = 0; y < height; y++) {
        const oddY = y & 1;
        for (let x = 0; x < width; x++) {
            const oddX = x & 1;
            const site = sites[oddY * 2 + oddX];
            const offset = (y * width + x) * 3;
            const here = bayer[y * width + x];

            const up    = sample(x, y - 1);
            const down  = sample(x, y + 1);
            const left  = sample(x - 1, y);
            const right = sample(x + 1, y);

            switch (site) {
                case 'R':
                    out[offset]     = here;
                    out[offset + 1] = (up + down + left + right) >> 2;
                    out[offset + 2] = (
                        sample(x - 1, y - 1) + sample(x + 1, y - 1) +
                        sample(x - 1, y + 1) + sample(x + 1, y + 1)
                    ) >> 2;
                    break;
                case 'B':
                    out[offset]     = (
                        sample(x - 1, y - 1) + sample(x + 1, y - 1) +
                        sample(x - 1, y + 1) + sample(x + 1, y + 1)
                    ) >> 2;
                    out[offset + 1] = (up + down + left + right) >> 2;
                    out[offset + 2] = here;
                    break;
                case 'Gr':
                    out[offset]     = (left + right) >> 1;
                    out[offset + 1] = here;
                    out[offset + 2] = (up + down) >> 1;
                    break;
                case 'Gb':
                    out[offset]     = (up + down) >> 1;
                    out[offset + 1] = here;
                    out[offset + 2] = (left + right) >> 1;
                    break;
                default:
                    break;
            }
        }
    }

    return out;
};
