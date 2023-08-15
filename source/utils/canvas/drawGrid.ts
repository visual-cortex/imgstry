import { getContext2D } from '~/utils/canvas';

interface IGridOptions {
    gridSize: number
    color: string
    padding: number
}

/**
 * draw a grid on a canvas
 * @param canvas the target canvas
 * @param options { gridSize, color, padding }
 * @param options.gridSize the number of grid to draw
 * @param options.color the color of the grid
 * @param options.padding the padding of the grid
 */
export const drawGrid = (
    canvas: HTMLCanvasElement,
    { gridSize, color, padding }: IGridOptions,
) => {
    const context = getContext2D(canvas);
    context.beginPath();

    const totalPadd = padding * 2;

    const stepX = (canvas.width - totalPadd) / gridSize;
    const stepY = (canvas.height - totalPadd) / gridSize;
    const deltaX = stepX / 2;
    const deltaY = stepY / 2;

    for (let x = padding; x <= (canvas.width - padding) + deltaX; x += stepX) {
        context.moveTo(x, padding);
        context.lineTo(x, canvas.height - padding);
    }

    for (let y = padding; y <= (canvas.height - padding) + deltaY; y += stepY) {
        context.moveTo(padding, y);
        context.lineTo(canvas.width - padding, y);
    }

    context.strokeStyle = color;
    context.stroke();

    context.closePath();
};
