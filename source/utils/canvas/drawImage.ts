import { getContext2D } from '~utils/canvas';

export /**
 * draws an image on a canvas
 *
 * @param {HTMLCanvasElement} canvas the target canvas
 * @param {CanvasImageSource} image the source image
 * @returns {void}
 */
  const drawImage = (canvas: HTMLCanvasElement, image: CanvasImageSource) => {
    const context = getContext2D(canvas);
    context.drawImage(image, 0, 0);
  };
