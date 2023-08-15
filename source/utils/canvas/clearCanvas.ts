import { getContext2D } from '~/utils/canvas';

/**
 * clears the entire canvas area
 * @param canvas the canvas that needs to be cleared
 */
export const clearCanvas = (canvas: HTMLCanvasElement) => {
    const context = getContext2D(canvas);
    context.clearRect(0, 0, canvas.width, canvas.height);
};
