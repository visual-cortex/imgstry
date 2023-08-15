import { getContext2D } from '~/utils/canvas';

/**
 * draws an image on a canvas
 * @param canvas the target canvas
 * @param image the source image
 */
export const drawImage = (canvas: HTMLCanvasElement, image: CanvasImageSource): void => {
    const context = getContext2D(canvas);
    context.drawImage(image, 0, 0);
};
