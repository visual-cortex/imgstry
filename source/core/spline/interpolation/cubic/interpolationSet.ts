import { Point } from '~/core/point';

export class CubicInterpolationSet {
    public a: Float64Array;
    public b: Float64Array;
    public c: Float64Array;
    public d: Float64Array;

    public constructor(private _points: Point[]) {
        const length = _points.length;

        this.a = new Float64Array(length);
        this.b = new Float64Array(length);
        this.c = new Float64Array(length);
        this.d = new Float64Array(length);

        for (let i = 0; i < length; i++) {
            this.a[i] = _points[i].y;
        }

        this._interpolate();
    }

    public at(idx: number) {
        return {
            a: this.a[idx],
            b: this.b[idx],
            c: this.c[idx],
            d: this.d[idx],
        };
    }

    private _interpolate() {
        const points = this._points;
        const degree = points.length - 1;

        const h = new Float64Array(degree);
        const u = new Float64Array(degree);
        const z = new Float64Array(degree);

        for (let i = 0; i < degree; i++) {
            h[i] = points[i + 1].x - points[i].x;

            if (i <= 0) {
                continue;
            }

            const dyCurrent = points[i + 1].y - points[i].y;
            const dyPrev = points[i].y - points[i - 1].y;

            const y = 3 / h[i] * dyCurrent - 3 / h[i - 1] * dyPrev;
            const l = 2 * (points[i + 1].x - points[i - 1].x) - h[i - 1] * u[i - 1];

            u[i] = h[i] / l;
            z[i] = (y - h[i - 1] * z[i - 1]) / l;
        }

        const { b, c, d } = this;

        for (let i = degree - 1; i >= 0; i--) {
            c[i] = z[i] - u[i] * c[i + 1];
            b[i] = (points[i + 1].y - points[i].y) / h[i] - h[i] * (c[i + 1] + 2 * c[i]) / 3;
            d[i] = (c[i + 1] - c[i]) / (3 * h[i]);
        }
    }
}
