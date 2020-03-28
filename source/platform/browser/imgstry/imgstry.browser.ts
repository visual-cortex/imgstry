import {
  ImgstryEditor,
  ImgstryProcessor,
} from '~core';
import {
  ImgstryThread,
  ImgstryThreadOptions,
} from '~platform/browser/worker';
import { IDisposable } from '~types';
import {
  clearCanvas,
  drawImage,
  emptyImageData,
  fillCanvas,
  getContext2D,
  imageData,
} from '~utils/canvas';
import {
  getCanvas,
  loadImage,
} from '~utils/dom';

export interface ImgstryBrowserOptions {
  thread: ImgstryThreadOptions;
}

const DEFAULT_OPTIONS: ImgstryBrowserOptions = {
  thread: {
    isDebugEnabled: false,
  },
};

const assignDefault = (source: Partial<ImgstryBrowserOptions> = {}): ImgstryBrowserOptions => {
  source = source || {} as ImgstryBrowserOptions;
  source.thread = source.thread || {} as ImgstryThreadOptions;

  return {
    thread: {
      isEnabled: source.thread.isEnabled ||
        DEFAULT_OPTIONS.thread.isEnabled,
      isDebugEnabled: source.thread.isDebugEnabled ||
        DEFAULT_OPTIONS.thread.isDebugEnabled,
    },
  };
};


/**
 * (Exposes image processing methods for html canvas)
 *
 * @export
 * @class Imgstry
 * @extends {ImgstryEditor}
 * @implements {IDisposable}
 */
export class Imgstry extends ImgstryEditor implements IDisposable {
  public static getCanvas = getCanvas;
  public static loadImage = (src: string) => loadImage(Image, src);

  public readonly context: CanvasRenderingContext2D;

  public get width() {
    return this.canvas.width;
  }

  public get height() {
    return this.canvas.height;
  }

  private _thread: ImgstryThread;

  /**
   * Creates an instance of Imgstry.
   *
   * @param {HTMLCanvasElement} canvas (specifies the canvas base for imgstry)
   * @param {Partial<ImgstryBrowserOptions>} _options (specifies the canvas base for imgstry)
   * @constructor
   */
  constructor(
    public readonly canvas: HTMLCanvasElement,
    _options?: Partial<ImgstryBrowserOptions>,
  ) {
    super();
    const options = assignDefault(_options);
    this.context = getContext2D(canvas);
    fillCanvas(this.canvas, '');
    this._original = this.clone(this.imageData);
    this._thread = new ImgstryThread(options.thread);
  }

  /**
   * Draws an image on the canvas.
   *
   * @param {HTMLImageElement} image The source image that will be drawn on the canvas.
   * @memberof Imgstry
   * @returns {void}
   */
  public drawImage(image: HTMLImageElement) {
    drawImage(this.canvas, image);
    this._original = this.clone(this.imageData);
  }

  /**
   * Returns the content of the current canvas as an image that you can use as a source for another canvas or an HTML element.
   *
   * @param {string} [type='image/png'] The standard MIME type for the image format to return.
   * If you do not specify this parameter, the default value is a PNG format image.
   * @returns {string} The image encoded as a data url.
   * @memberof Imgstry
   */
  public toDataUrl(type = 'image/png'): string {
    return this.canvas.toDataURL(type);
  }

  public reset(): ImgstryProcessor {
    this.imageData = this._original ?? emptyImageData(this.canvas);
    return <ImgstryProcessor>this;
  }

  public clone(source: ImageData): ImageData {
    return new ImageData(
      new Uint8ClampedArray(source.data),
      source.width,
      source.height,
    );
  }

  public createImageData(source: ImageData): ImageData {
    return this.context.createImageData(source);
  }

  public get imageData(): ImageData {
    return imageData(this.canvas);
  }

  public set imageData(image: ImageData) {
    this.context.putImageData(image, 0, 0);
  }

  public async render(): Promise<Imgstry> {
    const result = await this._thread.run({
      imageData: this.imageData,
      operations: this._operations,
    });

    if (!!result) {
      this.imageData = result.imageData;
    }

    return this.clear();
  }

  /**
   * Destroys the thread and clears the canvas of data.
   *
   * @memberof Imgstry
   * @returns {void}
   */
  public dispose() {
    this._original = null;
    this._thread.dispose();
    clearCanvas(this.canvas);
  }
}
