export /**
 * Fills a canvas with the specified color
 *
 * @param {HTMLCanvasElement} canvas the target canvas
 * @param {string} color the source color hex string
 * @returns {void}
 */
  const fillCanvas = (canvas: HTMLCanvasElement, color: string) => {
    const context = canvas.getContext('2d');
    context.fillStyle = color;
    context.fillRect(0, 0, canvas.width, canvas.height);
  };
