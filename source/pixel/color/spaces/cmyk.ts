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
      r: 255 * (1 - Math.min(1, this._applyKChannel(this.c))),
      g: 255 * (1 - Math.min(1, this._applyKChannel(this.m))),
      b: 255 * (1 - Math.min(1, this._applyKChannel(this.y))),
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
      c: Math.min(1, Math.max(this.c, 0)),
      m: Math.min(1, Math.max(this.m, 0)),
      y: Math.min(1, Math.max(this.y, 0)),
      k: Math.min(1, Math.max(this.k, 0)),
    });
  }

  private _applyKChannel = (value: number) => value * (1 - this.k) + this.k;
}
