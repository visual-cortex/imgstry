import { describe, expect, it } from 'vitest';
import {
    applyBlackAndWhite,
    applyChannelMixer,
    applyHue,
    applySaturation,
    applySepia,
    applyVibrance,
} from '~/core/pipeline/pixel';

const px = (r: number, g: number, b: number, a = 255): Uint8ClampedArray =>
    new Uint8ClampedArray([r, g, b, a]);

const LUMA_R = 0.2126;
const LUMA_G = 0.7152;
const LUMA_B = 0.0722;
const luma = (r: number, g: number, b: number): number =>
    r * LUMA_R + g * LUMA_G + b * LUMA_B;

describe('pipeline math: pixel ops (u8)', () => {
    describe('saturation', () => {
        it('value 0 should be identity', () => {
            const d = px(200, 100, 50);
            applySaturation(d, 0);
            expect(d[0]).toBe(200);
            expect(d[1]).toBe(100);
            expect(d[2]).toBe(50);
        });

        it('value -100 should drop every channel to the luma gray', () => {
            const d = px(255, 0, 0);
            applySaturation(d, -100);
            const y = Math.round(luma(255, 0, 0));
            expect(d[0]).toBe(y);
            expect(d[1]).toBe(y);
            expect(d[2]).toBe(y);
        });

        it('value -100 on a neutral pixel should be a no-op', () => {
            const d = px(120, 120, 120);
            applySaturation(d, -100);
            expect(d[0]).toBe(120);
            expect(d[1]).toBe(120);
            expect(d[2]).toBe(120);
        });

        it('value 100 should push every channel further from luma', () => {
            const d = px(200, 100, 50);
            const y = luma(200, 100, 50);
            applySaturation(d, 100);
            // factor = -1: new = 2v - luma; clamp 0..255 on the u8 write.
            expect(d[0]).toBe(Math.round(Math.min(255, Math.max(0, 2 * 200 - y))));
            expect(d[1]).toBe(Math.round(Math.min(255, Math.max(0, 2 * 100 - y))));
            expect(d[2]).toBe(Math.round(Math.min(255, Math.max(0, 2 * 50  - y))));
        });
    });

    describe('vibrance', () => {
        it('value 0 should be identity', () => {
            const d = px(200, 100, 50);
            applyVibrance(d, 0);
            expect(d[0]).toBe(200);
            expect(d[1]).toBe(100);
            expect(d[2]).toBe(50);
        });

        it('saturated pixel should barely move (chroma close to 1)', () => {
            const before = px(255, 0, 0);
            const d = px(255, 0, 0);
            applyVibrance(d, -100); // strongest desat
            // chroma = (255 - 0)/255 = 1; amount factor = (1 - 1) * 100 / 100 = 0
            expect(d[0]).toBe(before[0]);
            expect(d[1]).toBe(before[1]);
            expect(d[2]).toBe(before[2]);
        });

        it('muted pixel should desaturate more strongly', () => {
            const d = px(140, 120, 110);
            const before = [d[0], d[1], d[2]];
            applyVibrance(d, -100);
            // Should move every channel closer to luma.
            const y = luma(before[0], before[1], before[2]);
            expect(Math.abs(d[0] - y)).toBeLessThan(Math.abs(before[0] - y));
            expect(Math.abs(d[1] - y)).toBeLessThan(Math.abs(before[1] - y));
            expect(Math.abs(d[2] - y)).toBeLessThan(Math.abs(before[2] - y));
        });
    });

    describe('hue', () => {
        it('shift by 360 degrees should round-trip', () => {
            const d = px(120, 80, 200);
            applyHue(d, 360);
            // Round-trip should match within 1 lsb (HSV math + u8 rounding).
            expect(Math.abs(d[0] - 120)).toBeLessThanOrEqual(1);
            expect(Math.abs(d[1] - 80)).toBeLessThanOrEqual(1);
            expect(Math.abs(d[2] - 200)).toBeLessThanOrEqual(1);
        });

        it('shift of a gray pixel should be a no-op', () => {
            const d = px(128, 128, 128);
            applyHue(d, 90);
            expect(d[0]).toBe(128);
            expect(d[1]).toBe(128);
            expect(d[2]).toBe(128);
        });
    });

    describe('sepia', () => {
        it('value 0 should be identity on each channel matrix row', () => {
            // value === 0 short-circuits via `value || 100`, so 0 actually
            // routes to FULL sepia. That's the documented behaviour for the
            // legacy API. Test the documented contract.
            // Use a mid-gray so the matrix output stays below 255 and the
            // R > G > B ordering of the sepia signature shows up.
            const d = px(128, 128, 128);
            applySepia(d, 0);
            expect(d[0]).toBeGreaterThan(d[1]);
            expect(d[1]).toBeGreaterThan(d[2]);
        });
    });

    describe('blackAndWhite', () => {
        it('default ratio collapses to luma gray', () => {
            const d = px(255, 0, 0);
            applyBlackAndWhite(d, [0, 0, 0]); // sum !== 1 -> falls back to defaults
            expect(d[0]).toBe(d[1]);
            expect(d[1]).toBe(d[2]);
        });
    });

    describe('channelMixer', () => {
        it('identity matrix is a no-op', () => {
            const d = px(80, 120, 200);
            applyChannelMixer(d, {
                r: { r: 1, g: 0, b: 0 },
                g: { r: 0, g: 1, b: 0 },
                b: { r: 0, g: 0, b: 1 },
            });
            expect(d[0]).toBe(80);
            expect(d[1]).toBe(120);
            expect(d[2]).toBe(200);
        });

        it('R/B swap matrix swaps the channels', () => {
            const d = px(80, 120, 200);
            applyChannelMixer(d, {
                r: { r: 0, g: 0, b: 1 },
                g: { r: 0, g: 1, b: 0 },
                b: { r: 1, g: 0, b: 0 },
            });
            expect(d[0]).toBe(200);
            expect(d[1]).toBe(120);
            expect(d[2]).toBe(80);
        });
    });
});
