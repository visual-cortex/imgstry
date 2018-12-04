import {
  Hex,
  Rgb,
} from '../../source/pixel';

import { COLOR_MAP } from '../color';
import { expect } from 'chai';

describe('RGB color', () => {
  it('Should have all channels 0 initially', () => {
    let color = new Rgb();
    expect(color.r).eql(0);
    expect(color.g).eql(0);
    expect(color.b).eql(0);
  });

  Object.keys(COLOR_MAP).forEach(key => {
    const colorDefinition = COLOR_MAP[key] as any;
    it(`Should convert ${key} correctly to HSV`, () => {
      let rgb = colorDefinition.rgb;
      let hsv = colorDefinition.hsv;

      let color = new Rgb(rgb);

      let result = color.toHsv();

      expect(result.h).approximately(hsv.h, .1);
      expect(result.s).approximately(hsv.s, .1);
      expect(result.v).approximately(hsv.v, .1);
    });

    it(`Should convert ${key} correctly to HEX`, () => {
      let rgb = colorDefinition.rgb;
      let hex = new Hex(colorDefinition.hex);
      let color = new Rgb(rgb);

      let result = color.toHex();

      expect(parseInt(result.value.substring(1), 16)).approximately(parseInt(hex.value.substring(1), 16), 80000);
    });

    it(`Should convert ${key} correctly to CMYK`, () => {
      let rgb = colorDefinition.rgb;
      let cmyk = colorDefinition.cmyk;
      let color = new Rgb(rgb);

      let result = color.toCmyk();

      expect(result.c).approximately(cmyk.c, 1);
      expect(result.m).approximately(cmyk.m, 1);
      expect(result.y).approximately(cmyk.y, 1);
      expect(result.k).approximately(cmyk.k, .01);
    });

    it(`Should convert ${key} correctly to RGB`, () => {
      let rgb = new Rgb(colorDefinition.rgb);
      let color = rgb.toRgb();
      expect(color.r).eql(rgb.r);
      expect(color.g).eql(rgb.g);
      expect(color.b).eql(rgb.b);
    });
  });

  it('Should clamp correctly', () => {
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
