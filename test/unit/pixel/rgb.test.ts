import { describe, expect, it } from 'vitest';
import { COLOR_MAP } from 'test/color';
import { hexToRgb } from 'test/utils';
import { Rgb } from '~/pixel';

describe('class: Rgb', () => {
    it('should have all channels 0 initially', () => {
        const color = new Rgb();
        expect(color.r).eql(0);
        expect(color.g).eql(0);
        expect(color.b).eql(0);
    });

    Object.keys(COLOR_MAP).forEach(key => {
        const colorDefinition = COLOR_MAP[key] as any;
        it(`should convert ${key} correctly to HSV`, () => {
            const rgb = colorDefinition.rgb;
            const hsv = colorDefinition.hsv;

            const color = new Rgb(rgb);

            const result = color.toHsv();

            expect(result.h).approximately(hsv.h, .1);
            expect(result.s).approximately(hsv.s, .1);
            expect(result.v).approximately(hsv.v, .1);
        });

        it(`should convert ${key} correctly to HEX`, () => {
            const rgb = colorDefinition.rgb;

            const result = hexToRgb(new Rgb(rgb).toHex().value);
            const expected = hexToRgb(colorDefinition.hex);

            expect(result[0]).approximately(expected[0], .1);
            expect(result[1]).approximately(expected[1], .1);
            expect(result[2]).approximately(expected[2], .1);
        });

        it(`should convert ${key} correctly to CMYK`, () => {
            const rgb = colorDefinition.rgb;
            const cmyk = colorDefinition.cmyk;
            const color = new Rgb(rgb);

            const result = color.toCmyk();

            expect(result.c).approximately(cmyk.c, 1);
            expect(result.m).approximately(cmyk.m, 1);
            expect(result.y).approximately(cmyk.y, 1);
            expect(result.k).approximately(cmyk.k, .01);
        });

        it(`should convert ${key} correctly to RGB`, () => {
            const rgb = new Rgb(colorDefinition.rgb);
            const color = rgb.toRgb();
            expect(color.r).eql(rgb.r);
            expect(color.g).eql(rgb.g);
            expect(color.b).eql(rgb.b);
        });
    });

    it('should clamp correctly', () => {
    // interior limits
        let color = new Rgb({
            r: 0,
            g: 0,
            b: 0,
        }).clamp();

        expect(color.r).eql(0);
        expect(color.g).eql(0);
        expect(color.b).eql(0);

        color = new Rgb({
            r: 255,
            g: 255,
            b: 255,
        }).clamp();

        expect(color.r).eql(255);
        expect(color.g).eql(255);
        expect(color.b).eql(255);

        // exterior limits
        color = new Rgb({
            r: -1,
            g: -1,
            b: -1,
        }).clamp();

        expect(color.r).eql(0);
        expect(color.g).eql(0);
        expect(color.b).eql(0);

        color = new Rgb({
            r: 256,
            g: 256,
            b: 256,
        }).clamp();

        expect(color.r).eql(255);
        expect(color.g).eql(255);
        expect(color.b).eql(255);

        Object.keys(COLOR_MAP).forEach(key => {
            const colorDefinition = COLOR_MAP[key] as any;
            color = new Rgb(colorDefinition.rgb).clamp();

            expect(color.r).eql(colorDefinition.rgb.r);
            expect(color.g).eql(colorDefinition.rgb.g);
            expect(color.b).eql(colorDefinition.rgb.b);
        });
    });
});
