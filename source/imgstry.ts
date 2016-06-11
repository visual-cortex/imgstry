import { Rgb } from './pixel/color/rgb';
import { Hsv } from './pixel/color/hsv';
import { Cmyk } from './pixel/color/cmyk';
import { Hex } from './pixel/color/hex';
import { Pixel } from './pixel/pixel';
/**
 * (Exposes image processing methods for html canvas)
 *
 * @class Imgstry
 */
class Imgstry {
  private static selectorRegex: RegExp = /#[a-zA-Z]+[a-zA-Z0-9\-\_]+/;
  private context: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  private originalImage: ImageData;

  /**
   * (Retrieves the canvas elemented for a specified 'id'.)
   *
   * @static
   */
  public static getCanvas = (selector: string): HTMLCanvasElement => {
    if (!selector) {
      throw 'A canvas selector must be provided.';
    }

    if (!Imgstry.selectorRegex.test(selector)) {
      throw `'${selector}' is not a valid id.`;
    }

    if (selector[0] === '#') {
      selector = selector.substring(1);
    }

    let canvas = document.getElementById(selector);

    if (!(canvas instanceof HTMLCanvasElement)) {
      throw `'${selector}' does not identify a canvas element.`;
    }

    return <HTMLCanvasElement>canvas;
  };

  /**
   * Creates an instance of Imgstry.
   *
   * @param {HTMLCanvasElement} canvas (specifies the canvas base for imgstry)
   */
  constructor(private canvas: HTMLCanvasElement) {
    if (!canvas) {
      throw 'A canvas element must be targeted.';
    }

    this.context = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  public blackAndWhite(ratio: Array<number>): Imgstry {
    if (!(!!ratio && Array.isArray(ratio) && ratio.reduce((a: any, b: any) => { return a + b; }, 0) <= 1)) {
      ratio = [0.3, 0.59, 0.11];
    }

    return this.compute((pixel: Rgb) => {
      let bwValue = ratio[0] * pixel.r + ratio[1] * pixel.g + ratio[2] * pixel.b;

      pixel.r = bwValue;
      pixel.g = bwValue;
      pixel.b = bwValue;

      return pixel;
    });
  }

  public contrast(value: number): Imgstry {
    if (value < 0) {
      value /= 10;
    }

    value = Math.pow((value + 100) / 100, 2);

    let lookup: Array<number> = [];

    for (let i = 0; i < 256; i++) {
      lookup[i] = i;
      lookup[i] /= 255;
      lookup[i] -= 0.5;
      lookup[i] *= value;
      lookup[i] += 0.5;
      lookup[i] *= 255;
    }

    return this.compute((pixel: Rgb) => {
      pixel.r = lookup[pixel.r];
      pixel.g = lookup[pixel.g];
      pixel.b = lookup[pixel.b];
      return pixel;
    });
  }

  public brightness(value: number): Imgstry {
    value = Math.floor(255 * (value / 100));

    return this.compute((pixel: Rgb) => {
      pixel.r += value;
      pixel.g += value;
      pixel.b += value;

      return pixel;
    });
  }

  public saturation(value: number): Imgstry {
    value *= -0.01;

    let lookup: Array<number> = [];

    for (let i = 0; i < 256; i++) {
      lookup[i] = i * value;
    }

    return this.compute((pixel: Rgb) => {
      let max = Math.max(pixel.r, pixel.g, pixel.b);

      pixel.r += lookup[max - pixel.r];
      pixel.g += lookup[max - pixel.g];
      pixel.b += lookup[max - pixel.b];

      return pixel;
    });
  }

  public hue(value: number): Imgstry {
    value *= 0.5;
    return this.compute((pixel: Rgb) => {
      let hsv = pixel.toHsv();
      hsv.h += Math.abs(value);
      pixel = hsv.toRgb();
      return pixel;
    });
  }

  public sepia(value: number): Imgstry {
    if (!value) {
      value = 100;
    }
    value /= 100;

    return this.compute((pixel: Rgb) => {
      pixel.r = (pixel.r * (1 - (0.607 * value))) + (pixel.g * (0.769 * value)) + (pixel.b * (0.189 * value));
      pixel.g = (pixel.r * (0.349 * value)) + (pixel.g * (1 - (0.314 * value))) + (pixel.b * (0.168 * value));
      pixel.b = (pixel.r * (0.272 * value)) + (pixel.g * (0.534 * value)) + (pixel.b * (1 - (0.869 * value)));
      return pixel;
    });
  }

  public gamma(value: number): Imgstry {
    if (value >= 0) {
      value = 1 - (value / 100);
    } else {
      value /= -10;
    }

    let lookup: Array<number> = [];

    for (let i = 0; i < 256; i++) {
      lookup[i] = Math.pow(i / 255, value) * 255;
    }

    return this.compute((pixel: Rgb) => {
      pixel.r = lookup[pixel.r];
      pixel.g = lookup[pixel.g];
      pixel.b = lookup[pixel.b];
      return pixel;
    });
  }

  public noise(value: number): Imgstry {
    return this.compute((pixel: Rgb) => {
      let randomValue = Math.random() * value * 2.55;
      randomValue = (Math.random() > 0.5 ? -randomValue : randomValue);
      pixel.r += randomValue;
      pixel.b += randomValue;
      pixel.g += randomValue;
      return pixel;
    });
  }

  public vibrance(value: number) {
    value *= -1;

    return this.compute((pixel: Rgb) => {
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

  public invert(): Imgstry {
    return this.compute((pixel: Rgb) => {
      pixel.r ^= 255;
      pixel.g ^= 255;
      pixel.b ^= 255;

      return pixel;
    });
  }

  public reset(): Imgstry {
    this.setData(this.originalImage);
    return this;
  }

  private getData(): ImageData {
    return this.context.getImageData(0, 0, this.width, this.height);
  }

  private setData(image: ImageData) {
    this.context.putImageData(image, 0, 0);
  }

  /** TO-DO:
   *    - integral blur (+ other blur methods)
   *    - convolution
   *    - web workers
   */

  private compute = (delegate: Function): Imgstry => {
    let image = this.getData();
    let pixelData = image.data;

    for (let i = 0; i < pixelData.length; i += 4) {
      let newPixel: Rgb = delegate(new Rgb({
        r: pixelData[i],
        g: pixelData[i + 1],
        b: pixelData[i + 2],
      }));

      if (newPixel) {
        newPixel = newPixel.clamp();

        pixelData[i] = newPixel.r;
        pixelData[i + 1] = newPixel.g;
        pixelData[i + 2] = newPixel.b;
      }
    }

    this.setData(image);
    return this;
  }
}

export = Imgstry;
