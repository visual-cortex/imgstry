import { ImgstryProcessor } from '~/core';
import { IWorkerData } from '~/platform/browser/worker/types';

/**
 * Processor implementation for the web worker
 */
export class Imgstry extends ImgstryProcessor {
    public width: number;
    public height: number;

    private _imageData: ImageData;

    public constructor({ buffer, width, height }: IWorkerData) {
        super();
        this._imageData = new ImageData(new Uint8ClampedArray(buffer), width, height);
        this.width = this.imageData.width;
        this.height = this.imageData.height;
    }

    public get imageData(): ImageData {
        return this._imageData;
    }

    public set imageData(image: ImageData) {
        this._imageData = image;
    }

    public toDataUrl(_: string): string {
        return '';
    }

    public reset(): ImgstryProcessor {
        return this;
    }

    public clone(data: ImageData): ImageData {
        return new ImageData(
            new Uint8ClampedArray(data.data.length),
            data.width,
            data.height,
        );
    }

    public createImageData(data: ImageData): ImageData {
        return this.clone(data);
    }
}
