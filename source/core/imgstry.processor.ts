import {
  Cmyk,
  Hex,
  Hsv,
  IColor,
  Pixel,
  Rgb,
} from '../pixel';
import {
  FilterOption,
  HistogramData,
} from './types';

/** TO-DO:
 *    - integral blur (+ other blur methods)
 *    - convolution
 */
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
   * Get image data
   *
   * @abstract
   * @type {ImageData}
   * @memberOf ImgstryProcessor
   */
  public abstract get data(): ImageData;
  /**
   * Set image data
   *
   * @abstract
   *
   * @memberOf ImgstryProcessor
   */
  public abstract set data(imgData: ImageData);

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
    this._traverse((pixel, pixelCount) => {
      const mean = Math.floor((pixel.r + pixel.g + pixel.b) / 3);
      histogramResult.all[mean] = (histogramResult.all[mean] || 0) + 1;
      histogramResult.channels.red[pixel.r] = (histogramResult.channels.red[pixel.r] || 0) + 1;
      histogramResult.channels.green[pixel.g] = (histogramResult.channels.green[pixel.g] || 0) + 1;
      histogramResult.channels.blue[pixel.b] = (histogramResult.channels.blue[pixel.b] || 0) + 1;
      total = pixelCount;
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

  public bw(ratio?: Array<number>): ImgstryProcessor {
    if (!(!!ratio && Array.isArray(ratio) && ratio.reduce((a: any, b: any) => { return a + b; }, 0) <= 1)) {
      ratio = [0.3, 0.59, 0.11];
    }

    return this._traverse((pixel: Rgb) => {
      let bwValue = ratio[0] * pixel.r + ratio[1] * pixel.g + ratio[2] * pixel.b;

      pixel.r = bwValue;
      pixel.g = bwValue;
      pixel.b = bwValue;

      return pixel;
    });
  }

  public contrast(value: number): ImgstryProcessor {
    if (value < 0) {
      value /= 10;
    }

    value = Math.pow((value + 100) / 100, 2);

    let lookup: Array<number> = this._lookup((i) => {
      i /= 255;
      i -= 0.5;
      i *= value;
      i += 0.5;
      i *= 255;

      return i;
    });

    return this._traverse((pixel: Rgb) => {
      pixel.r = lookup[pixel.r];
      pixel.g = lookup[pixel.g];
      pixel.b = lookup[pixel.b];

      return pixel;
    });
  }

  public brightness(value: number): ImgstryProcessor {
    value = Math.floor(255 * (value / 100));

    return this._traverse((pixel: Rgb) => {
      pixel.r += value;
      pixel.g += value;
      pixel.b += value;

      return pixel;
    });
  }

  public saturation(value: number): ImgstryProcessor {
    value *= -0.01;

    let lookup: Array<number> = this._lookup((i) => {
      return i * value;
    });

    return this._traverse((pixel: Rgb) => {
      let max = Math.max(pixel.r, pixel.g, pixel.b);

      pixel.r += lookup[max - pixel.r];
      pixel.g += lookup[max - pixel.g];
      pixel.b += lookup[max - pixel.b];

      return pixel;
    });
  }

  public hue(value: number): ImgstryProcessor {
    value *= 0.5;

    return this._traverse((pixel: Rgb) => {
      let hsv = pixel.toHsv();

      hsv.h += Math.abs(value);

      return hsv.toRgb();
    });
  }

  public sepia(value: number): ImgstryProcessor {
    if (!value) {
      value = 100;
    }
    value /= 100;

    return this._traverse((pixel: Rgb) => {
      pixel.r = (pixel.r * (1 - (0.607 * value))) + (pixel.g * (0.769 * value)) + (pixel.b * (0.189 * value));
      pixel.g = (pixel.r * (0.349 * value)) + (pixel.g * (1 - (0.314 * value))) + (pixel.b * (0.168 * value));
      pixel.b = (pixel.r * (0.272 * value)) + (pixel.g * (0.534 * value)) + (pixel.b * (1 - (0.869 * value)));

      return pixel;
    });
  }

  public gamma(value: number): ImgstryProcessor {
    if (value >= 0) {
      value = 1 - (value / 100);
    } else {
      value /= -10;
    }

    let lookup: Array<number> = this._lookup((i) => {
      return Math.pow(i / 255, value) * 255;
    });

    return this._traverse((pixel: Rgb) => {
      pixel.r = lookup[pixel.r];
      pixel.g = lookup[pixel.g];
      pixel.b = lookup[pixel.b];

      return pixel;
    });
  }

  public noise(value: number): ImgstryProcessor {
    return this._traverse((pixel: Rgb) => {
      let random = Math.random() * value * 2.55;
      random = (Math.random() > 0.5 ? -random : random);

      pixel.r += random;
      pixel.b += random;
      pixel.g += random;

      return pixel;
    });
  }

  public vibrance(value: number): ImgstryProcessor {
    value *= -1;

    return this._traverse((pixel: Rgb) => {
      let amount: number;
      let average: number;
      let max: number;

      max = Math.max(pixel.r, pixel.g, pixel.b);
      average = (pixel.r + pixel.g + pixel.b) / 3;
      amount = ((Math.abs(max - average) * 2 / 255) * value) / 100;

      pixel.r += (max - pixel.r) * amount;
      pixel.g += (max - pixel.g) * amount;
      pixel.b += (max - pixel.b) * amount;

      return pixel;
    });
  }

  public invert(): ImgstryProcessor {
    return this._traverse((pixel: Rgb) => {
      pixel.r ^= 255;
      pixel.g ^= 255;
      pixel.b ^= 255;

      return pixel;
    });
  }

  public tint(color: string): ImgstryProcessor {
    let tint = new Hex(color).toRgb();
    return this._traverse((pixel: Rgb) => {
      pixel.r = pixel.r + (255 - pixel.r) * (tint.r / 255);
      pixel.g = pixel.g + (255 - pixel.g) * (tint.g / 255);
      pixel.b = pixel.b + (255 - pixel.b) * (tint.b / 255);

      return pixel;
    });
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

  private _lookup(delegate: (i: number) => number): number[] {
    let arr = [];
    for (let i = 0; i < 256; i++) {
      arr[i] = delegate(i);
    }
    return arr;
  }

  private _traverse = (delegate: (pixel: Rgb, total?: number) => Rgb | void): ImgstryProcessor => {
    let isComputation = true;
    let image = this.data;
    const pixelArray = image.data;
    const pixelCount = pixelArray.length / 4;

    for (let i = 0; i < pixelArray.length; i += 4) {
      let pixel: Rgb | void = delegate(new Rgb({
        r: pixelArray[i],
        g: pixelArray[i + 1],
        b: pixelArray[i + 2],
      }), pixelCount);

      if (pixel) {
        pixel = pixel.clamp();

        pixelArray[i] = pixel.r;
        pixelArray[i + 1] = pixel.g;
        pixelArray[i + 2] = pixel.b;
      } else { isComputation = false; }
    }

    if (isComputation) { this.data = image; }
    return this;
  }
}
