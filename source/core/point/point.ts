export interface IPoint {
  x: number;
  y: number;
}

export class Point implements IPoint {
  public x: number;
  public y: number;

  constructor({ x, y }: IPoint) {
    this.x = x;
    this.y = y;
  }
}
