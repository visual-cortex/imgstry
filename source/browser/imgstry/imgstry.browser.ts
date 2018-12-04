import {
  ImgstryBrowserThread,
  ThreadBrowserOptions,
} from '../worker/browser.thread';
import {
  ImgstryEditor,
  ImgstryProcessor,
} from '../../core';
import {
  drawImage,
  fillCanvas,
  imageData,
} from '../../utils/canvas';
import {
  getCanvas,
  loadImage,
} from '../../utils/dom';

export interface ImgstryBrowserOptions {
  thread: ThreadBrowserOptions;
}

const DEFAULT_OPTIONS: ImgstryBrowserOptions = {
  thread: {
    isEnabled: !!Worker,
    isDevelopment: false,
    host: {
      url: `${document.location.protocol}//${document.location.host}/`,
      scriptDirectory: 'dist/',
    },
  },
};

const assignDefault = (source: Partial<ImgstryBrowserOptions>): ImgstryBrowserOptions => {
  source = source || {} as ImgstryBrowserOptions;
  source.thread = source.thread || {} as ThreadBrowserOptions;
  source.thread.host = source.thread.host || {} as any;

  return {
    thread: {
      isEnabled: source.thread.isEnabled ||
        DEFAULT_OPTIONS.thread.isEnabled,
      isDevelopment: source.thread.isDevelopment ||
        DEFAULT_OPTIONS.thread.isDevelopment,
      host: {
        url: source.thread.host.url ||
          DEFAULT_OPTIONS.thread.host.url,
        scriptDirectory: source.thread.host.scriptDirectory ||
          DEFAULT_OPTIONS.thread.host.scriptDirectory,
      },
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
   * @param {HTMLCanvasElement} canvas (specifies the canvas base for imgstry)
   */
  constructor(
    elementIdOrCanvas: string | HTMLCanvasElement,
    private _options?: Partial<ImgstryBrowserOptions>,
  ) {
    super();
    this._options = assignDefault(_options) as ImgstryBrowserOptions;
    this.canvas = getCanvas(elementIdOrCanvas);
    this.context = this.canvas.getContext('2d');
    fillCanvas(this.canvas, '');
    this.original = this.imageData;
  }

  /**
   * Draws an image on the canvas.
   *
   * @param {HTMLImageElement} image
   * @memberof Imgstry
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
    const result = await new ImgstryBrowserThread(this._options.thread)
      .run({
        imageData: this.imageData,
        operations: this._operations,
      });

    this.imageData = result.imageData;

    return this.clear();
  }
}
