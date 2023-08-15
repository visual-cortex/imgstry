/**
 * Safely retrieve canvas and throw if not found.
 * @param canvas the target canvas
 * @returns the 2D context
 */
export const getContext2D = (canvas: HTMLCanvasElement): CanvasRenderingContext2D => {
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (ctx) {
        return ctx!;
    }

    throw new Error('Could not retrieve context.');
};
