import { IWorkerData } from './browser.thread';
import { ImgstryProcessor } from '../../core';

export class ImgstryWorker extends ImgstryProcessor {
  public width: number;
  public height: number;

  private _imageData: ImageData;

  constructor({ buffer, width, height }: IWorkerData) {
    super();
    this._imageData = new ImageData(new Uint8ClampedArray(buffer), width, height);
    this.width = this.imageData.width;
    this.height = this.imageData.height;
  }

  public toDataUrl(_: string): string {
    return '';
  }

  public reset(): ImgstryProcessor {
    return this;
  }

  public clone(data: ImageData): ImageData {
    return new ImageData(new Uint8ClampedArray(data.data.length), data.width, data.height);
  }

  public get imageData(): ImageData {
    return this._imageData;
  }

  public set imageData(image: ImageData) {
    this._imageData = image;
  }
}
