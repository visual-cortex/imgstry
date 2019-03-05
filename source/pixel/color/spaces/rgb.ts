import {
  ColorSpace,
  IColor,
} from '~pixel/color/color';
import { Cmyk } from '~pixel/color/spaces/cmyk';
import { Hex } from '~pixel/color/spaces/hex';
import { Hsv } from '~pixel/color/spaces/hsv';

interface IRgb {
  r: number;
  g: number;
  b: number;
}

const DEFAULT: IRgb = {
  r: 0,
  g: 0,
  b: 0,
};

/**
 * Rgb colorspace.
 *
 * @export
 * @class Rgb
 * @implements {IColor}
 */
export class Rgb implements IRgb, IColor {
  public r: number;
  public g: number;
  public b: number;

  public get kind() {
    return ColorSpace.Rgb;
  }

  constructor({ r, g, b }: IRgb = DEFAULT) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  public toHsv(): Hsv {
    let clamp = this.clamp();
    clamp.r /= 255;
    clamp.g /= 255;
    clamp.b /= 255;

    let max = Math.max(clamp.r, clamp.g, clamp.b);
    let min = Math.min(clamp.r, clamp.g, clamp.b);

    let delta = max - min;

    let result = new Hsv({
      h: 0,
      s: max === 0 ? 0 : delta / max,
      v: max,
    });

    if (max === min) {
      result.h = 0;
    } else {
      switch (max) {
        case clamp.r: result.h = (clamp.g - clamp.b) / delta; break;
        case clamp.g: result.h = 2 + (clamp.b - clamp.r) / delta; break;
        case clamp.b: result.h = 4 + (clamp.r - clamp.g) / delta; break;
      }
    }

    result.h = Math.round(Math.min(result.h * 60, 360));
    result.h += result.h < 0 ? 360 : 0;

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

    const min = Math.min(1 - clamp.r, 1 - clamp.g, 1 - clamp.b);

    return new Cmyk({
      k: min,
      c: (1 - clamp.r - min) / (1 - min) || 0,
      m: (1 - clamp.g - min) / (1 - min) || 0,
      y: (1 - clamp.b - min) / (1 - min) || 0,
    });
  }

  public toHex(): Hex {
    const { r, g, b } = this._clamp(this);

    const numeric = (
      (1 << 24) +
      (Math.round(r) << 16) +
      (Math.round(g) << 8) +
      Math.round(b)
    );

    return new Hex(`#${numeric.toString(16).toUpperCase().slice(1)}`);
  }

  public clamp(): Rgb {
    return new Rgb(this._clamp(this));
  }

  private _clamp = ({ r, g, b }: IRgb) =>
    ({
      r: Math.round(Math.min(255, Math.max(0, r))),
      g: Math.round(Math.min(255, Math.max(0, g))),
      b: Math.round(Math.min(255, Math.max(0, b))),
    })
}
