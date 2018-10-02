import { Kernel } from '../kernel';

/**
 * Defines the imgstry editor schema.
 *
 * @export
 * @interface ImgstryEditor
 * @template T
 */
export interface ImgstryEditor<T> {
  /**
   * Turn the image black and white with the provided ratio.
   *
   * @param {[number, number, number]} [ratio]
   * @returns {T}
   * @memberof ImgstryEditor
   */
  blackAndWhite(ratio?: [number, number, number]): T;
  /**
   * Increase / decrease image constrast.
   *
   * @param {number} value
   * @returns {T}
   * @memberof ImgstryEditor
   */
  contrast(value: number): T;
  /**
   * Increase / decrease image brightness.
   *
   * @param {number} value
   * @returns {T}
   * @memberof ImgstryEditor
   */
  brightness(value: number): T;
  /**
   * Increase / decrease image saturation.
   *
   * @param {number} value
   * @returns {T}
   * @memberof ImgstryEditor
   */
  saturation(value: number): T;
  /**
  * Shift the image hue.
  *
  * @param {number} value
  * @returns {T}
  * @memberof ImgstryEditor
  */
  hue(value: number): T;
  /**
   * Apply sepia with the specified intensity.
   *
   * @param {number} value
   * @returns {T}
   * @memberof ImgstryEditor
   */
  sepia(value: number): T;
  /**
  * Increase / decrease image gamma.
  *
  * @param {number} value
  * @returns {T}
  * @memberof ImgstryEditor
  */
  gamma(value: number): T;
  /**
   * Add a provided amount of noise to the image.
   *
   * @param {number} value
   * @returns {T}
   * @memberof ImgstryEditor
   */
  noise(value: number): T;
  /**
   * Increase / decrease image vibrance.
   *
   * @param {number} value
   * @returns {T}
   * @memberof ImgstryEditor
   */
  vibrance(value: number): T;
  /**
   * Invert the image colors.
   *
   * @returns {T}
   * @memberof ImgstryEditor
   */
  invert(): T;
  /**
   * Apply a color tint to the image.
   *
   * @param {string} color
   * @returns {T}
   * @memberof ImgstryEditor
   */
  tint(color: string): T;
  /**
   * Fill the canvas with a color.
   *
   * @param {string} color
   * @returns {T}
   * @memberof ImgstryEditor
   */
  fill(color: string): T;
  /**
   * Apply a kernel to the image.
   *
   * @param {(Kernel.Kernel | number[][])} kernel
   * @returns {T}
   * @memberof ImgstryEditor
   */
  convolve(kernel: Kernel | number[][]): T;
  /**
   * Clears the operation list.
   *
   * @returns {T}
   * @memberof ImgstryEditor
   */
  clear(): T;
  /**
   * Apply the requested operations to the image.
   *
   * @returns {T}
   * @memberof ImgstryEditor
   */
  renderSync(): T;
  /**
  * Apply the requested operations to the image using a worker thread.
  *
  * @returns {Promise<T>}
  * @memberof ImgstryEditor
  */
  render(): Promise<T>;
}
