import { getContext2D } from '~/utils/canvas';
import { Canvas2D } from '~/utils/canvas/types';

/**
 * clears the entire canvas area
 * @param canvas the canvas that needs to be cleared
 */
export const clearCanvas = (canvas: Canvas2D) => {
    const context = getContext2D(canvas);
    context.clearRect(0, 0, canvas.width, canvas.height);
};
