/// <reference path="./interfaces/color.d.ts" />
import Rgb = require('./rgb');
import Hsv = require('./hsv');
import Hex = require('./hex');

class Cmyk implements Color {
  public c: number;
  public m: number;
  public y: number;
  public k: number;

  constructor(color?: any) {
    color = color || {};
    this.c = color.c || 0;
    this.m = color.m || 0;
    this.y = color.y || 0;
    this.k = color.k || 0;
  }

  public toRgb(): Rgb {
    return new Rgb({
      r: Math.round(255 * (1 - this.c) * (1 - this.k)),
      g: Math.round(255 * (1 - this.m) * (1 - this.k)),
      b: Math.round(255 * (1 - this.y) * (1 - this.k))
    });
  }

  public toHsv(): Hsv {
    return this.toRgb().toHsv();
  }

  public toCmyk(): Cmyk {
    return new Cmyk(this);
  }

  public toHex(): Hex {
    return this.toRgb().toHex();
  }

  public clamp(): Cmyk {
    return new Cmyk({
      c: this.c > 1 ? 1 : this.c < 0 ? 0 : this.c,
      m: this.m > 1 ? 1 : this.m < 0 ? 0 : this.m,
      y: this.y > 1 ? 1 : this.y < 0 ? 0 : this.y,
      k: this.k > 1 ? 1 : this.k < 0 ? 0 : this.k,
    });
  }
}

export = Cmyk;
