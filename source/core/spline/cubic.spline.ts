import { CubicInterpolationSet } from './cubic-interpolation-set';
import { Point } from '../point';
import { findLastIndex } from '../../utils/array';

export class CubicSpline {
  private _coefficients: CubicInterpolationSet;

  constructor(
    // points
    private x: number[],
    y: number[],
  ) {
    // FIXME: remove
    const _points = Array(x.length).fill(0).map((_, idx) => {
      return new Point({
        x: x[idx],
        y: y[idx],
      });
    });

    if (
      x == null ||
      y == null
    ) { throw new Error('The cubic spline instance requires both x and y series.'); }

    this._coefficients = new CubicInterpolationSet(_points);
  }

  public interpolate(x: number) {
    let idx = findLastIndex(this.x, xCoord => xCoord <= x);
    let deltaX = x - this.x[idx];

    const { a, b, c, d } = this._coefficients.at(idx);

    // Quartic equation: a + (b * x) + (c * x^2) + (d * x^3)
    return a +
      b * deltaX +
      c * Math.pow(deltaX, 2) +
      d * Math.pow(deltaX, 3);
  }
}
