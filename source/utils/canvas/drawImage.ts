export const drawImage = (canvas: HTMLCanvasElement, image: CanvasImageSource) => {
  const context = canvas.getContext('2d');
  context.drawImage(image, 0, 0);
};
