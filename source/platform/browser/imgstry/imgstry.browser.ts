import {
    Observable,
    Subject,
} from 'rxjs';
import {
    map,
    shareReplay,
    startWith,
} from 'rxjs/operators';
import {
    HistogramData,
    ImgstryLayeredEditor,
    ImgstryProcessor,
    RenderTarget,
} from '~/core';
import { floatToU8, rgb16ToFloat } from '~/core/pipeline/float/conversion';
import {
    ImgstryThread,
    ImgstryThreadOptions,
} from '~/platform/browser/worker';
import { IDisposable } from '~/types';
import {
    Canvas2D,
    Context2D,
    clearCanvas,
    drawImage,
    emptyImageData,
    fillCanvas,
    getContext2D,
    imageData,
    setSize,
} from '~/utils/canvas';
import {
    getCanvas,
    loadImage,
    loadRaw,
    loadRawFull,
    type RawSource,
} from '~/utils/dom';

export interface ImgstryBrowserOptions {
    thread: ImgstryThreadOptions
}

const DEFAULT_OPTIONS: ImgstryBrowserOptions = {
    thread: {
        isEnabled: true,
        isDebugEnabled: false,
    },
};

const assignDefault = (source: Partial<ImgstryBrowserOptions> = {}): ImgstryBrowserOptions => {
    const incoming = source.thread ?? {};
    return {
        thread: {
            isEnabled: incoming.isEnabled ?? DEFAULT_OPTIONS.thread.isEnabled,
            isDebugEnabled: incoming.isDebugEnabled ?? DEFAULT_OPTIONS.thread.isDebugEnabled,
        },
    };
};


/**
 * (Exposes image processing methods for html canvas)
 */
export class Imgstry extends ImgstryLayeredEditor implements IDisposable {
    public static getCanvas = getCanvas;

    public draw$ = new Subject();
    public histogram$: Observable<HistogramData> = this.draw$.pipe(
        startWith(void 0),
        map(() => this.histogram),
        shareReplay(1),
    );

    public readonly context: Context2D;

    private _thread?: ImgstryThread;
    private _threadOptions: ImgstryThreadOptions;
    private _rawDecode: {
        rgb16: Uint16Array
        width: number
        height: number
        blackLevel: number
        whiteLevel: number
        whiteBalance: [number, number, number]
        cameraToSrgb: readonly number[] | null
    } | null = null;
    private _rawExposure = 0;

    /**
     * Creates an instance of Imgstry.
     * @param canvas (specifies the canvas base for imgstry, accepts both HTMLCanvasElement and OffscreenCanvas)
     * @param _options (specifies the canvas base for imgstry)
     */
    public constructor(
        public readonly canvas: Canvas2D,
        _options?: Partial<ImgstryBrowserOptions>,
    ) {
        super();
        const options = assignDefault(_options);
        this.context = getContext2D(canvas);
        fillCanvas(this.canvas, '');
        this._original = this.clone(this.imageData);
        this._threadOptions = options.thread;
    }

    public get width() {
        return this.canvas.width;
    }

    public get height() {
        return this.canvas.height;
    }

    public get imageData(): ImageData {
        return imageData(this.canvas);
    }

    /**
     * Returns the RAW source mode currently in play: 'sensor' when a RAW
     * decode is installed via `setRawSource`, otherwise null.
     * @returns the mode marker
     */
    public get rawMode(): 'sensor' | null {
        return this._rawDecode ? 'sensor' : null;
    }

    public set imageData(image: ImageData) {
        // External u8 write invalidates any float source: the new pixel
        // data is the new baseline, so the engine drops the RAW decode
        // + working float buffer to keep the two representations in
        // sync.
        if (this._floatSource) {
            this.clearFloatSource();
            this._rawDecode = null;
            this._rawExposure = 0;
        }
        this.context.putImageData(image, 0, 0);
        this._invalidateCache();
    }

    public static loadImage = (src: string) => loadImage(Image, src);

    /**
     * Loads a camera RAW file (CR2, NEF, ARW, DNG, ORF, RW2, PEF, RAF, ...)
     * by lifting its embedded JPEG preview. Accepts an ArrayBuffer, a typed
     * array view, or a Blob / File. Throws when no preview JPEG is found
     * (true for CR3 and other HEIF-wrapped sensor data).
     * @param source the RAW file's bytes, view, or Blob/File
     * @returns a promise resolving to the loaded preview image
     */
    public static loadRaw = (source: RawSource) => loadRaw(Image, source);

