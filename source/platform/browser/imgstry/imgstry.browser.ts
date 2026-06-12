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
} from '~/utils/dom';

export interface ImgstryBrowserOptions {
    thread: ImgstryThreadOptions
}

const DEFAULT_OPTIONS: ImgstryBrowserOptions = {
    thread: {
        isDebugEnabled: false,
    },
};

const assignDefault = (source: Partial<ImgstryBrowserOptions> = {}): ImgstryBrowserOptions => {
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

    public set imageData(image: ImageData) {
        this.context.putImageData(image, 0, 0);
    }

    public static loadImage = (src: string) => loadImage(Image, src);

    /**
     * Draws an image on the canvas.
     * @param image The source image that will be drawn on the canvas.
     */
    public drawImage(image: HTMLImageElement | ImageBitmap) {
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
        this.imageData = this._original ?? emptyImageData(this.canvas);
        this._invalidateCache();
        this.draw$.next(void 0);
        return <ImgstryProcessor>this;
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
        const result = await this._spawnThread().run({
            imageData: target === 'current' ?
                this.imageData :
                this.clone(this._original || emptyImageData(this.canvas)),
            operations: this._operations,
        });

        if (result) {
            this.imageData = result.imageData;
            this._invalidateCache();
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
        clearCanvas(this.canvas);
        this.draw$.complete();
    }

    /**
     * Lazily spawns the worker thread on first async render,
     * keeping synchronous usage (including inside workers) worker-free.
     * @returns the worker thread communication layer
     */
    private _spawnThread(): ImgstryThread {
        return this._thread ??= new ImgstryThread(this._threadOptions);
    }
}
