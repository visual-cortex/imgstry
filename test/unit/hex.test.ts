import { COLOR_MAP } from '../color';
import { Hex } from '../../source/pixel';
import { expect } from 'chai';

describe('HEX color', () => {
  it('Should have black initially', () => {
    let color = new Hex();

    expect(color.value).eql('#000000');
  });

  Object.keys(COLOR_MAP).forEach(key => {
    const colorDefinition = COLOR_MAP[key] as any;

    it(`Should convert ${key} correctly to RGB`, () => {
      let rgb = colorDefinition.rgb;
      let hex = colorDefinition.hex;
      let color = new Hex(hex);

      let result = color.toRgb();

      expect(result.r).approximately(rgb.r, 1);
      expect(result.g).approximately(rgb.g, 1);
      expect(result.b).approximately(rgb.b, 1);
    });

    it(`Should convert ${key} correctly to HEX`, () => {
      let hex = colorDefinition.hex;
      let color = new Hex(hex);

      let result = color.toHex();

      expect(result.value).eql(hex);
    });

    it(`Should convert ${key} correctly to CMYK`, () => {
      let hex = colorDefinition.hex;
      let cmyk = colorDefinition.cmyk;
      let color = new Hex(hex);

      let result = color.toCmyk();

      expect(result.c).approximately(cmyk.c, 1);
      expect(result.m).approximately(cmyk.m, 1);
      expect(result.y).approximately(cmyk.y, 1);
      expect(result.k).approximately(cmyk.k, .01);
    });

    it(`Should convert ${key} correctly to HSV`, () => {
      let hex = new Hex(colorDefinition.hex);
      let hsv = colorDefinition.hsv;
      let color = hex.toHsv();

      expect(color.h).approximately(hsv.h, .1);
      expect(color.s).approximately(hsv.s, .1);
      expect(color.v).approximately(hsv.v, .01);
    });
  });

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
