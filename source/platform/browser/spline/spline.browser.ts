import {
  animationFrameScheduler,
  BehaviorSubject,
  fromEvent,
  merge,
  Subject,
} from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  share,
  takeUntil,
  tap,
  throttleTime,
} from 'rxjs/operators';
import {
  IPoint,
  IPointResult,
  SplinePointSet,
} from '~core/point';
import { SplineProcessor } from '~core/spline';
import { splineTheme } from '~platform/browser/spline/spline.theme';
import { Theme } from '~platform/browser/theme';
import { IDisposable } from '~types';
import {
  clearCanvas,
  drawCircle,
  drawGrid,
  fillCanvas,
} from '~utils/canvas';
import { getCanvas } from '~utils/dom';

interface ISplineOptions {
  theme: Theme;
  gridSize: number;
  anchorSize: number;
}

export class ImgstrySpline extends SplineProcessor implements IDisposable {
  public static getCanvas = getCanvas;

  private _context: CanvasRenderingContext2D;
  private _maxAnchors = 15;

  private _anchor$ = new BehaviorSubject<IPointResult>(SplinePointSet.NotFound);
  private _draw$ = new Subject();
  private _destroyed$ = new Subject();
  private _dragging$ = new BehaviorSubject(false);

  private get _width() {
    return this._canvas.width;
  }

  private get _height() {
    return this._canvas.height;
  }

  private get _colors() {
    return splineTheme(this._options.theme || Theme.light);
  }

  private get _gridSize() {
    return this._options.gridSize || 3;
  }

  private get _anchorSize() {
    return this._options.anchorSize || 15;
  }

  private _fauxWidth: number;
  private _fauxHeight: number;
  private _padding: number;

  constructor(
    private _canvas: HTMLCanvasElement,
    private _options: ISplineOptions = {} as ISplineOptions,
  ) {
    super(_canvas.width + 1);

    this._context = this._canvas.getContext('2d');
    this._padding = this._anchorSize * 2;

    this._fauxWidth = this._width - this._padding * 2;
    this._fauxHeight = this._height - this._padding * 2;

    const mouseMove = fromEvent(this._canvas, 'mousemove')
      .pipe(
        map(this._mouseToPoint),
        map(this._clampPoint),
        share(),
      );

    const anchorHover = mouseMove
      .pipe(
        throttleTime(1000 / (this._anchorSize * 2)),
        filter(_ => !this._dragging$.value),
        map(cursor =>
          this._points.closest(
            cursor,
            Math.pow(this._anchorSize, Math.PI / 2),
            this._scaleUp,
          ),
        ),
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
            this.add(point);
          } else {
            this.remove(this._anchor$.value.point);
          }
        }),
      );

    merge(
      fromEvent(this._canvas, 'mousedown')
        .pipe(
          tap(_ => this._dragging$.next(true)),
        ),
      fromEvent(this._canvas, 'mouseup')
        .pipe(
          tap(_ => this._dragging$.next(false)),
        ),
    ).pipe(
      tap(ev => ev.preventDefault()),
      takeUntil(this._destroyed$),
    ).subscribe();

    merge(
      this._draw$,
      this._dragging$,
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

  public add = (point: IPoint) => {
    if (this._points.length === this._maxAnchors) { return; }

    super.add(point);
    this._draw$.next();
  }

  public remove = (point: IPoint) => {
    if (!this._points.length) { return; }

    super.remove(point);
    this._draw$.next();
  }

  public dispose() {
    this._destroyed$.next();
    this._context = null;
    this._canvas = null;
  }

  private _draw = () => {
    const isDragging = this._dragging$.value &&
      this._anchor$.value.index !== -1;
    const isHovered = !isDragging &&
      this._anchor$.value.index !== -1;

    this._drawCursor(isDragging, isHovered);

    clearCanvas(this._canvas);

    if (isDragging) {
      fillCanvas(this._canvas, 'rgba(0, 0, 0, .1)');
    }

    drawGrid(this._canvas, {
      gridSize: this._gridSize,
      color: this._colors.gridLine,
      padding: this._padding,
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
            point: this._scaleUp(point),
          });
      },
    );
  }

  private _drawCursor = (isDragging: boolean, isHovered: boolean) => {
    if (isDragging) {
      this._canvas.style.cursor = 'move';
    } else if (isHovered) {
      this._canvas.style.cursor = 'pointer';
    } else {
      this._canvas.style.cursor = 'auto';
    }
  }

  private _drawSplineCurve() {
    if (!this._points.length) { return; }

    this._context.beginPath();
    let first = this._scaleUp(this._points.first);
    this._context.moveTo(first.x, this._height - first.y);


    this.interpolate((result: IPoint) => {
      let { x, y } = this._scaleUp({
        x: result.x,
        y: 1 - result.y,
      });

      this._context.lineTo(x, y);
    });

    this._context.strokeStyle = this._colors.spline;
    this._context.stroke();
    this._context.closePath();
  }

  private _mouseToPoint = (ev: MouseEvent) =>
    ({
      x: (ev.offsetX - this._padding) / this._fauxWidth,
      y: 1 - (ev.offsetY - this._padding) / this._fauxHeight,
    })

  private _scaleUp =
    ({ x, y }: IPoint) => ({
      x: x * this._fauxWidth + this._padding,
      y: y * this._fauxHeight + this._padding,
    })
}
