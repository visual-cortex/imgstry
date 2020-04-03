export /**
 * Set the canvas size
 *
 * @param {HTMLCanvasElement} canvas the target canvas
 * @param {number} width the width that should be set on the target
 * @param {number} height the height that should be set on the target
 * @returns {void}
 */
const setSize = (canvas: HTMLCanvasElement, width: number, height: number) => {
  canvas.setAttribute('width', `${width}`);
  canvas.setAttribute('height', `${height}`);
};
