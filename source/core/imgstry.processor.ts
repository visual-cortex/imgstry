import { runPipeline } from '~/core/pipeline/runner';
import {
    HistogramData,
    OperationOption,
} from '~/core/types';

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

        if (!options.length) {
            return this;
        }

        runPipeline(this, options);
        this._invalidateCache();

        return this;
    }

    /**
     * Discards the cached histogram, called whenever image data is mutated.
     */
    protected _invalidateCache(): void {
        this._histogramCache = null;
    }

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
