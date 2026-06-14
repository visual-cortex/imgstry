import { ImgstryProcessor } from '~/core';
import { IWorkerData } from '~/platform/browser/worker/types';

/**
 * Processor implementation for the web worker. The worker owns the
 * transferred buffer outright: it acts as both source and working
 * buffer (no clone) since the worker only runs one batch per message
 * and ships the result straight back to the main thread.
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
            // 1x1 placeholder is enough to satisfy the abstract getter
            // contract; the float pipeline never touches `_imageData`.
            this._imageData = new ImageData(1, 1);
            const direct = new Float32Array(buffer);
            this._floatSource = direct;
            this._floatBuffer = direct;
            this._floatWidth = width;
            this._floatHeight = height;
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

    protected override _cloneFloatBaseline(): Float32Array {
        // Worker owns the transferred buffer; no need to clone before
        // the ops run since the buffer's only consumer is the single
        // batch we're about to execute.
        return this._floatBuffer ?? new Float32Array(this._floatSource as Float32Array);
    }
}
