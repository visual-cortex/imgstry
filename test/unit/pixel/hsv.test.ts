import { COLOR_MAP } from 'test/color';
import { Hsv } from '~pixel';
import { expect } from 'chai';
import { hexToRgb } from 'test/utils';

describe('HSV color', () => {
  it('Should have all channels 0 initially', () => {
    let color = new Hsv();
    expect(color.h).eql(0);
    expect(color.s).eql(0);
    expect(color.v).eql(0);
  });

  Object.keys(COLOR_MAP).forEach(key => {
    const colorDefinition = COLOR_MAP[key] as any;
    it(`Should convert ${key} correctly to RGB`, () => {
      let rgb = colorDefinition.rgb;
      let hsv = colorDefinition.hsv;
      let color = new Hsv(hsv);

      let result = color.toRgb();

      expect(result.r).approximately(rgb.r, 2);
      expect(result.g).approximately(rgb.g, 2);
      expect(result.b).approximately(rgb.b, 2);
    });

    it(`Should convert ${key} correctly to HEX`, () => {
      let hsv = colorDefinition.hsv;

      let result = hexToRgb(new Hsv(hsv).toHex().value);
      let expected = hexToRgb(colorDefinition.hex);

      expect(result[0]).approximately(expected[0], 2);
      expect(result[1]).approximately(expected[1], 2);
      expect(result[2]).approximately(expected[2], 2);
    });

    it(`Should convert ${key} correctly to CMYK`, () => {
      let hsv = colorDefinition.hsv;
      let cmyk = colorDefinition.cmyk;
      let color = new Hsv(hsv);

      let result = color.toCmyk();

      expect(result.c).approximately(cmyk.c, 1);
      expect(result.m).approximately(cmyk.m, 1);
      expect(result.y).approximately(cmyk.y, 1);
      expect(result.k).approximately(cmyk.k, .02);
    });

    it(`Should convert ${key} correctly to HSV`, () => {
      let hsv = new Hsv(colorDefinition.hsv);
      let color = hsv.toHsv();
      expect(color.h).eql(hsv.h);
      expect(color.s).eql(hsv.s);
      expect(color.v).eql(hsv.v);
    });
  });


  it('Should clamp correctly', () => {
    // interior limits
    let color = new Hsv({
      h: 0,
      s: 0,
      v: 0,
    }).clamp();

    expect(color.h).eql(0);
    expect(color.s).eql(0);
    expect(color.v).eql(0);

    color = new Hsv({
      h: 360,
      s: 1,
      v: 1,
    }).clamp();

    expect(color.h).oneOf([0, 360]);
    expect(color.s).eql(1);
    expect(color.v).eql(1);

    // exterior limits
    color = new Hsv({
      h: -1,
      s: -1,
      v: -1,
    }).clamp();

    expect(color.h).eql(359);
    expect(color.s).eql(0);
    expect(color.v).eql(0);

    color = new Hsv({
      h: 361,
      s: 1.1,
      v: 1.1,
    }).clamp();

    expect(color.h).oneOf([0, 360]);
    expect(color.s).eql(1);
    expect(color.v).eql(1);

    // correct value
    Object.keys(COLOR_MAP).forEach(key => {
      const colorDefinition = COLOR_MAP[key] as any;
      color = new Hsv(colorDefinition.hsv).clamp();

      expect(color.h).eql(colorDefinition.hsv.h);
      expect(color.s).eql(colorDefinition.hsv.s);
      expect(color.v).eql(colorDefinition.hsv.v);
    });
  });
});
