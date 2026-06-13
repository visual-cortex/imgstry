import {
    IPoint,
    SplinePointSet,
} from '~/core/point';
import { CubicSpline } from '~/core/spline';
import { fillWith } from '~/utils/array';

export abstract class SplineProcessor {
    protected _points = new SplinePointSet();

    private _splineXSeries: number[];

    public constructor(width = 256) {
        this._splineXSeries = fillWith(width, (idx) => idx / width);

        this.add({ x: 0, y: 0 });
        this.add({ x: 1, y: 1 });
    }

    public add(point: IPoint) {
        this._points.push(this._clampPoint(point));
    }

    public remove(point: IPoint) {
        if (!this._points.length) {
            return;
        }

        const { index } = this._points.find(this._clampPoint(point));

        this._points.remove(index);
    }

    public lookup(): number[] {
        const spline = new CubicSpline([...this._points]);
        const result = new Array<number>(256);

        for (let i = 0; i < 256; i++) {
            const ratio = spline.interpolate(i / 255);
            const clamped = ratio < 0 ? 0 : ratio > 1 ? 1 : ratio;
            result[i] = Math.ceil(clamped * 255);
        }

        return result;
    }

    public interpolate(predicate: (point: IPoint) => void) {
        const spline = new CubicSpline([...this._points]);
        const xs = this._splineXSeries;
        const out: IPoint = { x: 0, y: 0 };

        for (let i = 0; i < xs.length; i++) {
            const value = xs[i];
            const y = spline.interpolate(value);

            out.x = value;
            out.y = y < 0 ? 0 : y > 1 ? 1 : y;

            predicate(out);
        }
    }

    public interpolateOne(x: number): number {
        return new CubicSpline([...this._points])
            .interpolate(x < 0 ? 0 : x > 1 ? 1 : x);
    }

    protected _clampRatio(ratio: number): number {
        return ratio < 0 ? 0 : ratio > 1 ? 1 : ratio;
    }

    protected _clampPoint(point: IPoint): IPoint {
        return {
            x: this._clampRatio(point.x),
            y: this._clampRatio(point.y),
        };
    }
}
