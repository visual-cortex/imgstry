
export const imageData = (canvas: HTMLCanvasElement) => {
  const context = canvas.getContext('2d');
  return context.getImageData(0, 0, canvas.width, canvas.height);
};
