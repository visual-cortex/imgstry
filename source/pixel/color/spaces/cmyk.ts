import {
  ColorSpace,
  IColor,
} from '~pixel/color/color';

import { Hex } from '~pixel/color/spaces/hex';
import { Hsv } from '~pixel/color/spaces/hsv';
import { Rgb } from '~pixel/color/spaces/rgb';

interface ICmyk {
  c: number;
  m: number;
  y: number;
  k: number;
}

const DEFAULT: ICmyk = {
  c: 0,
  m: 0,
  y: 0,
  k: 0,
};

/**
 * CMYK colorspace.
 *
 * @export
 * @class Cmyk
 * @implements {IColor}
 */
export class Cmyk implements IColor {
  public c: number;
  public m: number;
  public y: number;
  public k: number;

  public get kind() {
    return ColorSpace.Cmyk;
  }

  constructor({ c, m, y, k }: ICmyk = DEFAULT) {
    this.c = c;
    this.m = m;
    this.y = y;
    this.k = k;
  }

  public toRgb(): Rgb {
    return new Rgb({
      r: 255 * (1 - Math.min(1, this.c * (1 - this.k) + this.k)),
      g: 255 * (1 - Math.min(1, this.m * (1 - this.k) + this.k)),
      b: 255 * (1 - Math.min(1, this.y * (1 - this.k) + this.k)),
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
