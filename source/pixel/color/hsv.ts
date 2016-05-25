import Rgb = require('./rgb');

class Hsv implements Color {
  public h: number;
  public s: number;
  public v: number;

  constructor(color?: any) {
    color = color || {};
    this.h = color.h || 0;
    this.s = color.s || 0;
    this.v = color.v || 0;
  }

  public toRgb(): Rgb {
    let clamp = this.clamp();

    let i = Math.floor(clamp.h),
        f = clamp.h - i,
        p = clamp.v * (1 - clamp.s),
        q = clamp.v * (1 - f * clamp.s),
        t = clamp.v * (1 - (1 - f) * clamp.s),
        mod = i % 6,
        r = [clamp.v, q, p, p, t, clamp.v][mod],
        g = [t, clamp.v, clamp.v, q, p, p][mod],
        b = [p, p, t, clamp.v, clamp.v, q][mod];

    let result = new Rgb({ r: r * 255, g: g * 255, b: b * 255});

    return result;
  }

  public toHsv(): Hsv {
    return new Hsv(this);
  }

  public clamp(): Hsv {
    return new Hsv({
      h: this.h > 360 ? 360 : this.h < 0 ? 0 : this.h,
      s: this.s > 100 ? 100 : this.s < 0 ? 0 : this.s,
      v: this.v > 100 ? 100 : this.v < 0 ? 0 : this.v,
    });
  }
}

export = Hsv;
