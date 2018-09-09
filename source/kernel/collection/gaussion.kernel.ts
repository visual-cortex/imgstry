import { Kernel } from './../kernel';

export const GaussianBlur = (radius = 3, sigma = 1) => {
  let kernel: number[][] = [];

  let sum = 0;
  for (let y = 0; y < radius; y++) {
    kernel[y] = kernel[y] || [];
    for (let x = 0; x < radius; x++) {
      const exponent =
        Math.pow(x - radius / 2, 2) +
        Math.pow(y - radius / 2, 2);
      const deviation = (2 * Math.pow(sigma, 2));
      kernel[y][x] = Math.pow(Math.E, -exponent / deviation);
      sum += kernel[y][x];
    }
  }

  kernel = kernel.map((row) => row.map(value => value / sum));

  return kernel;
};
