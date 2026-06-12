import { Canvas2D } from '~/utils/canvas/types';

/**
 * Set the canvas size
 * @param canvas the target canvas
 * @param width the width that should be set on the target
 * @param height the height that should be set on the target
 */
export const setSize = (canvas: Canvas2D, width: number, height: number): void => {
    canvas.width = width;
    canvas.height = height;
};
