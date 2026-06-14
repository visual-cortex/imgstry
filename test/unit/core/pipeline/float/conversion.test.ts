import { describe, expect, it } from 'vitest';
import { floatToU8, rgb16ToFloat, u8ToFloat } from '~/core/pipeline/float/conversion';

describe('float pipeline: conversion', () => {
    it('should round-trip a u8 RGBA buffer with no precision loss in 0..255', () => {
        const source = new Uint8ClampedArray([0, 64, 128, 255, 12, 200, 33, 0]);
        const f = u8ToFloat(source);
        const back = new Uint8ClampedArray(source.length);
        floatToU8(f, back);
        expect(Array.from(back)).toEqual(Array.from(source));
    });

    it('should clamp overshoot when writing to u8', () => {
        const f = new Float32Array([2, -1, 1.0001, 0, 0.5, 0.5, 0.5, 1]);
        const out = new Uint8ClampedArray(f.length);
        floatToU8(f, out);
        expect(Array.from(out)).toEqual([255, 0, 255, 0, 128, 128, 128, 255]);
    });

    it('should map black-level samples to 0 and white-level to 1 in linear, then sRGB encode', () => {
        const rgb16 = new Uint16Array([0, 0, 0,  16383, 16383, 16383]);
        const out = rgb16ToFloat(rgb16, {
            blackLevel: 0,
            whiteLevel: 16383,
            whiteBalance: [1, 1, 1],
            exposure: 0,
        });

        expect(out.length).toBe(8);
        // First pixel: black -> 0
        expect(out[0]).toBeCloseTo(0, 5);
        expect(out[1]).toBeCloseTo(0, 5);
        expect(out[2]).toBeCloseTo(0, 5);
        expect(out[3]).toBe(1);
        // Second pixel: white -> 1
        expect(out[4]).toBeCloseTo(1, 5);
        expect(out[5]).toBeCloseTo(1, 5);
        expect(out[6]).toBeCloseTo(1, 5);
        expect(out[7]).toBe(1);
    });

    it('should preserve overshoot when exposure pushes past white', () => {
        const rgb16 = new Uint16Array([8000, 8000, 8000]);
        const out = rgb16ToFloat(rgb16, {
            blackLevel: 0,
            whiteLevel: 16000,
            whiteBalance: [1, 1, 1],
            exposure: 3,
        });

        // 8x exposure on a midtone -> heavily overshoot 1 in sRGB-encoded space.
        expect(out[0]).toBeGreaterThan(1);
        expect(out[1]).toBeGreaterThan(1);
        expect(out[2]).toBeGreaterThan(1);
    });

    it('should reject inverted black / white levels', () => {
        const rgb16 = new Uint16Array([100, 100, 100]);
        expect(() => rgb16ToFloat(rgb16, {
            blackLevel: 500,
            whiteLevel: 100,
            whiteBalance: [1, 1, 1],
            exposure: 0,
        })).toThrow();
    });
});
