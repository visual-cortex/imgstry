import { describe, expect, it } from 'vitest';
import { demosaicRggbBilinear } from '~/utils/raw/demosaicRggb';

describe('util: demosaicRggbBilinear', () => {
    it('should return a uniform output for a constant Bayer plane', () => {
        const width = 4;
        const height = 4;
        const bayer = new Uint16Array(width * height).fill(1000);

        const rgb = demosaicRggbBilinear(bayer, width, height);
        expect(rgb.length).toBe(width * height * 3);

        // Constant input -> every interpolated channel equals 1000.
        for (let i = 0; i < rgb.length; i++) {
            expect(rgb[i]).toBe(1000);
        }
    });

    it('should preserve the native sample at each CFA site', () => {
        const width = 4;
        const height = 4;
        const bayer = new Uint16Array([
            100, 200, 100, 200,
            300, 400, 300, 400,
            100, 200, 100, 200,
            300, 400, 300, 400,
        ]);

        const rgb = demosaicRggbBilinear(bayer, width, height);

        // (0,0) is R -> rgb[0] == 100
        expect(rgb[0]).toBe(100);
        // (1,0) is G1 -> rgb[(0*4+1)*3 + 1] == 200
        expect(rgb[1 * 3 + 1]).toBe(200);
        // (0,1) is G2 -> rgb[(1*4+0)*3 + 1] == 300
        expect(rgb[4 * 3 + 1]).toBe(300);
        // (1,1) is B -> rgb[(1*4+1)*3 + 2] == 400
        expect(rgb[(4 + 1) * 3 + 2]).toBe(400);
    });

    it('should interpolate missing channels at a center pixel', () => {
        // 4x4 with all R=100 at red sites, all G=200, all B=300.
        const width = 4;
        const height = 4;
        const bayer = new Uint16Array([
            100, 200, 100, 200,
            200, 300, 200, 300,
            100, 200, 100, 200,
            200, 300, 200, 300,
        ]);

        const rgb = demosaicRggbBilinear(bayer, width, height);

        // (2, 2) is an R site (even, even). Interpolated G should be 200,
        // interpolated B should be 300.
        const offset = (2 * width + 2) * 3;
        expect(rgb[offset]).toBe(100);
        expect(rgb[offset + 1]).toBe(200);
        expect(rgb[offset + 2]).toBe(300);
    });

    it('should clamp at corners without throwing', () => {
        const width = 2;
        const height = 2;
        const bayer = new Uint16Array([
            10, 20,
            30, 40,
        ]);

        const rgb = demosaicRggbBilinear(bayer, width, height);
        expect(rgb.length).toBe(2 * 2 * 3);
        // (0,0) R native, G from (clamped) neighbours = (20+30+30+20)/4 = 25
        expect(rgb[0]).toBe(10);
        // (1,1) B native, G from cross = (20+20+30+30)/4 = 25
        expect(rgb[3 * 3 + 2]).toBe(40);
    });
});
