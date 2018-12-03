export const fillCanvas = (canvas: HTMLCanvasElement, color: string) => {
  const context = canvas.getContext('2d');
  context.fillStyle = color;
  context.fillRect(0, 0, canvas.width, canvas.height);
};
