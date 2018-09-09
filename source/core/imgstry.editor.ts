import { Kernel } from '../kernel';

export interface ImgstryEditor<T> {
  blackAndWhite(ratio?: [number, number, number]): T;
  contrast(value: number): T;
  brightness(value: number): T;
  saturation(value: number): T;
  hue(value: number): T;
  sepia(value: number): T;
  gamma(value: number): T;
  noise(value: number): T;
  vibrance(value: number): T;
  invert(): T;
  tint(color: string): T;
  convolve(kernel: Kernel | number[][]): T;
  clear(): T;
  renderSync(): T;
  render(): Promise<T>;
}
