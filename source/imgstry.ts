import Rgb = require('./pixel/color/rgb');
import Hsv = require('./pixel/color/hsv');

/**
 * (Exposes image processing methods for html canvas)
 * 
 * @class Imgstry
 */
class Imgstry {
  private static selectorRegex: RegExp = new RegExp('/#-?[_a-zA-Z]+[_a-zA-Z0-9-]*(?=[^}]*\{)/');
  private context: CanvasRenderingContext2D;
  private width: number;
  private height: number;

  /**
   * (Retrieves the canvas elemented for a specified 'id'.)
   * 
   * @static
   */
  public static getCanvas = (selector: string): HTMLCanvasElement => {
    if (!Imgstry.selectorRegex.test(selector)) {
      throw `'${selector}' is not a valid id.`;
    }

    let canvas = document.getElementById(selector);

    if (typeof(canvas) !== typeof(HTMLCanvasElement)) {
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
    this.context = this.canvas.getContext('2d');
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
