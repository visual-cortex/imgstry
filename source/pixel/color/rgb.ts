import Hsv = require('./hsv');

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

    let max = Math.max(clamp.r, clamp.g, clamp.b), min = Math.min(clamp.r, clamp.g, clamp.b);
    let d = max - min;
    let result = new Hsv({ h: 0, s: max === 0 ? 0 : d / max, v: max });

    if (max === min) {
        result.h = 0; // achromatic
    } else {
        switch(max) {
            case clamp.r: result.h = (clamp.g - clamp.b) / d + (clamp.g < clamp.b ? 6 : 0); break;
            case clamp.g: result.h = (clamp.b - clamp.r) / d + 2; break;
            case clamp.b: result.h = (clamp.r - clamp.g) / d + 4; break;
        }
        result.h /= 6;
    }

    return result;
  }

  public toRgb(): Rgb {
    return new Rgb(this);
  }

  public clamp(): Rgb {
    return new Rgb({
      r: this.r > 255 ? 255 : this.r < 0 ? 0 : this.r,
      g: this.g > 255 ? 255 : this.g < 0 ? 0 : this.g,
      b: this.b > 255 ? 255 : this.b < 0 ? 0 : this.b,
    });
  }
}

export = Rgb;
