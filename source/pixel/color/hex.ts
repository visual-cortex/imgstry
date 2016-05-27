/// <reference path="./interfaces/color.d.ts" />
import Rgb = require('./rgb');
import Hsv = require('./hsv');
import Cmyk = require('./cmyk');

class Hex implements Color {
  public value: string;

  constructor(color?: string) {
    this.value = color;
  }

  public toRgb(): Rgb {
    let hex: string = this.value.charAt(0) === '#' ?
                      this.value.substring(1, 7) :
                      this.value;

    return new Rgb({
      r: parseInt(hex.substring(0, 2), 16),
      g: parseInt(hex.substring(2, 4), 16),
      b: parseInt(hex.substring(4, 6), 16),
    });
  }

  public toHsv(): Hsv {
    return this.toRgb().toHsv();
  }

  public toCmyk(): Cmyk {
    return new Cmyk(this);
  }

  public toHex(): Hex {
    return new Hex(this.value);
  }

  public clamp(): Hex {
    return this.toRgb().clamp().toHex();
  }
}

export = Hex;
