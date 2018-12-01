import { IPoint } from '../../core/point';

interface ICircleOptions {
  radius: number;
  color: string;
  point: IPoint;
}

export const drawCircle = (
  canvas: HTMLCanvasElement,
  options: ICircleOptions,
) => {
  const context = canvas.getContext('2d');

  context.beginPath();

  context.arc(
    options.point.x,
    canvas.height - options.point.y,
    options.radius,
    0,
    2 * Math.PI,
  );

  context.fillStyle = options.color;

  context.fill();
  context.closePath();
};