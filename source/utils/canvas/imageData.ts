import { getContext2D } from '~/utils/canvas';
import { Canvas2D } from '~/utils/canvas/types';

/**
 * Extracts the image data from a canvas
 * @param canvas the source canvas
 * @returns the image data associated to the source canvas
 */
export const imageData = (canvas: Canvas2D) => {
    const context = getContext2D(canvas);
    return context.getImageData(0, 0, canvas.width, canvas.height);
};
