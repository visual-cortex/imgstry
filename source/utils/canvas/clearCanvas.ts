export /**
 * cleares the entire canvas area
 *
 * @param {HTMLCanvasElement} canvas the canvas that needs to be cleared
 * @returns {void}
 */
  const clearCanvas = (canvas: HTMLCanvasElement) => {
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
  };
