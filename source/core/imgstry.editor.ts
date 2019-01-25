import * as Kernel from '~kernel';

import { ImgstryProcessor } from '~core/imgstry.processor';
import { OperationOption } from '~core/types';

/**
 * Defines the imgstry editor schema.
 *
 * @export
 * @interface ImgstryEditor
 * @template T
 */
export abstract class ImgstryEditor extends ImgstryProcessor {
  protected _operations: OperationOption[] = [];

  /**
   * Turn the image black and white with the provided ratio.
   *
   * @param {[number, number, number]} [ratio] an array of rations for each RGB channel the total sum must be 1
   * @returns {T} the current editor instance
   * @memberof ImgstryEditor
   */
  public blackAndWhite(ratio?: [number, number, number]): ImgstryEditor {
    this._operations.push({
      name: 'blackAndWhite',
      value: ratio,
      priority: this._operations.length,
    });
    return this;
  }

  /**
   * Increase / decrease image constrast.
   *
   * @param {number} value contrast intensity
   * @returns {T} the current editor instance
   * @memberof ImgstryEditor
   */
  public contrast(value: number): ImgstryEditor {
    this._operations.push({
      name: 'contrast',
      value: value,
      priority: this._operations.length,
    });
    return this;
  }

  /**
   * Increase / decrease image brightness.
   *
   * @param {number} value brightness intensity
   * @returns {T} the current editor instance
   * @memberof ImgstryEditor
   */
  public brightness(value: number): ImgstryEditor {
    this._operations.push({
      name: 'brightness',
      value: value,
      priority: this._operations.length,
    });
    return this;
  }

  /**
   * Increase / decrease image saturation.
   *
   * @param {number} value saturation intensity
   * @returns {T} the current editor instance
   * @memberof ImgstryEditor
   */
  public saturation(value: number): ImgstryEditor {
    this._operations.push({
      name: 'saturation',
      value: value,
      priority: this._operations.length,
    });
    return this;
  }

  /**
  * Shift the image hue.
  *
  * @param {number} value hue shift value (-180, 180)
  * @returns {T} the current editor instance
  * @memberof ImgstryEditor
  */
  public hue(value: number): ImgstryEditor {
    this._operations.push({
      name: 'hue',
      value: value,
      priority: this._operations.length,
    });
    return this;
  }

  /**
   * Apply sepia with the specified intensity.
   *
   * @param {number} value desired intensity of the sepia effect
   * @returns {T} the current editor instance
   * @memberof ImgstryEditor
   */
  public sepia(value: number): ImgstryEditor {
    this._operations.push({
      name: 'sepia',
      value: value,
      priority: this._operations.length,
    });
    return this;
  }

  /**
  * Increase / decrease image gamma.
  *
  * @param {number} value gamma intensity
  * @returns {T} the current editor instance
  * @memberof ImgstryEditor
  */
  public gamma(value: number): ImgstryEditor {
    this._operations.push({
      name: 'gamma',
      value: value,
      priority: this._operations.length,
    });
    return this;
  }

  /**
   * Add a provided amount of noise to the image.
   *
   * @param {number} value noise amount
   * @returns {T} the current editor instance
   * @memberof ImgstryEditor
   */
  public noise(value: number): ImgstryEditor {
    this._operations.push({
      name: 'noise',
      value: value,
      priority: this._operations.length,
    });
    return this;
  }

  /**
   * Increase / decrease image vibrance.
   *
   * @param {number} value vibrance intensity
   * @returns {T} the current editor instance
   * @memberof ImgstryEditor
   */
  public vibrance(value: number): ImgstryEditor {
    this._operations.push({
      name: 'vibrance',
      value: value,
      priority: this._operations.length,
    });
    return this;
  }

  /**
   * Invert the image colors.
   *
   * @returns {T} the current editor instance
   * @memberof ImgstryEditor
   */
  public invert(): ImgstryEditor {
    this._operations.push({
      name: 'invert',
      value: null,
      priority: this._operations.length,
    });
    return this;
  }

  /**
   * Apply a color tint to the image.
   *
   * @param {string} color the hex color code of the desired tint
   * @returns {T} the current editor instance
   * @memberof ImgstryEditor
   */
  public tint(color: string): ImgstryEditor {
    this._operations.push({
      name: 'tint',
      value: color,
      priority: this._operations.length,
    });
    return this;
  }

  /**
   * Fill the canvas with a color.
   *
   * @param {string} color the hex color code of the desired tint
   * @returns {T} the current editor instance
   * @memberof ImgstryEditor
   */
  public fill(color: string): ImgstryEditor {
    this._operations.push({
      name: 'fill',
      value: color,
      priority: this._operations.length,
    });
    return this;
  }

  /**
   * Apply a kernel to the active image
   *
   * @param {Kernel.Kernel | Array<number[]>} kernel a square matrice that will be applied to the image
   * @returns {T} the current editor instance
   * @memberof ImgstryEditor
   */
  public convolve(kernel: Kernel.Kernel | number[][]): ImgstryEditor {
    this._operations.push({
      name: 'convolve',
      value: kernel,
      priority: this._operations.length,
    });
    return this;
  }

  /**
   * Clears the operation list.
   *
   * @returns {T} the current editor instance
   * @memberof ImgstryEditor
   */
  public clear() {
    this._operations = [];
    return this;
  }

  /**
   * Apply the requested operations to the image.
   *
   * @returns {T} the current editor instance
   * @memberof ImgstryEditor
   */
  public renderSync(): ImgstryEditor {
    this.batch(this._operations);
    return this.clear();
  }

  /**
  * Apply the requested operations to the image using a worker thread.
  *
  * @returns {Promise<T>} a promise that resolves in the current editor instance
  * @memberof ImgstryEditor
  */
  public abstract render(): Promise<ImgstryEditor>;
}