    /**
     * Full RAW decode path: parses TIFF / DNG, decompresses LJPEG sensor
     * strips, demosaics the Bayer plane and tonemaps from 16-bit linear
     * to 8-bit sRGB. Falls back to the embedded JPEG preview when no
     * decodable sensor IFD is found.
     *
     * The returned object exposes the linear `rgb16` plus white-balance
     * metadata so UI layers can rebake the 8-bit buffer with a different
     * exposure without re-decoding the file.
     * @param source the RAW file's bytes, view, or Blob/File
     * @returns the loaded raw with metadata
     */
    public static loadRawFull = (source: RawSource) => loadRawFull(Image, source);

    /**
     * Draws an image on the canvas.
     * @param image The source image that will be drawn on the canvas.
     */
    public drawImage(image: HTMLImageElement | ImageBitmap) {
        // Drawing a standard image clears any float source - the new image
        // becomes the canvas-native u8 baseline.
        this.clearFloatSource();
        this._rawDecode = null;
        this._rawExposure = 0;
        setSize(this.canvas, image.width as number, image.height as number);
        drawImage(this.canvas, image);
        this._invalidateCache();
        this.draw$.next(void 0);
        this._original = this.clone(this.imageData);
    }

    /**
     * Returns the content of the current canvas as an image that you can use as a source for another canvas or an HTML element.
     * @param [type] The standard MIME type for the image format to return.
     * If you do not specify this parameter, the default value is a PNG format image.
     * @returns The image encoded as a data url.
     */
    public toDataUrl(type = 'image/png'): string {
        if ('toDataURL' in this.canvas) {
            return this.canvas.toDataURL(type);
        }

        throw new Error('toDataUrl is not supported for OffscreenCanvas, use toBlob instead.');
    }

    /**
     * Returns the content of the current canvas as a Blob.
     * Works for both HTMLCanvasElement and OffscreenCanvas surfaces.
     * @param [type] The standard MIME type for the image format to return.
     * If you do not specify this parameter, the default value is a PNG format image.
     * @returns The image encoded as a Blob.
     */
    public async toBlob(type = 'image/png'): Promise<Blob> {
        const canvas = this.canvas;

        if ('convertToBlob' in canvas) {
            return canvas.convertToBlob({ type });
        }

        return new Promise<Blob>((resolve, reject) => {
            canvas.toBlob(
                (blob) => blob ?
                    resolve(blob) :
                    reject(new Error('Canvas serialization failed.')),
                type,
            );
        });
    }

    public reset(): ImgstryProcessor {
        if (this._floatSource) {
            this._floatBuffer = new Float32Array(this._floatSource);
            this._writeFloatToCanvas(this._floatBuffer, this._floatWidth, this._floatHeight);
        } else {
            this.imageData = this._original ?? emptyImageData(this.canvas);
        }
        this._invalidateCache();
        this.draw$.next(void 0);
        return <ImgstryProcessor>this;
    }

    /**
     * Convenience: ingest 16-bit linear sensor data through the Float32
     * pipeline. Black/white levels and white balance are applied while
     * encoding to sRGB-with-overshoot; exposure is baked at decode time
     * so subsequent slider drags can recall this method to recover the
     * sensor's full headroom.
     * @param rgb16 interleaved linear RGB samples
     * @param width image width
     * @param height image height
     * @param options sensor pipeline parameters
     * @param options.blackLevel black level (raw counts)
     * @param options.whiteLevel white level (raw counts)
     * @param options.whiteBalance per-channel multipliers (R, G, B)
     * @param options.exposure exposure compensation in stops
     * @param options.cameraToSrgb optional camera-to-sRGB 3x3 matrix
     */
    public setRawSource(
        rgb16: Uint16Array,
        width: number,
        height: number,
        options: {
            blackLevel: number
            whiteLevel: number
            whiteBalance: readonly [number, number, number]
            exposure: number
            cameraToSrgb?: readonly number[] | null
        },
    ): void {
        setSize(this.canvas, width, height);
        this._rawDecode = {
            rgb16,
            width,
            height,
            blackLevel: options.blackLevel,
            whiteLevel: options.whiteLevel,
            whiteBalance: [options.whiteBalance[0], options.whiteBalance[1], options.whiteBalance[2]],
            cameraToSrgb: options.cameraToSrgb ?? null,
        };
        this._rawExposure = options.exposure;
        const buffer = rgb16ToFloat(rgb16, options);
        this.setFloatSource(buffer, width, height);
        this.draw$.next(void 0);
    }

