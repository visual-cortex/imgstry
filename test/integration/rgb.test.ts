import { Hex } from '../../dist/js/pixel';
import { Rgb } from '../../dist/js/pixel';
import { colorMap } from './constants/colors';
import { expect } from 'chai';

describe('RGB color', () => {
  it('Should have all channels 0 initially', () => {
    let color = new Rgb();
    expect(color.r).eql(0);
    expect(color.g).eql(0);
    expect(color.b).eql(0);
  });

  let colors: any = colorMap;
  for (let key in colors) {
    if (colors[key]) {
      it(`Should convert ${key} correctly to HSV`, () => {
          let rgb = colors[key].rgb;
          let hsv = colors[key].hsv;

          let color = new Rgb(rgb);

          let result = color.toHsv();

          expect(result.h).approximately(hsv.h, 1);
          expect(result.s).approximately(hsv.s, 1);
          expect(result.v).approximately(hsv.v, 1);
      });

      it(`Should convert ${key} correctly to HEX`, () => {
        let rgb = colors[key].rgb;
        let hex = new Hex(colors[key].hex);
        let color = new Rgb(rgb);

        let result = color.toHex();

        expect(parseInt(result.value.substring(1), 16)).approximately(parseInt(hex.value.substring(1), 16), 80000);
      });

      it(`Should convert ${key} correctly to CMYK`, () => {
        let rgb = colors[key].rgb;
        let cmyk = colors[key].cmyk;
        let color = new Rgb(rgb);

        let result = color.toCmyk();

        expect(result.c).equals(cmyk.c);
        expect(result.m).equals(cmyk.m);
        expect(result.y).equals(cmyk.y);
        expect(result.k).equals(cmyk.k);
      });

      it(`Should convert ${key} correctly to RGB`, () => {
        let rgb = new Rgb(colors[key].rgb);
        let color = rgb.toRgb();
        expect(color.r).eql(rgb.r);
        expect(color.g).eql(rgb.g);
        expect(color.b).eql(rgb.b);
      });
    }
  }

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

    // correct value
    for (let key in colors) {
      if (colors[key]) {
        let rgb = colors[key].rgb;
        color = new Rgb(rgb).clamp();

        expect(color.r).eql(rgb.r);
        expect(color.g).eql(rgb.g);
        expect(color.b).eql(rgb.b);
      }
    }
  });
});
