export class Pixel<IColor> {
  public x: number;
  public y: number;
  public color: IColor;

  constructor(x: number, y: number) {
    this.x = x || 0;
    this.y = y || 0;
  }

  public get colorSpace() {
    return typeof (this.color).toString().toLowerCase();
  }
}
