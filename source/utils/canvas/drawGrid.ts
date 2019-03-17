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

    const stepX = Math.round((canvas.width - totalPadd) / gridSize);
    const stepY = Math.round((canvas.height - totalPadd) / gridSize);

    for (let x = padding; x <= (canvas.width - padding); x += stepX) {
      context.moveTo(x, padding);
      context.lineTo(x, canvas.height - padding);
    }

    for (let y = padding; y <= (canvas.height - padding); y += stepY) {
      context.moveTo(padding, y);
      context.lineTo(canvas.width - padding, y);
    }

    context.strokeStyle = color;
    context.stroke();

    context.closePath();
  };
