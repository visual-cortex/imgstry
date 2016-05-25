/// <reference path="../typings/chai/chai.d.ts" />
/// <reference path="../typings/mocha/mocha.d.ts" />

import { expect } from 'chai';
import Rgb =  require('../source/pixel/color/rgb');
import colorMap = require('./colors');

describe('Rgb color', () => {
  it('Should have all channels 0 initially', () => {
    let color = new Rgb();
    expect(color.r).eql(0);
    expect(color.g).eql(0);
    expect(color.b).eql(0);
  });

  let colors: any = colorMap;
  for (let key in colors) {
    if (colors[key]){
      it(`Should convert ${key} correctly to HSV`, () => {
          let rgb = colors[key].rgb;
          let hsv = colors[key].hsv;

          let color = new Rgb(rgb);

          let result = color.toHsv();

          expect(result.h).approximately(hsv.h, 1);
          expect(result.s).approximately(hsv.s, 1);
          expect(result.v).approximately(hsv.v, 1);
      });
    }
  }

  it('Should convert correctly to RGB', () => {
    let emerald = new Rgb({
      r: 46,
      g: 204,
      b: 113,
    });

    let clone = emerald.toRgb();

    expect(clone.r).eql(emerald.r);
    expect(clone.g).eql(emerald.g);
    expect(clone.b).eql(emerald.b);

    let pomegranate = new Rgb({
      r: 192,
      g: 57,
      b: 43,
    });

    clone = pomegranate.toRgb();

    expect(clone.r).eql(pomegranate.r);
    expect(clone.g).eql(pomegranate.g);
    expect(clone.b).eql(pomegranate.b);
  });

  it('Should clamp correctly', () => {
    let color = new Rgb({
      r: 0,
      g: -100,
      b: 300,
    }).clamp();

    expect(color.r).eql(0);
    expect(color.g).eql(0);
    expect(color.b).eql(255);

    color = new Rgb({
      r: 200,
      g: 100,
      b: 221,
    }).clamp();

    expect(color.r).eql(200);
    expect(color.g).eql(100);
    expect(color.b).eql(221);

    color = new Rgb({
      r: -1,
      g: 100,
      b: 256,
    }).clamp();

    expect(color.r).eql(0);
    expect(color.g).eql(100);
    expect(color.b).eql(255);
  });
});
