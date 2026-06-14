import { runFloatPipeline, type FloatPipelineHost } from '~/core/pipeline/float/runner';
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
    /**
     * Read-only baseline for the Float32 pipeline. Set via
     * `setFloatSource` and copied into `_floatBuffer` on every render.
     */
    protected _floatSource: Float32Array | null = null;
    /**
     * Working Float32 buffer; replaces `imageData.data` as the canonical
     * pixel store while a float source is active.
     */
    protected _floatBuffer: Float32Array | null = null;
    protected _floatWidth = 0;
    protected _floatHeight = 0;
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

        if (this.isFloatMode()) {
            this._runFloatBatch(options);
        } else {
            runPipeline(this, options);
        }
        this._invalidateCache();

        return this;
    }

    /**
     * Reports whether the processor is currently running through the
     * Float32 pipeline (true after `setFloatSource`).
     * @returns true when a float source is active
     */
    public isFloatMode(): boolean {
        return this._floatSource !== null;
    }

    /**
     * Installs a Float32 RGBA buffer as the baseline for subsequent
     * renders. The buffer is treated as read-only; each pipeline run
     * starts from a fresh copy. The host writes the working buffer onto
     * its canvas through `_writeFloatToCanvas`.
     * @param buffer the baseline RGBA float buffer (length = w*h*4)
     * @param width image width
     * @param height image height
     */
    public setFloatSource(buffer: Float32Array, width: number, height: number): void {
        if (buffer.length !== width * height * 4) {
            throw new Error('setFloatSource: buffer length must equal width*height*4');
        }
        this._floatSource = buffer;
        this._floatBuffer = new Float32Array(buffer);
        this._floatWidth = width;
        this._floatHeight = height;
        this._writeFloatToCanvas(this._floatBuffer, width, height);
        this._invalidateCache();
    }

    /**
     * Drops the active float source so subsequent renders return to the
     * canvas-native 8-bit pipeline.
     */
    public clearFloatSource(): void {
        this._floatSource = null;
        this._floatBuffer = null;
        this._floatWidth = 0;
        this._floatHeight = 0;
        this._invalidateCache();
    }

    /**
     * Platform-specific hook: write a Float32 RGBA buffer onto the
     * canvas. Browser implementation clamps + quantises; Node uses
     * the same.
     * @param buffer the float buffer to write
     * @param width image width
     * @param height image height
     */
    protected _writeFloatToCanvas(buffer: Float32Array, width: number, height: number): void {
        // Default no-op: platforms without a canvas leave the buffer in
        // place. Browser / Node override this.
        void buffer; void width; void height;
    }

    /**
     * Discards the cached histogram, called whenever image data is mutated.
     */
    protected _invalidateCache(): void {
        this._histogramCache = null;
    }

    private _runFloatBatch(options: OperationOption[]): void {
        if (!this._floatSource) {
            return;
        }
        const initial = new Float32Array(this._floatSource);
        const slot: { current: Float32Array } = { current: initial };
        const width = this._floatWidth;
        const height = this._floatHeight;
        const host: FloatPipelineHost = {
            width,
            height,
            get floatBuffer() {
                return slot.current;
            },
            setFloatBuffer(next: Float32Array) {
                slot.current = next;
            },
        };
        runFloatPipeline(host, options);
        this._floatBuffer = slot.current;
        this._writeFloatToCanvas(slot.current, width, height);
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
