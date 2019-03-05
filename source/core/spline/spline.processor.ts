import {
  IPoint,
  SplinePointSet,
} from '~core/point';
import { CubicSpline } from '~core/spline';
import { fillWith } from '~utils/array';

export abstract class SplineProcessor {
  protected _points = new SplinePointSet();

  private _splineXSeries: number[];

  constructor(width = 256) {
    this._splineXSeries = fillWith(width, (idx) => idx / width);

    this.add({ x: 0, y: 0 });
    this.add({ x: 1, y: 1 });
  }

  public add(point: IPoint) {
    this._points.push(this._clampPoint(point));
  }

  public remove(point: IPoint) {
    if (!this._points.length) { return; }

    const { index } = this._points.find(this._clampPoint(point));

    this._points.remove(index);
  }

  public lookup = (): number[] => {
    const spline = new CubicSpline([...this._points]);
    return fillWith(256, 0)
      .map(
        (_, idx) =>
          Math.ceil(
            this._clampRatio(spline.interpolate(idx / 255)) * 255,
          ),
      );
  }

  public interpolate = (predicate: (point: IPoint) => void) => {
    const spline = new CubicSpline([...this._points]);

    this._splineXSeries.forEach((value) => predicate({
      x: value,
      y: this._clampRatio(spline.interpolate(value)),
    }));
  }

  public interpolateOne = (x: number) =>
    new CubicSpline([...this._points])
      .interpolate(this._clampRatio(x))

  protected _clampRatio =
    (ratio: number) => Math.min(1, Math.max(0, ratio))

  protected _clampPoint =
    (point: IPoint) => ({
      x: this._clampRatio(point.x),
      y: this._clampRatio(point.y),
    })
}
