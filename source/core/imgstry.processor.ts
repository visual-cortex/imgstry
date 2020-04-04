import { Operation } from '~core/imgstry.operation';
import {
  HistogramData,
  OperationMethod,
  OperationOption,
  TraversalPixelInfo,
} from '~core/types';
import { Kernel } from '~kernel';
import { Rgb } from '~pixel';

const HISTO_FILLER = Array(256).fill(0);

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
  protected _original: ImageData | null = null;

  /**
   * Encodes the canvas data to a data URI.
   *
   * @param {string} type The standard MIME type for the image format to return.
   * If you do not specify this parameter, the default value is a PNG format image.
   * @returns {string} The image encoded as a data url.
   * @memberof Imgstry
   */
  public abstract toDataUrl(type: string): string;

  /**
   * Resets the image to the original state.
   *
   * @abstract
   * @returns {ImgstryProcessor} The current processor instance.
   *
   * @memberOf ImgstryProcessor
   */
  public abstract reset(): ImgstryProcessor;
  /**
   * Clone image data
   *
   * @abstract
   * @param {ImageData} source The source image data.
   * @returns {ImageData} The cloned canvas image data.
   * @memberOf ImgstryProcessor
   */
  public abstract clone(source: ImageData): ImageData;
  /**
   * Create image data based on a source
   *
   * @abstract
   * @param {ImageData} source The source image data.
   * @returns {ImageData} The new image data.
   * @memberOf ImgstryProcessor
   */
  public abstract createImageData(source: ImageData): ImageData;
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
    const histogramResult: HistogramData = {
      all: [...HISTO_FILLER],
      channel: {
        red: [...HISTO_FILLER],
        green: [...HISTO_FILLER],
        blue: [...HISTO_FILLER],
      },
    };

    this._traverse((pixel, info) => {
      const total = info?.total ?? Operation.DEFAULT.rgb.max;
      const mean = Math.floor((pixel.r + pixel.g + pixel.b) / 3);
      histogramResult.all[mean] += 1 / total;
      histogramResult.channel.red[pixel.r] += 1 / total;
      histogramResult.channel.green[pixel.g] += 1 / total;
      histogramResult.channel.blue[pixel.b] += 1 / total;
    });

    return histogramResult;
  }

  /**
   * Applies a series of filters to the image.
   *
   * @param {OperationOption[]} options The set of operations.
   * @param {boolean} [reset] If the image should be reset to its original state before applying operations.
   * @returns {ImgstryProcessor} The current processor instance
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
        method: (Operation as Record<OperationMethod, any>)[operation.name](operation.value),
      }));

    if (operations.length) {
      this._traverse((pixel) => {
        return operations.reduce(
          (rgb: Rgb, operation) => operation.method(rgb),
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
    const _kernel = new Kernel((kernel as any)._kernel || kernel);

    const data = this.imageData.data;
    const result = this.createImageData(this.imageData);
    const limit = {
      lower: 0,
      upper: this.width * this.height * 4,
    };

    const half = Math.floor(_kernel.height / 2);

    this._matrixTraverse((y, x) => {
      const offset = (y * this.width + x) * 4;
      let pixel = new Rgb();
      _kernel.forEach((value, idx) => {
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
    });

    this.imageData = result;
    return this;
  }

  private _matrixTraverse = (delegate: (y: number, x: number) => void) => {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        delegate(y, x);
      }
    }
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

      if (!pixel) {
        isComputation = false;
        continue;
      }

      pixel = pixel.clamp();

      pixelArray[i] = pixel.r;
      pixelArray[i + 1] = pixel.g;
      pixelArray[i + 2] = pixel.b;
    }

    if (isComputation) { this.imageData = image; }

    return this;
  }
}
