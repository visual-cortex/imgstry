import {
  Canvas,
  Image,
} from 'canvas';
import {
  ImgstryEditor,
  ImgstryProcessor,
} from '~core';
import {
  drawImage,
  fillCanvas,
  imageData,
} from '~utils/canvas';

import { loadImage } from '~utils/dom';

/**
 * (Exposes image processing methods for html canvas)
 *
 * @class Imgstry
 */
export class Imgstry extends ImgstryEditor {
  public static loadImage = (src: string) => loadImage(Image, src);

  public readonly context: CanvasRenderingContext2D;
  public readonly canvas: HTMLCanvasElement;

  public get width() {
    return this.canvas.width;
  }

  public get height() {
    return this.canvas.height;
  }

  /**
   * Creates an instance of Imgstry.
   *
   * @param {Canvas} canvas (specifies the canvas base for imgstry)
   */
  constructor(width: number, height: number) {
    super();
    this.canvas = new Canvas(width, height);
    this.context = this.canvas.getContext('2d');
    fillCanvas(this.canvas, '');
    this.original = this.imageData;
  }

  /**
   * Draws an image on the canvas.
   *
   * @param {Image} image
   * @memberof Imgstry
   */
  public drawImage(image: Image) {
    drawImage(this.canvas, image);
    this.original = this.imageData;
  }

  public toDataUrl(type = 'image/png'): string {
    return this.canvas.toDataURL(type);
  }

  public reset(): ImgstryProcessor {
    this.imageData = this.original;
    return <ImgstryProcessor>this;
  }

  public clone(data: ImageData): ImageData {
    return this.context.createImageData(data);
  }

  public get imageData(): ImageData {
    return imageData(this.canvas);
  }

  public set imageData(image: ImageData) {
    this.context.putImageData(image, 0, 0);
  }

  public async render(): Promise<Imgstry> {
    // FIXME: Implement Node Worker
    throw new Error('Not implemented');
  }
}
