import {
  IPoint,
  Point,
} from '~core/point';
import { CubicInterpolationSet } from '~core/spline';
import { findLastIndex } from '~utils/array';

export class CubicSpline {
  private _coefficients: CubicInterpolationSet;
  private _first: IPoint;
  private _last: IPoint;

  constructor(private _points: IPoint[]) {
    if (_points == null) { throw new Error('The cubic spline instance requires both x and y series.'); }

    this._coefficients = new CubicInterpolationSet(_points.map(p => new Point(p)));
    this._first = this._points[0];
    this._last = this._points[this._points.length - 1];
  }

  public interpolate(x: number) {
    if (x < this._first.x) { return this._first.y; }
    if (x > this._last.x) { return this._last.y; }

    let idx = findLastIndex(this._points, point => point.x <= x);
    let deltaX = x - this._points[idx].x;

    const { a, b, c, d } = this._coefficients.at(idx);

    // Quartic equation: a + (b * x) + (c * x^2) + (d * x^3)
    return a +
      b * deltaX +
      c * Math.pow(deltaX, 2) +
      d * Math.pow(deltaX, 3);
  }
}
