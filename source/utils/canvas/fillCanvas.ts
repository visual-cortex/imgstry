import { getContext2D } from '~/utils/canvas';
import { Canvas2D } from '~/utils/canvas/types';

/**
 * Fills a canvas with the specified color
 * @param canvas the target canvas
 * @param color the source color hex string
 */
export const fillCanvas = (canvas: Canvas2D, color: string): void => {
    const context = getContext2D(canvas);
    context.fillStyle = color;
    context.fillRect(0, 0, canvas.width, canvas.height);
};
