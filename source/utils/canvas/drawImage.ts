import { getContext2D } from '~/utils/canvas';
import { Canvas2D } from '~/utils/canvas/types';

/**
 * draws an image on a canvas
 * @param canvas the target canvas
 * @param image the source image
 */
export const drawImage = (canvas: Canvas2D, image: CanvasImageSource): void => {
    const context = getContext2D(canvas);
    context.drawImage(image, 0, 0);
};
