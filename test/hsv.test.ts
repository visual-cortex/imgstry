/// <reference path="../typings/chai/chai.d.ts" />
/// <reference path="../typings/mocha/mocha.d.ts" />

import { expect } from 'chai';
import Hsv =  require('../source/pixel/color/hsv');
import colorMap = require('./colors');

describe('Hsv color', () => {
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
    }
  }
});
