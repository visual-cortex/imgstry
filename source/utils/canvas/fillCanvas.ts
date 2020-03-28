import { getContext2D } from '~utils/canvas';

export /**
 * Fills a canvas with the specified color
 *
 * @param {HTMLCanvasElement} canvas the target canvas
 * @param {string} color the source color hex string
 * @returns {void}
 */
  const fillCanvas = (canvas: HTMLCanvasElement, color: string) => {
    const context = getContext2D(canvas);
    context.fillStyle = color;
    context.fillRect(0, 0, canvas.width, canvas.height);
  };
