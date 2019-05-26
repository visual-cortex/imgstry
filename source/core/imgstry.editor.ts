import { ImgstryProcessor } from '~core/imgstry.processor';
import {
  OperationMethod,
  OperationOption,
  OperationValue,
} from '~core/types';
import { Kernel } from '~kernel';

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
    return this._recordOperatoin('blackAndWhite', ratio);
  }

  /**
   * Increase / decrease image constrast.
   *
   * @param {number} value contrast intensity
   * @returns {T} the current editor instance
   * @memberof ImgstryEditor
   */
  public contrast(value: number): ImgstryEditor {
    return this._recordOperatoin('contrast', value);
  }

  /**
   * Increase / decrease image brightness.
   *
   * @param {number} value brightness intensity
   * @returns {T} the current editor instance
   * @memberof ImgstryEditor
   */
  public brightness(value: number): ImgstryEditor {
    return this._recordOperatoin('brightness', value);
  }

  /**
   * Increase / decrease image saturation.
   *
   * @param {number} value saturation intensity
   * @returns {T} the current editor instance
   * @memberof ImgstryEditor
   */
  public saturation(value: number): ImgstryEditor {
    return this._recordOperatoin('saturation', value);
  }

  /**
  * Shift the image hue.
  *
  * @param {number} value hue shift value (-180, 180)
  * @returns {T} the current editor instance
  * @memberof ImgstryEditor
  */
  public hue(value: number): ImgstryEditor {
    return this._recordOperatoin('hue', value);
  }

  /**
   * Apply sepia with the specified intensity.
   *
   * @param {number} value desired intensity of the sepia effect
   * @returns {T} the current editor instance
   * @memberof ImgstryEditor
   */
  public sepia(value: number): ImgstryEditor {
    return this._recordOperatoin('sepia', value);
  }

  /**
  * Increase / decrease image gamma.
  *
  * @param {number} value gamma intensity
  * @returns {T} the current editor instance
  * @memberof ImgstryEditor
  */
  public gamma(value: number): ImgstryEditor {
    return this._recordOperatoin('gamma', value);
  }

  /**
   * Add a provided amount of noise to the image.
   *
   * @param {number} value noise amount
   * @returns {T} the current editor instance
   * @memberof ImgstryEditor
   */
  public noise(value: number): ImgstryEditor {
    return this._recordOperatoin('noise', value);
  }

  /**
   * Increase / decrease image vibrance.
   *
   * @param {number} value vibrance intensity
   * @returns {T} the current editor instance
   * @memberof ImgstryEditor
   */
  public vibrance(value: number): ImgstryEditor {
    return this._recordOperatoin('vibrance', value);
  }

  /**
   * Invert the image colors.
   *
   * @returns {T} the current editor instance
   * @memberof ImgstryEditor
   */
  public invert(): ImgstryEditor {
    return this._recordOperatoin('invert', null);
  }

  /**
   * Apply a color tint to the image.
   *
   * @param {string} color the hex color code of the desired tint
   * @returns {T} the current editor instance
   * @memberof ImgstryEditor
   */
  public tint(color: string): ImgstryEditor {
    return this._recordOperatoin('tint', color);
  }

  /**
   * Fill the canvas with a color.
   *
   * @param {string} color the hex color code of the desired tint
   * @returns {T} the current editor instance
   * @memberof ImgstryEditor
   */
  public fill(color: string): ImgstryEditor {
    return this._recordOperatoin('fill', color);
  }

  /**
   * Apply a kernel to the active image
   *
   * @param {Kernel | Array<number[]>} kernel a square matrice that will be applied to the image
   * @returns {T} the current editor instance
   * @memberof ImgstryEditor
   */
  public convolve(kernel: Kernel | number[][]): ImgstryEditor {
    return this._recordOperatoin('convolve', kernel);
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

  private _recordOperatoin = (name: OperationMethod, value: OperationValue) => {
    this._operations.push({
      name,
      value,
      priority: this._operations.length,
    });
    return this;
  }
}
