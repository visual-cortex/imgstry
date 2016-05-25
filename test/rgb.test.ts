import { expect } from 'chai';
import Rgb =  require('../source/pixel/color/rgb');

describe('Rgb color', () => {
  it('Should have all channels 0', () => {
    let color = new Rgb();
    expect(color.r).eql(0);
    expect(color.g).eql(0);
    expect(color.b).eql(0);
  });

  it('Should convert correctly to HSV', () => {
    let emerald = new Rgb({
      r: 46,
      g: 204,
      b: 113,
    });

    let emeraldHsv = emerald.toHsv();

    expect(emeraldHsv.h).approximately(145, 1);
    expect(emeraldHsv.s).approximately(77.5 / 100, 1);
    expect(emeraldHsv.v).approximately(80 / 100, 1);

    let pomegranate = new Rgb({
      r: 192,
      g: 57,
      b: 43,
    });

    let pomegranateHsv = pomegranate.toHsv();

    expect(pomegranateHsv.h).approximately(6, 1);
    expect(pomegranateHsv.s).approximately(77.6 / 100, 1);
    expect(pomegranateHsv.v).approximately(75.3 / 100, 1);
  });

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
