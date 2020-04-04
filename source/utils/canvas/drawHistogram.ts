import { getContext2D } from '~utils/canvas/getContext2D';

export const drawHistogram = (
  canvas: HTMLCanvasElement,
  channel: number[],
  color: string,
) => {
  const context = getContext2D(canvas);
  const {
    width,
    height,
  } = canvas;

  context.beginPath();
  context.moveTo(0, height);

  for (let i = 0; i < 256; i++) {
    let point = channel[i] * height * 100;
    context.lineTo(i / 255 * width, height - point);
  }

  context.fillStyle = color;
  context.lineTo(width, height);
  context.closePath();
  context.fill();
};
