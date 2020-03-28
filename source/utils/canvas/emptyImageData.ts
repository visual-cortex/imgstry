import { getContext2D } from '~utils/canvas/getContext2D';

export /**
 * Returns empty image data.
 *
 * @param {HTMLCanvasElement} canvas the target canvas
 * @returns {ImageData} the empty ImageData
 */
const emptyImageData = (canvas: HTMLCanvasElement) => {
  const ctx = getContext2D(canvas);
  return ctx.createImageData(canvas.width, canvas.height);
};
