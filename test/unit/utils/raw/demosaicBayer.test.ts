import { describe, expect, it } from 'vitest';
import { cfaPatternFromBytes, demosaicBayerBilinear } from '~/utils/raw/demosaicBayer';

describe('util: demosaicBayerBilinear', () => {
    it('should return a uniform output for a constant Bayer plane (any pattern)', () => {
        const width = 4;
        const height = 4;
        const bayer = new Uint16Array(width * height).fill(1000);
        for (const pattern of ['RGGB', 'BGGR', 'GRBG', 'GBRG'] as const) {
            const rgb = demosaicBayerBilinear(bayer, width, height, pattern);
            expect(rgb.length).toBe(width * height * 3);
            for (let i = 0; i < rgb.length; i++) {
                expect(rgb[i]).toBe(1000);
            }
        }
    });

    it('should preserve the native sample at each CFA site for RGGB', () => {
        const width = 4;
        const height = 4;
        const bayer = new Uint16Array([
            100, 200, 100, 200,
            300, 400, 300, 400,
            100, 200, 100, 200,
            300, 400, 300, 400,
        ]);
        const rgb = demosaicBayerBilinear(bayer, width, height, 'RGGB');

        // (0,0) R native
        expect(rgb[0]).toBe(100);
        // (1,0) G_r native
        expect(rgb[1 * 3 + 1]).toBe(200);
        // (0,1) G_b native
        expect(rgb[4 * 3 + 1]).toBe(300);
        // (1,1) B native
        expect(rgb[(4 + 1) * 3 + 2]).toBe(400);
    });

    it('should map BGGR to swapped R/B compared to RGGB', () => {
        const width = 4;
        const height = 4;
        const bayer = new Uint16Array([
            100, 200, 100, 200,
            300, 400, 300, 400,
            100, 200, 100, 200,
            300, 400, 300, 400,
        ]);
        const rgb = demosaicBayerBilinear(bayer, width, height, 'BGGR');

        // (0,0) is B in BGGR
        expect(rgb[2]).toBe(100);
        // (1,1) is R in BGGR
        expect(rgb[(4 + 1) * 3]).toBe(400);
    });

    it('cfaPatternFromBytes maps all four supported patterns', () => {
        expect(cfaPatternFromBytes([0, 1, 1, 2])).toBe('RGGB');
        expect(cfaPatternFromBytes([2, 1, 1, 0])).toBe('BGGR');
        expect(cfaPatternFromBytes([1, 0, 2, 1])).toBe('GRBG');
        expect(cfaPatternFromBytes([1, 2, 0, 1])).toBe('GBRG');
    });

    it('cfaPatternFromBytes returns null for unsupported layouts (e.g. X-Trans)', () => {
        // X-Trans uses a 6x6 pattern; the first 4 entries don't match any
        // standard 2x2 Bayer permutation.
        expect(cfaPatternFromBytes([1, 1, 2, 0])).toBeNull();
        expect(cfaPatternFromBytes([0, 0, 0, 0])).toBeNull();
    });

    it('should clamp at corners without throwing', () => {
        const width = 2;
        const height = 2;
        const bayer = new Uint16Array([10, 20, 30, 40]);
        const rgb = demosaicBayerBilinear(bayer, width, height, 'RGGB');
        expect(rgb.length).toBe(2 * 2 * 3);
        expect(rgb[0]).toBe(10);
        expect(rgb[3 * 3 + 2]).toBe(40);
    });
});
