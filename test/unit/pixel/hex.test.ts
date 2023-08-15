import { describe, expect, it } from 'vitest';
import { COLOR_MAP } from 'test/color';
import { Hex } from '~/pixel';

describe('class: Hex', () => {
    it('should have black initially', () => {
        const color = new Hex();

        expect(color.value).eql('#000000');
    });

    Object.keys(COLOR_MAP).forEach(key => {
        const colorDefinition = COLOR_MAP[key] as any;

        it(`should convert ${key} correctly to RGB`, () => {
            const rgb = colorDefinition.rgb;
            const hex = colorDefinition.hex;
            const color = new Hex(hex);

            const result = color.toRgb();

            expect(result.r).approximately(rgb.r, 1);
            expect(result.g).approximately(rgb.g, 1);
            expect(result.b).approximately(rgb.b, 1);
        });

        it(`should convert ${key} correctly to HEX`, () => {
            const hex = colorDefinition.hex;
            const color = new Hex(hex);

            const result = color.toHex();

            expect(result.value).eql(hex);
        });

        it(`should convert ${key} correctly to CMYK`, () => {
            const hex = colorDefinition.hex;
            const cmyk = colorDefinition.cmyk;
            const color = new Hex(hex);

            const result = color.toCmyk();

            expect(result.c).approximately(cmyk.c, 1);
            expect(result.m).approximately(cmyk.m, 1);
            expect(result.y).approximately(cmyk.y, 1);
            expect(result.k).approximately(cmyk.k, .01);
        });

        it(`should convert ${key} correctly to HSV`, () => {
            const hex = new Hex(colorDefinition.hex);
            const hsv = colorDefinition.hsv;
            const color = hex.toHsv();

            expect(color.h).approximately(hsv.h, .1);
            expect(color.s).approximately(hsv.s, .1);
            expect(color.v).approximately(hsv.v, .01);
        });
    });

    it('should clamp correctly', () => {
        let color = new Hex('#012345');
        expect(color.clamp().value).eql('#012345');

        color = new Hex('#6789AB');
        expect(color.clamp().value).eql('#6789AB');

        color = new Hex('#CDEFEF');
        expect(color.clamp().value).eql('#CDEFEF');

        color = new Hex('#AGAGAG');
        expect(color.clamp().value).eql('#AFAFAF');

        color = new Hex('#GGGGGG');
        expect(color.clamp().value).eql('#FFFFFF');

        color = new Hex('#$$$GGG');
        expect(color.clamp().value).eql('#000FFF');
    });
});
