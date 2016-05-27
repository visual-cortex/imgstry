/// <reference path="./interfaces/color.d.ts" />
import Rgb = require('./rgb');
import Hsv = require('./hsv');
import Cmyk = require('./cmyk');

class Hex implements Color {
  public value: string;

  constructor(color?: string) {
    this.value = color || '#000000';
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
    return this.toRgb().toCmyk();
  }

  public toHex(): Hex {
    return new Hex(this.value);
  }

  public clamp(): Hex {
    let clampedValue = '#000000'.split('');

    for (let i = 1; i < this.value.length; i++) {
      clampedValue[i] = this.value[i];
      let charCode = this.value.charCodeAt(i);

      if (charCode < '0'.charCodeAt(0) || (charCode > '9'.charCodeAt(0) && charCode < 'A'.charCodeAt(0)) ) {
        clampedValue[i] = '0';
      }

      if (charCode > 'F'.charCodeAt(0)) {
        clampedValue[i] = 'F';
      }
    }

    return new Hex(clampedValue.join(''));
  }
}

export = Hex;
