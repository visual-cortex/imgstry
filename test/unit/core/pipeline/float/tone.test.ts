import { describe, expect, it } from 'vitest';
import {
    applyBrightness,
    applyContrast,
    applyExposure,
    applyGain,
    applyGamma,
    applyInvert,
    applyToneRegion,
    temperatureGain,
    tintGain,
} from '~/core/pipeline/float/tone';

const buf = (...values: number[]): Float32Array => new Float32Array(values);

describe('float pipeline: tone ops', () => {
    it('should add a brightness delta in 0..1 domain', () => {
        const d = buf(.2, .4, .6, 1);
        applyBrightness(d, 20);
        expect(d[0]).toBeCloseTo(.4);
        expect(d[1]).toBeCloseTo(.6);
        expect(d[2]).toBeCloseTo(.8);
    });

    it('should pivot contrast around 0.5', () => {
        const d = buf(.5, .5, .5, 1);
        applyContrast(d, 50);
        expect(d[0]).toBeCloseTo(.5);
        expect(d[1]).toBeCloseTo(.5);
        expect(d[2]).toBeCloseTo(.5);
    });

    it('should invert about 1', () => {
        const d = buf(.25, .5, .75, 1);
        applyInvert(d);
        expect(d[0]).toBeCloseTo(.75);
        expect(d[1]).toBeCloseTo(.5);
        expect(d[2]).toBeCloseTo(.25);
    });

    it('should apply exposure as a power-of-2 multiplier', () => {
        const d = buf(.25, .25, .25, 1);
        applyExposure(d, 1);
        expect(d[0]).toBeCloseTo(.5);
        expect(d[1]).toBeCloseTo(.5);
        expect(d[2]).toBeCloseTo(.5);
    });

    it('should apply per-channel gain', () => {
        const d = buf(.5, .5, .5, 1);
        applyGain(d, { r: 2, g: 1, b: .5 });
        expect(d[0]).toBeCloseTo(1);
        expect(d[1]).toBeCloseTo(.5);
        expect(d[2]).toBeCloseTo(.25);
    });

    it('should pow channels for gamma', () => {
        const d = buf(.25, .25, .25, 1);
        applyGamma(d, 50); // exponent = 0.5 -> sqrt
        expect(d[0]).toBeCloseTo(.5);
        expect(d[1]).toBeCloseTo(.5);
        expect(d[2]).toBeCloseTo(.5);
    });

    it('should lift shadows but not highlights', () => {
        const lo = buf(.1, .1, .1, 1);
        const hi = buf(.9, .9, .9, 1);
        applyToneRegion(lo, 50, 'shadows');
        applyToneRegion(hi, 50, 'shadows');
        // Shadows weight = (1 - x)^2; at .1 the lift is ~.5 * .81 = .405
        expect(lo[0]).toBeGreaterThan(.1);
        // At .9 the lift is ~.5 * .01 = .005, barely moves
        expect(hi[0]).toBeCloseTo(.9, 1);
    });

    it('temperatureGain should warm with positive values', () => {
        const gain = temperatureGain(100);
        expect(gain.r).toBeGreaterThan(1);
        expect(gain.b).toBeLessThan(1);
        expect(gain.g).toBe(1);
    });

    it('tintGain should push green negative with positive values', () => {
        const gain = tintGain(100);
        expect(gain.g).toBeLessThan(1);
    });
});
