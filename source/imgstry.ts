/**
 * Imgstry
 */
import PixelUtil = require('./helpers/pixel-util');

class Imgstry {
  private static selectorRegex: RegExp = new RegExp('/#-?[_a-zA-Z]+[_a-zA-Z0-9-]*(?=[^}]*\{)/');
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  private static getCanvas = (selector: string): HTMLCanvasElement => {
    if (!Imgstry.selectorRegex.test(selector)) {
      throw `'${selector}' is not a valid id.`;
    }

    let canvas = document.getElementById(selector);

    if (typeof(canvas) !== typeof(HTMLCanvasElement)) {
      throw `'${selector}' does not identify a canvas element.`;
    }

    return <HTMLCanvasElement>canvas;
  };

  constructor(parentSelector: string) {
    this.canvas = Imgstry.getCanvas(parentSelector);
    this.context = this.canvas.getContext('2d');
  }

  private getData(): ImageData {
    return this.context.getImageData(0, 0, this.width, this.height);
  }

  private setData(image: ImageData) {
    this.context.putImageData(image, 0, 0);
  }

  private compute(delegate: Function) {
    let image = this.getData();
    let pixelData = image.data;

    for (let i = 0; i < pixelData.length; i++) {
      let newPixel: Pixel = delegate({
        r: pixelData[i],
        g: pixelData[i + 1],
        b: pixelData[i + 2],
      });

      if (newPixel) {
        newPixel = PixelUtil.clamp(newPixel);

        pixelData[i] = newPixel.r;
        pixelData[i + 1] = newPixel.g;
        pixelData[i + 2] = newPixel.b;
      }
    }
  }
}

export = Imgstry;
