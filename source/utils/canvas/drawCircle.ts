import { IPoint } from '~/core/point';
import { getContext2D } from '~/utils/canvas/getContext2D';

interface ICircleOptions {
    radius: number
    color: string
    point: IPoint
}

/**
 * draw a circle on a canvas
 * @param canvas the target canvas
 * @param options the circle draw options
 */
export const drawCircle = (
    canvas: HTMLCanvasElement,
    options: ICircleOptions,
) => {
    const context = getContext2D(canvas);
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
