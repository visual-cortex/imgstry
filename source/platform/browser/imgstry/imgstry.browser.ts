import {
  ImgstryEditor,
  ImgstryProcessor,
} from '~core';
import {
  ImgstryThread,
  ImgstryThreadOptions,
} from '~platform/browser/worker';
import {
  drawImage,
  fillCanvas,
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

const assignDefault = (source: Partial<ImgstryBrowserOptions>): ImgstryBrowserOptions => {
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
 * @class Imgstry
 */
export class Imgstry extends ImgstryEditor {
  public static getCanvas = getCanvas;
  public static loadImage = (src: string) => loadImage(Image, src);

  public readonly context: CanvasRenderingContext2D;

  public get width() {
    return this.canvas.width;
  }

  public get height() {
    return this.canvas.height;
  }

  /**
   * Creates an instance of Imgstry.
   *
   * @param {HTMLCanvasElement} canvas (specifies the canvas base for imgstry)
   * @param {Partial<ImgstryBrowserOptions>} _options (specifies the canvas base for imgstry)
   * @constructor
   */
  constructor(
    public readonly canvas: HTMLCanvasElement,
    private _options?: Partial<ImgstryBrowserOptions>,
  ) {
    super();
    this._options = assignDefault(_options) as ImgstryBrowserOptions;
    this.context = this.canvas.getContext('2d');
    fillCanvas(this.canvas, '');
    this.original = this.imageData;
  }

  /**
   * Draws an image on the canvas.
   *
   * @param {HTMLImageElement} image the source image that will be drawn on the canvas
   * @memberof Imgstry
   * @returns {void}
   */
  public drawImage(image: HTMLImageElement) {
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
    const result = await new ImgstryThread(this._options.thread)
      .run({
        imageData: this.imageData,
        operations: this._operations,
      });

    this.imageData = result.imageData;

    return this.clear();
  }
}
