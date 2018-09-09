import {
  ColorSpace,
  IColor,
} from './color';

/**
 *
 *
 * @export
 * @class Pixel
 * @template IColor
 */
export class Pixel<T extends IColor> {
  public get x() {
    return this._x;
  }
  public set x(value: number) {
    this._x = this._normalize(value);
  }

  public get y() {
    return this._y;
  }
  public set y(value: number) {
    this._y = this._normalize(value);
  }

  public get colorSpace(): ColorSpace {
    return !!this.color ?
      this.color.kind :
      ColorSpace.Empty;
  }

  constructor(
    private _x: number,
    private _y: number,
    public color?: T,
  ) {
    this._y = this._normalize(this._y);
    this._x = this._normalize(this._x);
  }

  private _normalize(coordinate: number) {
    return !coordinate ||
      coordinate < 0 ?
      0 :
      coordinate;
  }
}
