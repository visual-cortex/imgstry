/// <reference path="./interfaces/color.d.ts" />
import { Rgb } from './rgb';
import { Cmyk } from './cmyk';
import { Hex } from './hex';

export class Hsv implements Color {
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
    let c = clamp.v * clamp.s;
    let x = c * (1 - Math.abs( ((clamp.h / 60) % 2) - 1 ));
    let m = clamp.v - c;

    let result = new Rgb({r: m, g: m, b: m});

    if (clamp.h >= 0 && clamp.h < 60) {
      result.r += c;
      result.g += x;
    } else
    if (clamp.h >= 60 && clamp.h < 120) {
      result.r += x;
      result.g += c;
    } else
    if (clamp.h >= 120 && clamp.h < 180) {
      result.g += c;
      result.b += x;
    } else
    if (clamp.h >= 180 && clamp.h < 240) {
      result.g += x;
      result.b += c;
    } else
    if (clamp.h >= 240 && clamp.h < 300) {
      result.r += x;
      result.b += c;
    } else
    if (clamp.h >= 300 && clamp.h < 360) {
      result.r += c;
      result.b += x;
    }

    result.r = Math.round(result.r * 255);
    result.g = Math.round(result.g * 255);
    result.b = Math.round(result.b * 255);

    return result;
  }

  public toHsv(): Hsv {
    return new Hsv(this);
  }

  public toCmyk(): Cmyk {
    return this.toRgb().toCmyk();
  }

  public toHex(): Hex {
    return this.toRgb().toHex();
  }

  public clamp(): Hsv {
    return new Hsv({
      h: this.h > 360 ? 360 : this.h < 0 ? 0 : this.h,
      s: this.s > 1 ? 1 : this.s < 0 ? 0 : this.s,
      v: this.v > 1 ? 1 : this.v < 0 ? 0 : this.v,
    });
  }
}
