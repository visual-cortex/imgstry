import {
  HistogramData,
  OperationMethod,
  OperationOption,
  TraversalPixelInfo,
} from './types';

import { Kernel } from '../kernel';
import { Operation } from './imgstry.operation';
import { Rgb } from '../pixel';

/**
 * Core logic for the imgstry editor.
 * Defines all the processing logic.
 *
 * @export
 * @abstract
 * @class ImgstryProcessor
 * @ignore
 */
export abstract class ImgstryProcessor {
  /**
   * Width of the image.
   *
   * @type {number}
   * @memberOf ImgstryProcessor
   */
  public abstract width: number;
  /**
   * Height of the image.
   *
   * @type {number}
   * @memberOf ImgstryProcessor
   */
  public abstract height: number;
  /**
   * Original copy of the processed image.
   *
   * @type {ImageData}
   * @memberOf ImgstryProcessor
   */
  protected original: ImageData;

  /**
   * Encodes the canvas data to a data URI.
   *
   * @param {string}
   * @returns {string}
   * @memberof Imgstry
   */
  public abstract toDataUrl(type: string): string;

  /**
   * Resets the image to the original state.
   *
   * @abstract
   * @returns {ImgstryProcessor}
   *
   * @memberOf ImgstryProcessor
   */
  public abstract reset(): ImgstryProcessor;
  /**
   * Clone image data
   *
   * @abstract
   *
   * @memberOf ImgstryProcessor
   */
  public abstract clone(original: ImageData): ImageData;
  /**
   * Gets the image data.
   *
   * @abstract
   * @type {ImageData}
   * @memberOf ImgstryProcessor
   */
  public abstract get imageData(): ImageData;
  /**
   * Sets the image data.
   *
   * @abstract
   *
   * @memberOf ImgstryProcessor
   */
  public abstract set imageData(imgData: ImageData);

  /**
   * Returns the channel histogram of the image.
   *
   * @readonly
   * @type {HistogramData}
   * @memberof ImgstryProcessor
   */
  public get histogram(): HistogramData {
    const filler = Array(256).fill(0);

    const histogramResult: HistogramData = {
      all: [...filler],
      channel: {
        red: [...filler],
        green: [...filler],
        blue: [...filler],
      },
    };

    this._traverse((pixel, info) => {
      const mean = Math.floor((pixel.r + pixel.g + pixel.b) / 3);
      histogramResult.all[mean] += 1 / info.total;
      histogramResult.channel.red[pixel.r] += 1 / info.total;
      histogramResult.channel.green[pixel.g] += 1 / info.total;
      histogramResult.channel.blue[pixel.b] += 1 / info.total;
    });

    return histogramResult;
  }

  /**
   * Applies a series of filters to the image.
   *
   * @param {OperationOption[]} options
   * @param {boolean} [reset]
   * @returns {ImgstryProcessor}
   * @memberof ImgstryProcessor
   */
  public batch(options: OperationOption[], reset?: boolean): ImgstryProcessor {
    if (reset) {
      this.reset();
    }

    // order filter options in correct application order
    options = options.sort((a: OperationOption, b: OperationOption) => a.priority - b.priority);

    const convolutions = options.filter(o => o.name === 'convolve');
    const operations = options.filter(o => o.name !== 'convolve')
      .map(operation => ({
        value: operation.value,
        method: (Operation as Record<OperationMethod, any>)[operation.name],
      }));

    if (operations.length) {
      this._traverse((pixel) => {
        return operations.reduce(
          (rgb: Rgb, operation) => operation.method(operation.value)(rgb),
          pixel,
        );
      });
    }

    convolutions.forEach(convolution =>
      this._convolve(convolution.value as Kernel | number[][]),
    );

    return this;
  }

  private _convolve(kernel: Kernel | number[][], factor = 1): ImgstryProcessor {
    kernel = new Kernel((kernel as any)._kernel || kernel);

    const data = this.imageData.data;
    const result = this.clone(this.imageData);
    const limit = {
      lower: 0,
      upper: this.width * this.height * 4,
    };

    const half = Math.floor(kernel.height / 2);

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const offset = (y * this.width + x) * 4;
        let pixel = new Rgb();

        kernel.forEach((value, idx) => {
          let index =
            ((y + (idx.y - half)) * this.width +
              (x + (idx.x - half))) * 4;

          if (index < limit.lower) {
            index = limit.lower;
          }

          if (index > limit.upper) {
            index = limit.upper;
          }

          pixel.r += data[index + 0] * value;
          pixel.g += data[index + 1] * value;
          pixel.b += data[index + 2] * value;
          result.data[index + 3] = data[index + 3];
        });

        pixel = pixel.clamp();

        result.data[offset + 0] = factor * pixel.r;
        result.data[offset + 1] = factor * pixel.g;
        result.data[offset + 2] = factor * pixel.b;
      }
    }

    this.imageData = result;
    return this;
  }

  private _traverse = (delegate: (pixel: Rgb, information?: TraversalPixelInfo) => Rgb | void): ImgstryProcessor => {
    let isComputation = true;
    let image = this.imageData;
    const pixelArray = image.data;
    const total = pixelArray.length / 4;

    for (let i = 0; i < pixelArray.length; i += 4) {
      let pixel: Rgb | void = delegate(new Rgb({
        r: pixelArray[i],
        g: pixelArray[i + 1],
        b: pixelArray[i + 2],
      }), {
          position: {
            x: Math.floor(i / 4) % this.width,
            y: Math.floor(Math.floor(i / 4) / this.width),
            offset: i,
          },
          total,
        });

      if (!isComputation) { continue; }

      if (pixel) {
        pixel = pixel.clamp();

        pixelArray[i] = pixel.r;
        pixelArray[i + 1] = pixel.g;
        pixelArray[i + 2] = pixel.b;
      } else { isComputation = false; }
    }

    if (isComputation) { this.imageData = image; }

    return this;
  }
}
