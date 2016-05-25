class Pixel<Color> {
  public x: number;
  public y: number;
  public color: Color;

  constructor (x: number, y: number) {
    this.x = x || 0;
    this.y = y || 0;
  }

  public getColorSpace() {
    return typeof(this.color).toString().toLowerCase();
  }
}

export = Pixel;
