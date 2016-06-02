import Rgb = require('./pixel/color/rgb');
import Hsv = require('./pixel/color/hsv');
import Cmyk = require('./pixel/color/cmyk');
import Hex = require('./pixel/color/hex');
import Pixel = require('./pixel/pixel');

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

    if(selector[0] === '#'){
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

  public invert(): void {
    this.compute((pixel: Rgb) => {
      pixel.r ^= 255;
      pixel.g ^= 255;
      pixel.b ^= 255;

      return pixel;
    });
  }

  private getData(): ImageData {
    return this.context.getImageData(0, 0, this.width, this.height);
  }

  private setData(image: ImageData) {
    this.context.putImageData(image, 0, 0);
  }

  private compute = (delegate: Function) => {
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
  }
}

export = Imgstry;
