import { describe, expect, it } from 'vitest';
import { COLOR_MAP } from 'test/color';
import { hexToRgb } from 'test/utils';
import { Cmyk } from '~/pixel';

describe('class: Cmyk', () => {
    it('should have all channels 0 initially', () => {
        const color = new Cmyk();

        expect(color.c).eql(0);
        expect(color.m).eql(0);
        expect(color.y).eql(0);
        expect(color.k).eql(0);
    });

    Object.keys(COLOR_MAP).forEach(key => {
        const colorDefinition = COLOR_MAP[key] as any;

        it(`should convert ${key} correctly to RGB`, () => {
            const rgb = colorDefinition.rgb;
            const cmyk = colorDefinition.cmyk;
            const color = new Cmyk(cmyk);

            const result = color.toRgb();

            expect(result.r).approximately(rgb.r, 5);
            expect(result.g).approximately(rgb.g, 5);
            expect(result.b).approximately(rgb.b, 5);
        });

        it(`should convert ${key} correctly to HEX`, () => {
            const cmyk = colorDefinition.cmyk;
            const color = new Cmyk(cmyk);

            const result = hexToRgb(color.toHex().value);
            const expected = hexToRgb(colorDefinition.hex);

            expect(result[0]).approximately(expected[0], 5);
            expect(result[1]).approximately(expected[1], 5);
            expect(result[2]).approximately(expected[2], 5);
        });

        it(`should convert ${key} correctly to CMYK`, () => {
            const cmyk = colorDefinition.cmyk;
            const color = new Cmyk(cmyk);

            const result = color.toCmyk();

            expect(result.c).equals(cmyk.c);
            expect(result.m).equals(cmyk.m);
            expect(result.y).equals(cmyk.y);
            expect(result.k).equals(cmyk.k);
        });

        it(`should convert ${key} correctly to HSV`, () => {
            const hsv = colorDefinition.hsv;
            const cmyk = colorDefinition.cmyk;
            const color = new Cmyk(cmyk);
            const result = color.toHsv();

            expect(result.h).approximately(hsv.h, 7);
            expect(result.s).approximately(hsv.s, .1);
            expect(result.v).approximately(hsv.v, .1);
        });
    });

    it('should clamp correctly', () => {
        let color = new Cmyk({
            c: 0,
            m: 0,
            y: 0,
            k: 0,
        }).clamp();

        expect(color.c).equal(0);
        expect(color.m).equal(0);
        expect(color.y).equal(0);
        expect(color.k).equal(0);

        color = new Cmyk({
            c: 1,
            m: 1,
            y: 1,
            k: 1,
        }).clamp();

        expect(color.c).equal(1);
        expect(color.m).equal(1);
        expect(color.y).equal(1);
        expect(color.k).equal(1);

        color = new Cmyk({
            c: -1,
            m: -1,
            y: -1,
            k: -1,
        }).clamp();

        expect(color.c).equal(0);
        expect(color.m).equal(0);
        expect(color.y).equal(0);
        expect(color.k).equal(0);

        color = new Cmyk({
            c: 2,
            m: 2,
            y: 2,
            k: 2,
        }).clamp();

        expect(color.c).equal(1);
        expect(color.m).equal(1);
        expect(color.y).equal(1);
        expect(color.k).equal(1);
    });
});
