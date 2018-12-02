export const clearCanvas = (canvas: HTMLCanvasElement) => {
  const context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);
};
