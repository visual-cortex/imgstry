import * as Kernel from '../kernel';
import * as Pixel from '../pixel';

import { BindUtility } from '../decorators/bind-utility.decorator';
import { ImgstryProcessor } from './imgstry.processor';

export type IPixel = {
  [K in keyof typeof Pixel]: typeof Pixel[K];
};

export type IKernel = {
  [K in keyof typeof Kernel]: typeof Kernel[K];
};

/**
 * (Exposes image processing methods for html canvas)
 *
 * @class Imgstry
 */
export class Imgstry extends ImgstryProcessor {
  /**
   * Exposes all utilities required for a fruitful life alongside imstry.
   *
   * @static
   * @type {IKernel & IPixel}
   */
  @BindUtility(Kernel, Pixel)
  public static Utility: IKernel & IPixel;
  /**
   * (Retrieves the canvas elemented for a specified 'id'.)
   *
   * @static
   */
  public static getCanvas(selector: string | HTMLCanvasElement): HTMLCanvasElement {
    if (selector instanceof HTMLCanvasElement) {
      return selector;
    }

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
  }

  private static selectorRegex: RegExp = /#[a-zA-Z]+[a-zA-Z0-9\-\_]+/;

  public readonly context: CanvasRenderingContext2D;
  public readonly canvas: HTMLCanvasElement;

  /**
   * Creates an instance of Imgstry.
   *
   * @param {HTMLCanvasElement} canvas (specifies the canvas base for imgstry)
   */
  constructor(elementIdOrCanvas: string | HTMLCanvasElement) {
    super();

    this.canvas = Imgstry.getCanvas(elementIdOrCanvas);
    this.context = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.original = this.data;
  }

  public toDataUrl(type = 'image/png'): string {
    return this.canvas.toDataURL(type);
  }

  public reset(): ImgstryProcessor {
    this.data = this.original;
    return <ImgstryProcessor>this;
  }

  public clone(data: ImageData): ImageData {
    return this.context.createImageData(data);
  }

  public get data(): ImageData {
    return this.context.getImageData(0, 0, this.width, this.height);
  }

  public set data(image: ImageData) {
    this.context.putImageData(image, 0, 0);
  }

  public drawImage(image: HTMLImageElement) {
    this.context.drawImage(image, 0, 0);
    this.original = this.data;
  }
}