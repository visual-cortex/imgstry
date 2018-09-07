import {
  FilterOption,
  HistogramData,
} from './types';
import {
  Hex,
  Rgb,
} from '../pixel';

import { Kernel } from '../kernel';
import { Operation } from './imgstry.operation';

/** TO-DO:
 *    - integral blur (+ other blur methods)
 */

/**
 * Defines the traverse information passed to the delegate.
 *
 * @interface TraversalPixelInfo
 */
interface TraversalPixelInfo {
  position: {
    x: number;
    y: number;
    offset: number;
  };
  total: number;
}

export abstract class ImgstryProcessor {
  /**
   * Width of the image
   *
   * @type {number}
   * @memberOf ImgstryProcessor
   */
  public width: number;
  /**
   * Height of the image
   *
   * @type {number}
   * @memberOf ImgstryProcessor
   */
  public height: number;
  /**
   * Original copy of the processed image
   *
   * @type {ImageData}
   * @memberOf ImgstryProcessor
   */
  protected original: ImageData;

  /**
   * Reset image to the original state
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
   * Get image data
   *
   * @abstract
   * @type {ImageData}
   * @memberOf ImgstryProcessor
   */
  public abstract get imageData(): ImageData;
  /**
   * Set image data
   *
   * @abstract
   *
   * @memberOf ImgstryProcessor
   */
  public abstract set imageData(imgData: ImageData);

  public get histogram(): HistogramData {
    const histogramResult: HistogramData = {
      all: [],
      channels: {
        red: [],
        green: [],
        blue: [],
      },
    };
    let total = 1;
    this._traverse((pixel, info) => {
      const mean = Math.floor((pixel.r + pixel.g + pixel.b) / 3);
      histogramResult.all[mean] = (histogramResult.all[mean] || 0) + 1;
      histogramResult.channels.red[pixel.r] = (histogramResult.channels.red[pixel.r] || 0) + 1;
      histogramResult.channels.green[pixel.g] = (histogramResult.channels.green[pixel.g] || 0) + 1;
      histogramResult.channels.blue[pixel.b] = (histogramResult.channels.blue[pixel.b] || 0) + 1;
      total = info.total;
    });
    // compute percentage for distributions
    for (let i = 0; i < 255; i++) {
      histogramResult.all[i] = (histogramResult.all[i] || 0) / total;
      histogramResult.channels.red[i] = (histogramResult.channels.red[i] || 0) / total;
      histogramResult.channels.green[i] = (histogramResult.channels.green[i] || 0) / total;
      histogramResult.channels.blue[i] = (histogramResult.channels.blue[i] || 0) / total;
    }
    return histogramResult;
  }

  public blackAndWhite(ratio?: [number, number, number]): ImgstryProcessor {
    return this._traverse(Operation.blackAndWhite(ratio));
  }

  public contrast(value: number): ImgstryProcessor {
    return this._traverse(Operation.contrast(value));
  }

  public brightness(value: number): ImgstryProcessor {
    return this._traverse(Operation.brightness(value));
  }

  public saturation(value: number): ImgstryProcessor {
    return this._traverse(Operation.saturation(value));
  }

  public hue(value: number): ImgstryProcessor {
    return this._traverse(Operation.hue(value));
  }

  public sepia(value: number): ImgstryProcessor {
    return this._traverse(Operation.sepia(value));
  }

  public gamma(value: number): ImgstryProcessor {
    return this._traverse(Operation.gamma(value));
  }

  public noise(value: number): ImgstryProcessor {
    return this._traverse(Operation.noise(value));
  }

  public vibrance(value: number): ImgstryProcessor {
    return this._traverse(Operation.vibrance(value));
  }

  public invert(): ImgstryProcessor {
    return this._traverse(Operation.invert());
  }

  public tint(color: string): ImgstryProcessor {
    return this._traverse((Operation.tint(color)));
  }

  public convolve(kernel: Kernel | number[][], factor = 1): ImgstryProcessor {
    kernel = kernel instanceof Array ?
      new Kernel(kernel) as Kernel :
      kernel;

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

  public batch(options: FilterOption[], reset?: boolean) {
    if (reset) {
      this.reset();
    }

    // order filter options in correct application order
    options = options.sort((a: FilterOption, b: FilterOption) => a.priority - b.priority);

    for (let option of options) {
      (<any>this)[option.filter](option.value);
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
