import { getContext2D } from '~/utils/canvas/getContext2D';

/**
 * Returns empty image data.
 * @param canvas the target canvas
 * @returns the empty ImageData
 */
export const emptyImageData = (canvas: HTMLCanvasElement) => {
    const ctx = getContext2D(canvas);
    return ctx.createImageData(canvas.width, canvas.height);
};
