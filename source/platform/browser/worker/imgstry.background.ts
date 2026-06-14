import { ImgstryProcessor } from '~/core';
import { IWorkerData } from '~/platform/browser/worker/types';

/**
 * Processor implementation for the web worker. Carries the buffer the
 * main thread handed off; supports either the u8 canvas buffer or the
 * float pipeline buffer transparently through `setFloatSource`.
 */
export class Imgstry extends ImgstryProcessor {
    public width: number;
    public height: number;

    private _imageData: ImageData;

    public constructor({ buffer, width, height, kind }: IWorkerData) {
        super();
        if (kind === 'float') {
            this.width = width;
            this.height = height;
            this._imageData = new ImageData(
                new Uint8ClampedArray(width * height * 4),
                width,
                height,
            );
            // setFloatSource clones for the working buffer; allocate the
            // source view from the transferred ArrayBuffer.
            this.setFloatSource(new Float32Array(buffer), width, height);
            return;
        }
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

    /**
     * Returns the post-pipeline float buffer (only meaningful when this
     * processor was constructed with kind="float").
     * @returns the working float buffer
     */
    public getFloatBuffer(): Float32Array | null {
        return this._floatBuffer;
    }
}
