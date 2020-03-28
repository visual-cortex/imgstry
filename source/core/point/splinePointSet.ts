import {
  IPoint,
  Point,
} from '~core/point';

export interface IPointResult {
  index: number;
  point: IPoint | null;
}

export class SplinePointSet implements Iterable<Point> {
  static get notFound(): IPointResult { return { index: -1, point: null }; }

  public get first() {
    return this._points[0];
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
        }

        return {
          done: true,
          value: null,
        };
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
      this._points.find(p => p.x === x) &&
      index !== 0 &&
      index !== this.length - 1
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

  public remove(index: number): Point | undefined {
    if (
      index < 0 ||
      index > this.length ||
      !this.length
    ) { return; }

    const [removed] = this._points.splice(index, 1);
    return removed;
  }

  public indexOfClosest(coordinate: IPoint, maxRange: number, transform: (p: IPoint) => IPoint) {
    if (!this.length) { return -1; }

    let closestDistance = Infinity;
    let index = -1;

    this.forEach((point, idx) => {
      let distance = new Point(transform(point)).distanceTo(transform(coordinate));

      if (closestDistance > distance) {
        closestDistance = distance;
        index = idx;
      }
    });

    return closestDistance <= maxRange ?
      index :
      -1;
  }

  public closest = (coordinate: IPoint, maxRange: number, transform: (p: IPoint) => IPoint) =>
    this._pointResult(this.indexOfClosest(coordinate, maxRange, transform))

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
