interface IGridOptions {
  gridSize: number;
  color: string;
  padding: number;
}

export /**
 * draw a grid on a canvas
 *
 * @param {HTMLCanvasElement} canvas the target canvas
 * @param {IGridOptions} options { gridSize, color, padding }
 * @returns {void}
 */
  const drawGrid = (
    canvas: HTMLCanvasElement,
    { gridSize, color, padding }: IGridOptions,
  ) => {
    const context = canvas.getContext('2d');
    context.beginPath();

    const totalPadd = padding * 2;

    const stepX = (canvas.width - totalPadd) / gridSize;
    const stepY = (canvas.height - totalPadd) / gridSize;
    const deltaX = stepX / 2;
    const deltaY = stepY / 2;

    for (let x = padding; x <= (canvas.width - padding) + deltaX; x += stepX) {
      context.moveTo(x, padding);
      context.lineTo(x, canvas.height - padding);
    }

    for (let y = padding; y <= (canvas.height - padding) + deltaY; y += stepY) {
      context.moveTo(padding, y);
      context.lineTo(canvas.width - padding, y);
    }

    context.strokeStyle = color;
    context.stroke();

    context.closePath();
  };
