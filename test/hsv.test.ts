/// <reference path="../typings/chai/chai.d.ts" />
/// <reference path="../typings/mocha/mocha.d.ts" />

import { expect } from 'chai';
import Hsv =  require('../source/pixel/color/hsv');
import Hex =  require('../source/pixel/color/hex');
import colorMap = require('./colors');

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

        expect(result.r).approximately(rgb.r, 1);
        expect(result.g).approximately(rgb.g, 1);
        expect(result.b).approximately(rgb.b, 1);
      });

      it(`Should convert ${key} correctly to HEX`, () => {
        let hsv = colors[key].hsv;
        let hex = new Hex(colors[key].hex);
        let color = new Hsv(hsv);

        let result = color.toHex();

        expect(parseInt(result.value.substring(1), 16)).approximately(parseInt(hex.value.substring(1), 16), 80000);
      });

      it(`Should convert ${key} correctly to CMYK`, () => {
        let hsv = colors[key].hsv;
        let cmyk = colors[key].cmyk;
        let color = new Hsv(hsv);

        let result = color.toCmyk();

        expect(result.c).equals(cmyk.c);
        expect(result.m).equals(cmyk.m);
        expect(result.y).equals(cmyk.y);
        expect(result.k).equals(cmyk.k);
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
