import { describe, expect, it } from 'vitest';
import { tonemap16to8 } from '~/utils/raw/tonemap16';

describe('util: tonemap16to8', () => {
    it('should map black-level samples to 0 and white-level to 255', () => {
        const rgb = new Uint16Array([
            0, 0, 0,
            16383, 16383, 16383,
        ]);

        const out = tonemap16to8(rgb, 2, 1, {
            blackLevel: 0,
            whiteLevel: 16383,
            whiteBalance: [1, 1, 1],
            exposure: 0,
        });

        expect(out[0]).toBe(0);
        expect(out[1]).toBe(0);
        expect(out[2]).toBe(0);
        expect(out[3]).toBe(255);
        expect(out[4]).toBe(255);
        expect(out[5]).toBe(255);
        expect(out[6]).toBe(255);
        expect(out[7]).toBe(255);
    });

    it('should respect black-level offset', () => {
        const rgb = new Uint16Array([
            512, 512, 512,
        ]);

        const out = tonemap16to8(rgb, 1, 1, {
            blackLevel: 512,
            whiteLevel: 16383,
            whiteBalance: [1, 1, 1],
            exposure: 0,
        });

        // Pixel sits at black level -> linear 0 -> output 0
        expect(out[0]).toBe(0);
        expect(out[1]).toBe(0);
        expect(out[2]).toBe(0);
    });

    it('should clip when exposure pushes past white', () => {
        const rgb = new Uint16Array([8000, 8000, 8000]);

        const out = tonemap16to8(rgb, 1, 1, {
            blackLevel: 0,
            whiteLevel: 16000,
            whiteBalance: [1, 1, 1],
            exposure: 3, // +3 stops -> 8x gain
        });

        expect(out[0]).toBe(255);
        expect(out[1]).toBe(255);
        expect(out[2]).toBe(255);
    });

    it('should clip when exposure pushes below black', () => {
        const rgb = new Uint16Array([100, 100, 100]);

        const out = tonemap16to8(rgb, 1, 1, {
            blackLevel: 0,
            whiteLevel: 16000,
            whiteBalance: [1, 1, 1],
            exposure: -8,
        });

        expect(out[0]).toBe(0);
    });

    it('should apply per-channel white balance', () => {
        const rgb = new Uint16Array([4000, 4000, 4000]);

        const out = tonemap16to8(rgb, 1, 1, {
            blackLevel: 0,
            whiteLevel: 16000,
            whiteBalance: [2, 1, 1.5],
            exposure: 0,
        });

        // Red channel got 2x gain -> higher 8-bit value than green.
        expect(out[0]).toBeGreaterThan(out[1]);
        // Blue channel got 1.5x gain -> between R and G.
        expect(out[2]).toBeGreaterThan(out[1]);
        expect(out[2]).toBeLessThan(out[0]);
    });

    it('should reject inverted black / white levels', () => {
        const rgb = new Uint16Array([100, 100, 100]);

        expect(() => tonemap16to8(rgb, 1, 1, {
            blackLevel: 500,
            whiteLevel: 100,
            whiteBalance: [1, 1, 1],
            exposure: 0,
        })).toThrow();
    });
});
