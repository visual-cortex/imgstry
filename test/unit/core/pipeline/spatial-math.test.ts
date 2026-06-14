import { describe, expect, it } from 'vitest';
import { applyConvolve, applyVignette } from '~/core/pipeline/spatial';

// Duck-typed ImageData so the test runs in node without jsdom.
// Signature matches the real `new ImageData(data, sw, sh?)` overload.
const makeImage = (data: Uint8ClampedArray, width: number, height: number): ImageData =>
    ({ data, width, height } as ImageData);

const grayImage = (size: number, gray: number): ImageData => {
    const data = new Uint8ClampedArray(size * size * 4);
    for (let i = 0; i < data.length; i += 4) {
        data[i] = gray; data[i + 1] = gray; data[i + 2] = gray; data[i + 3] = 255;
    }
    return makeImage(data, size, size);
};

describe('pipeline math: spatial ops (u8)', () => {
    describe('convolve', () => {
        it('identity kernel should preserve every channel', () => {
            const source = grayImage(4, 120);
            const target = makeImage(new Uint8ClampedArray(source.data.length), 4, 4);
            applyConvolve(source, target, [
                [0, 0, 0],
                [0, 1, 0],
                [0, 0, 0],
            ], 1);
            for (let i = 0; i < target.data.length; i += 4) {
                expect(target.data[i]).toBe(120);
                expect(target.data[i + 1]).toBe(120);
                expect(target.data[i + 2]).toBe(120);
                expect(target.data[i + 3]).toBe(255);
            }
        });

        it('factor multiplies the weighted sum (clamp on write, not before)', () => {
            // Identity kernel + factor 0.5 should halve every channel. The
            // old code applied factor AFTER clamping, which produced the
            // same result for in-range data but the wrong result for
            // factor > 1 with overflow. Test the symmetric case.
            const source = grayImage(2, 200);
            const target = makeImage(new Uint8ClampedArray(source.data.length), 2, 2);
            applyConvolve(source, target, [
                [0, 0, 0],
                [0, 1, 0],
                [0, 0, 0],
            ], 0.5);
            for (let i = 0; i < target.data.length; i += 4) {
                expect(target.data[i]).toBe(100);
            }
        });

        it('blur kernel averages neighbours', () => {
            const data = new Uint8ClampedArray([
                0, 0, 0, 255,    100, 100, 100, 255,
                100, 100, 100, 255, 200, 200, 200, 255,
            ]);
            const source = makeImage(data, 2, 2);
            const target = makeImage(new Uint8ClampedArray(data.length), 2, 2);
            // 3x3 box average kernel
            const k: number[][] = [
                [1 / 9, 1 / 9, 1 / 9],
                [1 / 9, 1 / 9, 1 / 9],
                [1 / 9, 1 / 9, 1 / 9],
            ];
            applyConvolve(source, target, k, 1);
            // After a 3x3 box blur on a 2x2 image (edge-clamped), every
            // pixel ends up as some average of the four inputs.
            for (let i = 0; i < target.data.length; i += 4) {
                const v = target.data[i];
                expect(v).toBeGreaterThan(0);
                expect(v).toBeLessThan(200);
            }
        });
    });

    describe('vignette', () => {
        it('amount 0 should be identity', () => {
            const data = new Uint8ClampedArray(4 * 4 * 4).fill(200);
            for (let i = 3; i < data.length; i += 4) {
                data[i] = 255;
            }
            const before = new Uint8Array(data);
            applyVignette(data, 4, 4, { amount: 0 });
            for (let i = 0; i < data.length; i++) {
                expect(data[i]).toBe(before[i]);
            }
        });

        it('darkens corners more than the centre', () => {
            const data = new Uint8ClampedArray(8 * 8 * 4).fill(200);
            for (let i = 3; i < data.length; i += 4) {
                data[i] = 255;
            }
            applyVignette(data, 8, 8, { amount: -50, midpoint: 30, feather: 50 });
            const center = data[(3 * 8 + 3) * 4];
            const corner = data[(7 * 8 + 7) * 4];
            expect(corner).toBeLessThan(center);
        });
    });
});
