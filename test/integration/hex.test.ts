import { Hex } from '../../dist/js/pixel';
import { colorMap } from './constants/colors';
import { expect } from 'chai';

describe('HEX color', () => {
  it('Should have black initially', () => {
    let color = new Hex();

    expect(color.value).eql('#000000');
  });

  let colors: any = colorMap;
  for (let key in colors) {
    if (colors[key]) {
      it(`Should convert ${key} correctly to RGB`, () => {
        let rgb = colors[key].rgb;
        let hex = colors[key].hex;
        let color = new Hex(hex);

        let result = color.toRgb();

        expect(result.r).approximately(rgb.r, 1);
        expect(result.g).approximately(rgb.g, 1);
        expect(result.b).approximately(rgb.b, 1);
      });

      it(`Should convert ${key} correctly to HEX`, () => {
        let hex = colors[key].hex;
        let color = new Hex(hex);

        let result = color.toHex();

        expect(result.value).eql(hex);
      });

      it(`Should convert ${key} correctly to CMYK`, () => {
        let hex = colors[key].hex;
        let cmyk = colors[key].cmyk;
        let color = new Hex(hex);

        let result = color.toCmyk();

        expect(result.c).equals(cmyk.c);
        expect(result.m).equals(cmyk.m);
        expect(result.y).equals(cmyk.y);
        expect(result.k).equals(cmyk.k);
      });

      it(`Should convert ${key} correctly to HSV`, () => {
        let hex = new Hex(colors[key].hex);
        let hsv = colors[key].hsv;
        let color = hex.toHsv();

        expect(color.h).eql(hsv.h);
        expect(color.s).eql(hsv.s);
        expect(color.v).eql(hsv.v);
      });
    }
  }

  it('Should clamp correctly', () => {
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
