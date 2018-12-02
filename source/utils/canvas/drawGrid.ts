interface IGridOptions {
  gridSize: number;
  color: string;
}

export const drawGrid = (
  canvas: HTMLCanvasElement,
  options: IGridOptions,
) => {
  const context = canvas.getContext('2d');
  context.beginPath();

  const stepX = canvas.width / options.gridSize;
  const stepY = canvas.height / options.gridSize;

  for (let x = 0; x <= canvas.width; x += stepX) {
    context.moveTo(x, 0);
    context.lineTo(x, canvas.height);
  }

  for (let y = 0; y <= canvas.height; y += stepY) {
    context.moveTo(0, y);
    context.lineTo(canvas.width, y);
  }

  context.strokeStyle = options.color;
  context.stroke();

  context.closePath();
};
