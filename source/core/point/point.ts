export interface IPoint {
  x: number;
  y: number;
}

export class Point implements IPoint {
  public x: number;
  public y: number;

  constructor({ x, y }: IPoint = { x: 0, y: 0 }) {
    this.x = x;
    this.y = y;
  }

  public distanceTo = (point: IPoint) => Math.pow(point.x - this.x, 2) + Math.pow(point.y - this.y, 2);
}

interface IBoundary {
  min?: number;
  max?: number;
}

export class SortedPointArray implements Iterable<Point> {
  readonly [index: number]: Point;

  public get xSeries() {
    return this.map(point => point.x) || [];
  }

  public get ySeries() {
    return this.map(point => point.y) || [];
  }

  public set xBoundary({ min, max }: IBoundary) {
    this._boundary.x.min = min ||
      this._boundary.x.min;
    this._boundary.x.max = max ||
      this._boundary.x.max;
  }

  public set yBoundary({ min, max }: IBoundary) {
    this._boundary.y.min = min ||
      this._boundary.y.min;
    this._boundary.y.max = max ||
      this._boundary.y.max;
  }

  public get length() {
    return this._points.length;
  }

  private _boundary = {
    y: {
      min: 0,
      max: Infinity,
    },
    x: {
      min: 0,
      max: Infinity,
    },
  };

  private _points: Point[];
  private _peakLength = 0;

  constructor(points: IPoint[] = []) {
    this._points = points
      .map(point => new Point(point))
      .filter(this._allowedWithinBound)
      .sort(this._sort);

    this._defineIndexAccessors();
  }

  public [Symbol.iterator]() {
    let pointer = 0;

    return {
      next(): IteratorResult<Point> {
        if (pointer < this.length) {
          return {
            done: false,
            value: this[pointer++],
          };
        } else {
          return {
            done: true,
            value: null,
          };
        }
      },
    };
  }

  public push(...points: IPoint[]): number {
    const result = this._points.push(
      ...points
        .filter(this._allowedWithinBound)
        .map(point => new Point(point)),
    );

    this._points.sort(this._sort);

    this._defineIndexAccessors();

    return result;
  }

  public update(index: number, { x, y }: IPoint): number {
    if (!this[index]) { return -1; }
    if (!this._allowedWithinBound({ x, y })) { return index; }

    this[index].x = x;
    this[index].y = y;

    this._points.sort(this._sort);

    return this._points.findIndex(p => p.x === x && p.y === y);
  }

  public forEach = (predicateFn: (value: Point, index: number) => void) =>
    this._points.forEach(predicateFn)

  public map = <U>(mapFn: (value: Point, index: number, array: Point[]) => U): U[] =>
    this._points.map(mapFn)

  public remove(index: number): Point {
    if (
      index < 0 ||
      index > this.length ||
      !this.length
    ) { return; }

    const [removed] = this._points.splice(index, 1);
    return removed;
  }

  public indexOfClosest(coordinate: IPoint) {
    if (!this.length) { return -1; }

    let closestDistance = Infinity;
    let index = -1;

    this.forEach((point, idx) => {
      let distance = point.distanceTo(coordinate);

      if (closestDistance > distance) {
        closestDistance = distance;
        index = idx;
      }
    });

    return index;
  }

  public closest = (coordinate: IPoint) => this[this.indexOfClosest(coordinate)];

  private _defineIndexAccessors = () => {
    for (let i = this._peakLength; i < this.length; i++) {
      Object.defineProperty(this, i, {
        get: () => {
          const isAvailable = !!this.length &&
            i < this.length;

          return isAvailable ? this._points[i] : undefined;
        },
      });
    }

    this._peakLength = Math.max(this.length, this._peakLength);
  }

  private _sort = (left: Point, right: Point) =>
    left.x - right.x

  private _allowedWithinBound = (point: IPoint) =>
    point.x < this._boundary.x.max &&
    point.y < this._boundary.y.max &&
    point.x >= this._boundary.x.min &&
    point.y >= this._boundary.y.min
}
