import {
    IPoint,
    Point,
} from '~/core/point';
import { CubicInterpolationSet } from '~/core/spline';

export class CubicSpline {
    private _coefficients: CubicInterpolationSet;
    private _xs: Float64Array;
    private _first: IPoint;
    private _last: IPoint;

    public constructor(points: IPoint[]) {
        if (points == null) {
            throw new Error('The cubic spline instance requires both x and y series.');
        }

        const length = points.length;
        const mapped: Point[] = new Array(length);
        this._xs = new Float64Array(length);

        for (let i = 0; i < length; i++) {
            mapped[i] = new Point(points[i]);
            this._xs[i] = points[i].x;
        }

        this._coefficients = new CubicInterpolationSet(mapped);
        this._first = points[0];
        this._last = points[length - 1];
    }

    public interpolate(x: number) {
        if (x < this._first.x) {
            return this._first.y;
        }
        if (x > this._last.x) {
            return this._last.y;
        }

        const xs = this._xs;
        let lo = 0;
        let hi = xs.length - 1;

        while (lo < hi) {
            const mid = (lo + hi + 1) >>> 1;

            if (xs[mid] <= x) {
                lo = mid;
            } else {
                hi = mid - 1;
            }
        }

        const idx = lo;
        const deltaX = x - xs[idx];

        const a = this._coefficients.a[idx];
        const b = this._coefficients.b[idx];
        const c = this._coefficients.c[idx];
        const d = this._coefficients.d[idx];

        // Cubic equation: a + (b * x) + (c * x^2) + (d * x^3)
        return a + deltaX * (b + deltaX * (c + deltaX * d));
    }
}
