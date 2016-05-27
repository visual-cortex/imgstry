/// <reference path="./interfaces/color.d.ts" />

import Hsv = require('./hsv');
import Cmyk = require('./cmyk');
import Hex = require('./hex');

class Rgb implements Color {
  public r: number;
  public g: number;
  public b: number;

  constructor(color?: any) {
    color = color || {};
    this.r = color.r || 0;
    this.g = color.g || 0;
    this.b = color.b || 0;
  }

  public toHsv(): Hsv {
    let clamp = this.clamp();
    clamp.r /= 255;
    clamp.g /= 255;
    clamp.b /= 255;

    let max = Math.max(clamp.r, clamp.g, clamp.b), min = Math.min(clamp.r, clamp.g, clamp.b);
    let delta = max - min;
    let result = new Hsv({ h: 0, s: (max === 0 ? 0 : delta / max), v: max });

    if (max === min) {
        result.h = 0; // achromatic
    } else {
        switch (max) {
            case clamp.r: result.h = 60 * ((clamp.g - clamp.b) / delta + (clamp.g < clamp.b ? 6 : 0)); break;
            case clamp.g: result.h = 60 * ((clamp.b - clamp.r) / delta + 2); break;
            case clamp.b: result.h = 60 * ((clamp.r - clamp.g) / delta + 4); break;
        }
    }

    return result;
  }

  public toRgb(): Rgb {
    return new Rgb(this);
  }

  public toCmyk(): Cmyk {
    let clamp = this.clamp();

    clamp.r /= 255;
    clamp.g /= 255;
    clamp.b /= 255;

    let result = new Cmyk();

    result.k = parseFloat((1 - Math.max(clamp.r, clamp.g, clamp.b)).toFixed(2));
    result.c = parseFloat(((1 - clamp.r - result.k) / (1 - result.k)).toFixed(2)) || 0;
    result.m = parseFloat(((1 - clamp.g - result.k) / (1 - result.k)).toFixed(2)) || 0;
    result.y = parseFloat(((1 - clamp.b - result.k) / (1 - result.k)).toFixed(2)) || 0;

    return result;
  }

  public toHex(): Hex {
    let hexString = '#' + ((1 << 24) + (this.r << 16) + (this.g << 8) + this.b).toString(16).toUpperCase().slice(1);
    return new Hex(hexString);
  }

  public clamp(): Rgb {
    return new Rgb({
      r: Math.round(this.r > 255 ? 255 : this.r < 0 ? 0 : this.r),
      g: Math.round(this.g > 255 ? 255 : this.g < 0 ? 0 : this.g),
      b: Math.round(this.b > 255 ? 255 : this.b < 0 ? 0 : this.b),
    });
  }
}

export = Rgb;
