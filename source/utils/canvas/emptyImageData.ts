import { getContext2D } from '~/utils/canvas/getContext2D';
import { Canvas2D } from '~/utils/canvas/types';

/**
 * Returns empty image data.
 * @param canvas the target canvas
 * @returns the empty ImageData
 */
export const emptyImageData = (canvas: Canvas2D) => {
    const ctx = getContext2D(canvas);
    return ctx.createImageData(canvas.width, canvas.height);
};
