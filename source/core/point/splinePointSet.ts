import {
  IPoint,
  Point,
} from '.';

interface IBoundary {
  min?: number;
  max?: number;
}

export interface IPointResult {
  index: number;
  point: IPoint;
}

export class SplinePointSet implements Iterable<Point> {
  static get NotFound(): IPointResult { return { index: -1, point: null }; }

  public get first() {
    return this._points[0];
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

  constructor(points: IPoint[] = []) {
    this._points = points
      .map(point => new Point(point))
      .filter(this._allowedWithinBound)
      .sort(this._sort);
  }

  public [Symbol.iterator]() {
    let pointer = 0;

    return {
      next: (): IteratorResult<Point> => {
        if (pointer < this.length) {
          return {
            done: false,
            value: this._points[pointer++],
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
        .filter(point =>
          this._allowedWithinBound(point) &&
          !this._points.find(p => p.x === point.x),
        )
        .map(point => new Point(point)),
    );

    this._points.sort(this._sort);

    return result;
  }

  public update(index: number, { x, y }: IPoint): IPointResult {
    if (!this._points[index]) { return this._pointResult(-1); }
    if (
      !this._allowedWithinBound({ x, y }) ||
      this._points.find(p => p.x === x)
    ) { return this._pointResult(index); }

    this._points[index].x = x;
    this._points[index].y = y;

    this._points.sort(this._sort);

    return this.find({ x, y });
  }

  public find = (point: IPoint): IPointResult =>
    this._pointResult(
      this._points
        .findIndex(p =>
          p.x === point.x &&
          p.y === p.y,
        ),
    )

  public forEach = (predicateFn: (value: Point, index: number) => void) =>
    this._points.forEach(predicateFn)

  public remove(index: number): Point {
    if (
      index < 0 ||
      index > this.length ||
      !this.length
    ) { return; }

    const [removed] = this._points.splice(index, 1);
    return removed;
  }

  public indexOfClosest(coordinate: IPoint, maxRange: number) {
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

    return closestDistance <= maxRange ?
      index :
      -1;
  }

  public closest = (coordinate: IPoint, maxRange: number) => this._pointResult(this.indexOfClosest(coordinate, maxRange));

  private _sort = (left: Point, right: Point) =>
    left.x - right.x

  private _allowedWithinBound = (point: IPoint) =>
    point.x < this._boundary.x.max &&
    point.y < this._boundary.y.max &&
    point.x >= this._boundary.x.min &&
    point.y >= this._boundary.y.min

  private _pointResult = (index: number): IPointResult => ({
    index,
    point: this._points[index],
  })
}
