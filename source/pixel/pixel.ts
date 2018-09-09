import { IColor } from './color';

/**
 *
 *
 * @export
 * @class Pixel
 * @template IColor
 */
export class Pixel<T extends IColor> {
  public x: number;
  public y: number;

  constructor(
    x: number,
    y: number,
    public color?: T,
  ) {
    this.x = x || 0;
    this.y = y || 0;
  }

  public get colorSpace() {
    return typeof (this.color).toString().toLowerCase();
  }
}
