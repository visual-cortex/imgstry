/**
 * Set the canvas size
 * @param canvas the target canvas
 * @param width the width that should be set on the target
 * @param height the height that should be set on the target
 */
export const setSize = (canvas: HTMLCanvasElement, width: number, height: number): void => {
    canvas.setAttribute('width', `${width}`);
    canvas.setAttribute('height', `${height}`);
};
