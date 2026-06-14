import { describe, expect, it } from 'vitest';
import {
    applyBlackAndWhite,
    applyChannelMixer,
    applyFill,
    applyHue,
    applySaturation,
    applySepia,
    applyTint,
    applyVibrance,
} from '~/core/pipeline/float/pixel';

const pixel = (r: number, g: number, b: number): Float32Array =>
    new Float32Array([r, g, b, 1]);

describe('float pipeline: pixel ops', () => {
    it('saturation 100 should push non-max channels further from max', () => {
        const d = pixel(.5, .25, .1);
        applySaturation(d, 100);
        // factor = -1: max channel stays put, others move away from max
        expect(d[0]).toBeCloseTo(.5);
        expect(d[1]).toBeCloseTo(0);
        expect(d[2]).toBeCloseTo(-.3);
    });

    it('saturation -100 should produce a flat colour', () => {
        const d = pixel(.5, .25, .1);
        applySaturation(d, -100);
        // factor = +1; new = v + (max - v) = max
        expect(d[0]).toBeCloseTo(.5);
        expect(d[1]).toBeCloseTo(.5);
        expect(d[2]).toBeCloseTo(.5);
    });

    it('vibrance 0 should be identity', () => {
        const d = pixel(.4, .3, .2);
        applyVibrance(d, 0);
        expect(d[0]).toBeCloseTo(.4);
        expect(d[1]).toBeCloseTo(.3);
        expect(d[2]).toBeCloseTo(.2);
    });

    it('sepia 100 should produce a brown-shifted output', () => {
        const d = pixel(1, 1, 1);
        applySepia(d, 100);
        // sepia of white: R=1*(1-.607)+1*.769+1*.189 = 1.351 (overshoot)
        // G = .349 + .686 + .168 = 1.203
        // B = .272 + .534 + .131 = .937
        expect(d[0]).toBeGreaterThan(d[1]);
        expect(d[1]).toBeGreaterThan(d[2]);
    });

    it('black & white with default ratio collapses to luma', () => {
        const d = pixel(1, 0, 0);
        applyBlackAndWhite(d, [0, 0, 0]); // invalid ratio -> default
        const expected = 1 * .3;
        expect(d[0]).toBeCloseTo(expected);
        expect(d[1]).toBeCloseTo(expected);
        expect(d[2]).toBeCloseTo(expected);
    });

    it('tint should lift each channel toward the tint colour', () => {
        const d = pixel(0, 0, 0);
        applyTint(d, '#ff0000');
        expect(d[0]).toBeCloseTo(1);
        expect(d[1]).toBeCloseTo(0);
        expect(d[2]).toBeCloseTo(0);
    });

    it('fill should overwrite with the colour', () => {
        const d = pixel(.5, .25, .1);
        applyFill(d, '#80c000');
        expect(d[0]).toBeCloseTo(0x80 / 255);
        expect(d[1]).toBeCloseTo(0xc0 / 255);
        expect(d[2]).toBeCloseTo(0);
    });

    it('channel mixer identity matrix should be a no-op', () => {
        const d = pixel(.3, .5, .7);
        applyChannelMixer(d, {
            r: { r: 1, g: 0, b: 0 },
            g: { r: 0, g: 1, b: 0 },
            b: { r: 0, g: 0, b: 1 },
        });
        expect(d[0]).toBeCloseTo(.3);
        expect(d[1]).toBeCloseTo(.5);
        expect(d[2]).toBeCloseTo(.7);
    });

    it('hue shift 360 degrees should be near-identity', () => {
        const d = pixel(.4, .2, .8);
        applyHue(d, 360);
        expect(d[0]).toBeCloseTo(.4, 4);
        expect(d[1]).toBeCloseTo(.2, 4);
        expect(d[2]).toBeCloseTo(.8, 4);
    });
});
