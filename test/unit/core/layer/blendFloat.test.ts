import { describe, expect, it } from 'vitest';
import { blendFloatInto } from '~/core/layer/blend';

const px = (r: number, g: number, b: number, a = 1): Float32Array =>
    new Float32Array([r, g, b, a]);

describe('layer: blendFloatInto', () => {
    it('normal blend with fully-opaque source should replace base', () => {
        const base = px(.1, .2, .3);
        blendFloatInto(base, px(.7, .8, .9), 'normal', 1);
        expect(base[0]).toBeCloseTo(.7);
        expect(base[1]).toBeCloseTo(.8);
        expect(base[2]).toBeCloseTo(.9);
    });

    it('multiply blend on white base should equal source', () => {
        const base = px(1, 1, 1);
        blendFloatInto(base, px(.5, .25, .1), 'multiply', 1);
        expect(base[0]).toBeCloseTo(.5);
        expect(base[1]).toBeCloseTo(.25);
        expect(base[2]).toBeCloseTo(.1);
    });

    it('zero source alpha leaves base untouched', () => {
        const base = px(.4, .5, .6);
        blendFloatInto(base, px(.7, .7, .7, 0), 'normal', 1);
        expect(base[0]).toBeCloseTo(.4);
        expect(base[1]).toBeCloseTo(.5);
        expect(base[2]).toBeCloseTo(.6);
    });

    it('should preserve overshoot from the source through the blend', () => {
        const base = px(.5, .5, .5);
        blendFloatInto(base, px(1.4, 1.4, 1.4), 'normal', 1);
        // Normal blend at full opacity = source, with overshoot intact.
        expect(base[0]).toBeCloseTo(1.4);
        expect(base[1]).toBeCloseTo(1.4);
        expect(base[2]).toBeCloseTo(1.4);
    });

    it('partial opacity should mix base + source', () => {
        const base = px(0, 0, 0);
        blendFloatInto(base, px(1, 1, 1), 'normal', .5);
        expect(base[0]).toBeCloseTo(.5);
    });
});
