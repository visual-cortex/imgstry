import { Hex }  from '../../dist/js/pixel';
import { Hsv } from '../../dist/js/pixel';
import { colorMap } from './constants/colors';
import { expect } from 'chai';

describe('HSV color', () => {
  it('Should have all channels 0 initially', () => {
    let color = new Hsv();
    expect(color.h).eql(0);
    expect(color.s).eql(0);
    expect(color.v).eql(0);
  });

  let colors: any = colorMap;
  for (let key in colors) {
    if (colors[key]) {
      it(`Should convert ${key} correctly to RGB`, () => {
        let rgb = colors[key].rgb;
        let hsv = colors[key].hsv;
        let color = new Hsv(hsv);

        let result = color.toRgb();

        expect(result.r).approximately(rgb.r, 2);
        expect(result.g).approximately(rgb.g, 2);
        expect(result.b).approximately(rgb.b, 2);
      });

      it(`Should convert ${key} correctly to HEX`, () => {
        let hsv = colors[key].hsv;
        let hex = new Hex(colors[key].hex);
        let color = new Hsv(hsv);

        let result = color.toHex();

        expect(parseInt(result.value.substring(1), 16)).approximately(parseInt(hex.value.substring(1), 16), 140000);
      });

      it(`Should convert ${key} correctly to CMYK`, () => {
        let hsv = colors[key].hsv;
        let cmyk = colors[key].cmyk;
        let color = new Hsv(hsv);

        let result = color.toCmyk();

        expect(result.c).approximately(cmyk.c, 1);
        expect(result.m).approximately(cmyk.m, 1);
        expect(result.y).approximately(cmyk.y, 1);
        expect(result.k).approximately(cmyk.k, .02);
      });

      it(`Should convert ${key} correctly to HSV`, () => {
        let hsv = new Hsv(colors[key].hsv);
        let color = hsv.toHsv();
        expect(color.h).eql(hsv.h);
        expect(color.s).eql(hsv.s);
        expect(color.v).eql(hsv.v);
      });
    }
  }

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

    expect(color.h).eql(360);
    expect(color.s).eql(1);
    expect(color.v).eql(1);

    // exterior limits
    color = new Hsv({
      h: -1,
      s: -1,
      v: -1,
    }).clamp();

    expect(color.h).eql(0);
    expect(color.s).eql(0);
    expect(color.v).eql(0);

    color = new Hsv({
      h: 361,
      s: 1.1,
      v: 1.1,
    }).clamp();

    expect(color.h).eql(360);
    expect(color.s).eql(1);
    expect(color.v).eql(1);

    // correct value
    for (let key in colors) {
      if (colors[key]) {
        let hsv = colors[key].hsv;
        color = new Hsv(hsv).clamp();

        expect(color.h).eql(hsv.h);
        expect(color.s).eql(hsv.s);
        expect(color.v).eql(hsv.v);
      }
    }
  });
});
