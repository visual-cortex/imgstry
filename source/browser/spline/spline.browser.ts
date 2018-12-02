import {
  BehaviorSubject,
  Subject,
  animationFrameScheduler,
  fromEvent,
  merge,
} from 'rxjs';
import {
  IPoint,
  IPointResult,
  Point,
  SplinePointSet,
} from '../../core/point';
import {
  clearCanvas,
  drawCircle,
  drawGrid,
} from '../../utils/canvas';
import {
  distinctUntilChanged,
  filter,
  map,
  share,
  takeUntil,
  tap,
  throttleTime,
} from 'rxjs/operators';

import { CubicSpline } from '../../core/spline';
import { IDisposable } from '../../types';
import { Theme } from '../theme';
import { fillWith } from '../../utils/array';
import { getCanvas } from '../../utils/dom';
import { splineTheme } from './spline.theme';

interface ISplinePointEvent {
  index: number;
  point: IPoint;
}

interface ISplineCurveOptions {
  theme: Theme;
  gridSize: number;
  anchorSize: number;
}

export class SplineCurve implements IDisposable {
  public static getCanvas = getCanvas;

  private _points = new SplinePointSet();
  private _interpolated: Point[] = [];
  private _context: CanvasRenderingContext2D;
  private _canvas: HTMLCanvasElement;

  private _anchor$ = new BehaviorSubject<IPointResult>(SplinePointSet.NotFound);
  private _draw$ = new Subject();
  private _destroyed$ = new Subject();
  private _dragging$ = new BehaviorSubject(false);
  private _maxAnchors = 15;

  private get _width() {
    return this._canvas.width;
  }

  private get _height() {
    return this._canvas.height;
  }

  private get _colors() {
    return splineTheme((this._options || { theme: Theme.light }).theme);
  }

  private get _gridSize() {
    return (this._options || { gridSize: 3 }).gridSize;
  }

  private get _anchorSize() {
    return (this._options || { anchorSize: 15 }).anchorSize;
  }

  constructor(
    elementIdOrCanvas: string | HTMLCanvasElement,
    private _options: ISplineCurveOptions,
  ) {
    this._canvas = SplineCurve.getCanvas(elementIdOrCanvas);
    this._context = this._canvas.getContext('2d');
    this._interpolated = fillWith(this._width + 1, 0).map(_ => new Point());

    this.add({ x: .01, y: .01 });
    this.add({ x: .99, y: .99 });

    const mouseMove = fromEvent(this._canvas, 'mousemove')
      .pipe(
        map(this._mouseToPoint),
        share(),
      );

    const anchorHover = mouseMove
      .pipe(
        throttleTime(1000 / (this._anchorSize * 2)),
        filter(_ => !this._dragging$.value),
        map(cursor => this._points.closest(cursor, Math.pow(this._anchorSize, 2))),
        distinctUntilChanged((prev, curr) => prev.index === curr.index),
        tap(result => this._anchor$.next(result)),
      );

    const anchorMove = mouseMove
      .pipe(
        filter(_ => this._dragging$.value),
        tap(point => {
          this._anchor$.next(
            this._points.update(
              this._anchor$.value.index,
              point,
            ),
          );
        },
        ),
      );

    const mouseLeave = fromEvent(this._canvas, 'mouseleave')
      .pipe(
        tap(_ => this._anchor$.next(SplinePointSet.NotFound)),
        tap(_ => this._dragging$.next(false)),
      );

    const dblClick = fromEvent(this._canvas, 'dblclick')
      .pipe(
        map(this._mouseToPoint),
        tap(point => {
          if (this._anchor$.value.index === -1) {
            this._add(point);
          } else {
            this._remove(this._anchor$.value.point);
          }
        }),
      );

    fromEvent(this._canvas, 'mousedown')
      .pipe(
        tap(ev => ev.preventDefault()),
        takeUntil(this._destroyed$),
        filter(() => !!this._anchor$.value),
        tap(_ => this._dragging$.next(true)),
      ).subscribe();

    fromEvent(this._canvas, 'mouseup')
      .pipe(
        tap(ev => ev.preventDefault()),
        takeUntil(this._destroyed$),
        tap(_ => this._dragging$.next(false)),
      ).subscribe();

    merge(
      this._draw$,
      anchorHover,
      anchorMove,
      mouseLeave,
      dblClick,
    )
      .pipe(
        takeUntil(this._destroyed$),
        tap(_ => animationFrameScheduler.schedule(this._draw)),
      )
      .subscribe();
  }

  public add = ({ x, y }: IPoint) => {
    x = this._clampRatio(x);
    y = this._clampRatio(y);
    this._add({
      x: x * this._width,
      y: y * this._height,
    });
  }

  public remove({ x, y }: IPoint) {
    x = this._clampRatio(x);
    y = this._clampRatio(y);

    this._remove({
      x: x * this._width,
      y: y * this._height,
    });
  }

  public interpolate(x: number) {
    x = this._clampRatio(x) * this._width;
    return new CubicSpline([...this._points]).interpolate(x) / this._width;
  }

  public lookup(): number[] {
    const spline = new CubicSpline([...this._points]);
    return fillWith(256, 0).map((_, idx) => Math.round((spline.interpolate((idx / 256) * this._width) / this._width) * 256));
  }

  public dispose() {
    this._destroyed$.next();
    this._context = null;
    this._canvas = null;
  }

  private _draw = () => {
    this._canvas.style.cursor = !!this._anchor$.value ? 'pointer' : 'auto';
    clearCanvas(this._canvas);
    drawGrid(this._canvas, {
      gridSize: this._gridSize,
      color: this._colors.gridLine,
    });
    this._drawSplineCurve();


    this._points.forEach(
      (point, idx) => {
        const isAnchorHovered = idx === this._anchor$.value.index;

        drawCircle(
          this._canvas, {
            radius: this._anchorSize / 2,
            color: isAnchorHovered ?
              this._colors.anchor.hovered :
              this._colors.anchor.idle,
            point,
          });
      },
    );
  }

  private _add = (point: IPoint) => {
    if (this._points.length === this._maxAnchors) { return; }

    this._points.push(point);
    this._draw$.next();
  }

  private _remove = (point: IPoint) => {
    if (!this._points.length) { return; }

    const { index } = this._points.find(point);
    this._points.remove(index);
    this._draw$.next();
  }

  private _drawSplineCurve() {
    if (!this._points.length) { return; }

    this._context.beginPath();
    this._context.moveTo(this._points.first.x, this._height - this._points.first.y);

    const spline = new CubicSpline([...this._points]);

    this._interpolated.forEach((interpolation, x) => {
      let y = spline.interpolate(x);

      interpolation.x = x / this._width;
      interpolation.y = y / this._height;

      y = Math.max(0, Math.min(y, this._height));
      this._context.lineTo(x, this._height - y);
    });

    this._context.strokeStyle = this._colors.spline;
    this._context.stroke();
    this._context.closePath();
  }

  private _mouseToPoint = (ev: MouseEvent) => ({
    x: ev.offsetX,
    y: this._height - ev.offsetY,
  })

  private _clampRatio = (ratio: number) => Math.min(1, Math.max(0, ratio));
}
