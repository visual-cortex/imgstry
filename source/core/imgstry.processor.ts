import { Operation } from '~/core/imgstry.operation';
import {
    HistogramData,
    OperationMethod,
    OperationOption,
    TraversalPixelInfo,
} from '~/core/types';
import { Kernel } from '~/kernel';
import { Rgb } from '~/pixel';

const CHANNEL_BINS = 256;

/**
 * Core logic for the imgstry editor.
 * Defines all the processing logic.
 * @ignore
 */
export abstract class ImgstryProcessor {
    /**
     * Original copy of the processed image.
     */
    protected _original: ImageData | null = null;
    private _histogramCache: HistogramData | null = null;
    /**
     * Width of the image.
     */
    public abstract width: number;
    /**
     * Height of the image.
     */
    public abstract height: number;

    /**
     * Returns the channel histogram of the image.
     * The result is cached until the image is mutated through the processor.
     */
    public get histogram(): HistogramData {
        if (this._histogramCache) {
            return this._histogramCache;
        }

        const data = this.imageData.data;
        const total = data.length / 4;
        const all = new Array(CHANNEL_BINS).fill(0);
        const red = new Array(CHANNEL_BINS).fill(0);
        const green = new Array(CHANNEL_BINS).fill(0);
        const blue = new Array(CHANNEL_BINS).fill(0);

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            all[Math.floor((r + g + b) / 3)]++;
            red[r]++;
            green[g]++;
            blue[b]++;
        }

        for (let i = 0; i < CHANNEL_BINS; i++) {
            all[i] /= total;
            red[i] /= total;
            green[i] /= total;
            blue[i] /= total;
        }

        this._histogramCache = {
            all,
            channel: {
                red,
                green,
                blue,
            },
        };

        return this._histogramCache;
    }

    /**
     * Gets the image data.
     */
    public abstract get imageData(): ImageData;
    /**
     * Sets the image data.
     */
    public abstract set imageData(imgData: ImageData);

    /**
     * Applies a series of filters to the image.
     * @param options The set of operations.
     * @param [reset] If the image should be reset to its original state before applying operations.
     * @returns The current processor instance
     */
    public batch(options: OperationOption[], reset?: boolean): ImgstryProcessor {
        if (reset) {
            this.reset();
        }

        // order filter options in correct application order
        options = options.sort((a: OperationOption, b: OperationOption) => a.priority - b.priority);

        const convolutions = options.filter(o => o.name === 'convolve');
        const methods = options.filter(o => o.name !== 'convolve')
            .map(operation =>
                (Operation as Record<OperationMethod, any>)[operation.name](operation.value) as (pixel: Rgb) => Rgb,
            );

        if (methods.length) {
            this._traverse((pixel) => {
                let result = pixel;
                for (let i = 0; i < methods.length; i++) {
                    result = methods[i](result);
                }
                return result;
            });
        }

        convolutions.forEach(convolution =>
            this._convolve(convolution.value as Kernel | number[][]),
        );

        return this;
    }

    /**
     * Discards the cached histogram, called whenever image data is mutated.
     */
    protected _invalidateCache(): void {
        this._histogramCache = null;
    }

    private _convolve(kernel: Kernel | number[][], factor = 1): ImgstryProcessor {
        const normalized = kernel instanceof Kernel ? kernel : new Kernel(kernel);

        const image = this.imageData;
        const data = image.data;
        const result = this.createImageData(image);
        const output = result.data;

        const width = this.width;
        const height = this.height;
        const kernelWidth = normalized.width;
        const kernelHeight = normalized.height;
        const halfX = Math.floor(kernelWidth / 2);
        const halfY = Math.floor(kernelHeight / 2);
        const weights = normalized.flatten();
        const maxIndex = data.length - 4;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const offset = (y * width + x) * 4;
                let r = 0;
                let g = 0;
                let b = 0;

                for (let ky = 0; ky < kernelHeight; ky++) {
                    const sampleY = y + ky - halfY;
                    for (let kx = 0; kx < kernelWidth; kx++) {
                        const weight = weights[ky * kernelWidth + kx];
                        const sample = (sampleY * width + (x + kx - halfX)) * 4;
                        const index = Math.min(maxIndex, Math.max(0, sample));

                        r += data[index] * weight;
                        g += data[index + 1] * weight;
                        b += data[index + 2] * weight;
                    }
                }

                output[offset] = factor * Math.round(Math.min(255, Math.max(0, r)));
                output[offset + 1] = factor * Math.round(Math.min(255, Math.max(0, g)));
                output[offset + 2] = factor * Math.round(Math.min(255, Math.max(0, b)));
                output[offset + 3] = data[offset + 3];
            }
        }

        this.imageData = result;
        this._invalidateCache();
        return this;
    }

    private _traverse = (delegate: (pixel: Rgb, information?: TraversalPixelInfo) => Rgb | void): ImgstryProcessor => {
        let isComputation = true;
        const image = this.imageData;
        const pixelArray = image.data;
        const width = this.width;
        const length = pixelArray.length;
        const pixel = new Rgb();
        const info: TraversalPixelInfo = {
            position: {
                x: 0,
                y: 0,
                offset: 0,
            },
            total: length / 4,
        };

        for (let i = 0, x = 0, y = 0; i < length; i += 4) {
            pixel.r = pixelArray[i];
            pixel.g = pixelArray[i + 1];
            pixel.b = pixelArray[i + 2];
            info.position.x = x;
            info.position.y = y;
            info.position.offset = i;

            const result = delegate(pixel, info);

            if (!result) {
                isComputation = false;
            } else if (isComputation) {
                pixelArray[i] = Math.round(Math.min(255, Math.max(0, result.r)));
                pixelArray[i + 1] = Math.round(Math.min(255, Math.max(0, result.g)));
                pixelArray[i + 2] = Math.round(Math.min(255, Math.max(0, result.b)));
            }

            if (++x === width) {
                x = 0;
                y++;
            }
        }

        if (isComputation) {
            this.imageData = image;
            this._invalidateCache();
        }

        return this;
    };

    /**
     * Encodes the canvas data to a data URI.
     * @param {string} type The standard MIME type for the image format to return.
     * If you do not specify this parameter, the default value is a PNG format image.
     * @returns {string} The image encoded as a data url.
     */
    public abstract toDataUrl(type: string): string;

    /**
     * Resets the image to the original state.
     * @returns {ImgstryProcessor} The current processor instance.
     */
    public abstract reset(): ImgstryProcessor;
    /**
     * Clone image data
     * @param {ImageData} source The source image data.
     * @returns {ImageData} The cloned canvas image data.
     */
    public abstract clone(source: ImageData): ImageData;
    /**
     * Create image data based on a source
     * @param {ImageData} source The source image data.
     * @returns {ImageData} The new image data.
     */
    public abstract createImageData(source: ImageData): ImageData;
}