    /**
     * Re-bakes the active RAW source with a new exposure (stops). No-op
     * when the requested exposure matches the last applied value or when
     * no RAW source is installed.
     * @param stops the new exposure compensation in stops
     * @returns true when a rebake actually fired
     */
    public rebakeExposure(stops: number): boolean {
        if (!this._rawDecode || stops === this._rawExposure) {
            return false;
        }
        const decode = this._rawDecode;
        this._rawExposure = stops;
        const buffer = rgb16ToFloat(decode.rgb16, {
            blackLevel: decode.blackLevel,
            whiteLevel: decode.whiteLevel,
            whiteBalance: decode.whiteBalance,
            exposure: stops,
            cameraToSrgb: decode.cameraToSrgb ?? undefined,
        });
        this.setFloatSource(buffer, decode.width, decode.height);
        this.draw$.next(void 0);
        return true;
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

    public renderSync(target: RenderTarget = 'current'): Imgstry {
        super.renderSync(target);
        this.draw$.next(void 0);
        return this;
    }

    public async render(target: RenderTarget = 'current'): Promise<Imgstry> {
        // Honour the explicit opt-out so callers can keep work on the main
        // thread for tight integration with animation frames (e.g. live
        // slider drags) without paying the worker round trip.
        if (this._threadOptions.isEnabled === false) {
            return this.renderSync(target);
        }

        if (this.isFloatMode()) {
            return this._renderFloatThreaded(target);
        }

        const result = await this._spawnThread().run({
            imageData: target === 'current' ?
                this.imageData :
                this.clone(this._original || emptyImageData(this.canvas)),
            operations: this._operations,
        });

        if (result) {
            this.imageData = result.imageData;
            this.draw$.next(void 0);
        }

        return this.clear();
    }

    /**
     * Destroys the thread and clears the canvas of data.
     */
    public dispose() {
        this._original = null;
        this._thread?.dispose();
        this._thread = undefined;
        this.clearFloatSource();
        this._rawDecode = null;
        this._rawExposure = 0;
        clearCanvas(this.canvas);
        this.draw$.complete();
    }

    protected override _writeFloatToCanvas(
        buffer: Float32Array,
        width: number,
        height: number,
    ): void {
        if (this.canvas.width !== width || this.canvas.height !== height) {
            setSize(this.canvas, width, height);
        }
        const target = new Uint8ClampedArray(buffer.length);
        floatToU8(buffer, target);
        const frame = new ImageData(target, width, height);
        this.context.putImageData(frame, 0, 0);
    }

    /**
     * Lazily spawns the worker thread on first async render,
     * keeping synchronous usage (including inside workers) worker-free.
     * @returns the worker thread communication layer
     */
    private _spawnThread(): ImgstryThread {
        return this._thread ??= new ImgstryThread(this._threadOptions);
    }

    private async _renderFloatThreaded(target: RenderTarget): Promise<Imgstry> {
        if (!this._floatSource) {
            return this.renderSync('current');
        }
        if (this._operations.length === 0) {
            // Nothing to do; the canvas already mirrors the float source.
            return this.clear();
        }
        // target='original' restarts from the float baseline; 'current'
        // continues from the last working buffer.
        const baseline = target === 'original' || !this._floatBuffer ?
            this._floatSource :
            this._floatBuffer;
        const result = await this._spawnThread().runFloat({
            buffer: baseline,
            width: this._floatWidth,
            height: this._floatHeight,
            operations: this._operations,
        });
        if (result) {
            this._floatBuffer = result.buffer;
            this._writeFloatToCanvas(result.buffer, this._floatWidth, this._floatHeight);
            this.draw$.next(void 0);
        }
        return this.clear();
    }
}
