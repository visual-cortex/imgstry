/// <reference path="../../typings/chai/chai.d.ts" />
/// <reference path="../../typings/mocha/mocha.d.ts" />
import { expect } from 'chai';
import { colorMap } from './colors';
import { Cmyk } from '../../source/pixel/color/cmyk';

describe('CMYK color', () => {
  it('Should have all channels 0 initially', () => {
    let color = new Cmyk();

    expect(color.c).eql(0);
    expect(color.m).eql(0);
    expect(color.y).eql(0);
    expect(color.k).eql(0);
  });

  let colors: any = colorMap;
  for (let key in colors) {
    if (colors[key]) {
      it(`Should convert ${key} correctly to RGB`, () => {
        let rgb = colors[key].rgb;
        let cmyk = colors[key].cmyk;
        let color = new Cmyk(cmyk);

        let result = color.toRgb();

        expect(result.r).approximately(rgb.r, 1);
        expect(result.g).approximately(rgb.g, 1);
        expect(result.b).approximately(rgb.b, 1);
      });

      it(`Should convert ${key} correctly to HEX`, () => {
        let hex = colors[key].hex;
        let cmyk = colors[key].cmyk;
        let color = new Cmyk(cmyk);

        let result = color.toHex();

        expect(parseInt(result.value.substring(1), 16)).approximately(parseInt(hex.substring(1), 16), 80000);
      });

      it(`Should convert ${key} correctly to CMYK`, () => {
        let cmyk = colors[key].cmyk;
        let color = new Cmyk(cmyk);

        let result = color.toCmyk();

        expect(result.c).equals(cmyk.c);
        expect(result.m).equals(cmyk.m);
        expect(result.y).equals(cmyk.y);
        expect(result.k).equals(cmyk.k);
      });

      it(`Should convert ${key} correctly to HSV`, () => {
        let hsv = colors[key].hsv;
        let cmyk = colors[key].cmyk;
        let color = new Cmyk(cmyk);
        let result = color.toHsv();

        expect(result.h).eql(hsv.h);
        expect(result.s).eql(hsv.s);
        expect(result.v).eql(hsv.v);
      });
    }
  }

  it('Should clamp correctly', () => {
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
