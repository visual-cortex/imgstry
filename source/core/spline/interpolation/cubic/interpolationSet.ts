import { Point } from '../../../point';
import { fillWith } from '../../../../utils/array';

export class CubicInterpolationSet {
  public a: number[];
  public b: number[];
  public c: number[];
  public d: number[];

  constructor(private _points: Point[]) {
    this.a = _points.map(point => point.y);
    this.b = fillWith(_points.length, 0);
    this.c = fillWith(_points.length, 0);
    this.d = fillWith(_points.length, 0);

    let degree = _points.length - 1;

    let h: number[] = fillWith(degree, 0);
    let u: number[] = fillWith(degree, 0);
    let z: number[] = fillWith(degree, 0);

    for (let i = 0; i < degree; i++) {
      h[i] = this._diffX(i + 1, i);

      if (i > 0) {
        const y = 3 / h[i] * this._diffY(i + 1, i) -
          3 / h[i - 1] * this._diffY(i, i - 1);

        const l = 2 * this._diffX(i + 1, i - 1) -
          h[i - 1] * u[i - 1];

        u[i] = h[i] / l;
        z[i] = (y - h[i - 1] * z[i - 1]) / l;
      }
    }

    const { c, b, d } = this;

    for (let i = degree - 1; i >= 0; i--) {
      c[i] = z[i] - u[i] * c[i + 1];
      b[i] = this._diffY(i + 1, i) / h[i] - h[i] * (c[i + 1] + 2 * c[i]) / 3;
      d[i] = (c[i + 1] - c[i]) / (3 * h[i]);
    }
  }

  public at(idx: number) {
    return {
      a: this.a[idx],
      b: this.b[idx],
      c: this.c[idx],
      d: this.d[idx],
    };
  }

  private _diffX(idx1: number, idx2: number) {
    return this._points[idx1].x - this._points[idx2].x;
  }

  private _diffY(idx1: number, idx2: number) {
    return this._points[idx1].y - this._points[idx2].y;
  }
}
