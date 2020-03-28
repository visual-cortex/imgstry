import { getContext2D } from '~utils/canvas';

export /**
 * Extracts the image data from a canvas
 *
 * @param {HTMLCanvasElement} canvas the source canvas
 * @returns {ImageData} the image data associated to the source canvas
 */
  const imageData = (canvas: HTMLCanvasElement) => {
    const context = getContext2D(canvas);
    return context.getImageData(0, 0, canvas.width, canvas.height);
  };
