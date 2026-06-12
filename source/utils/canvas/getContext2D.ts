import {
    Canvas2D,
    Context2D,
} from '~/utils/canvas/types';

/**
 * Safely retrieve the 2D context of a canvas and throw if not found.
 * Supports both HTMLCanvasElement and OffscreenCanvas surfaces.
 * @param canvas the target canvas
 * @returns the 2D context
 */
export const getContext2D = (canvas: Canvas2D): Context2D => {
    const ctx = canvas.getContext('2d', { willReadFrequently: true }) as Context2D | null;

    if (ctx) {
        return ctx;
    }

    throw new Error('Could not retrieve context.');
};
