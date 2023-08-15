import {
    Canvas,
    createImageData,
    Image,
} from 'canvas';
import {
    ImgstryEditor,
    ImgstryProcessor,
    RenderTarget,
} from '~/core';
import {
    drawImage,
    emptyImageData,
    fillCanvas,
    getContext2D,
    imageData,
} from '~/utils/canvas';
import { loadImage } from '~/utils/dom';

/**
 * (Exposes image processing methods for html canvas)
 */
export class Imgstry extends ImgstryEditor {
    public readonly context: CanvasRenderingContext2D;
    public readonly canvas: HTMLCanvasElement;

    /**
     * Creates an instance of Imgstry.
     * @param width the canvas width
     * @param height the canvas height
     */
    public constructor(width: number, height: number) {
        super();
        this.canvas = new Canvas(width, height);
        this.context = getContext2D(this.canvas);
        fillCanvas(this.canvas, '');
        this._original = this.clone(this.imageData);
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
     * @param image the image to draw on the canvas
     */
    public drawImage(image: Image) {
        drawImage(this.canvas, image);
        this._original = this.clone(this.imageData);
    }

    public toDataUrl(type = 'image/png'): string {
        return this.canvas.toDataURL(type);
    }

    public reset(): ImgstryProcessor {
        this.imageData = this._original || emptyImageData(this.canvas);
        return <ImgstryProcessor>this;
    }

    public clone(source: ImageData): ImageData {
        return createImageData(
            // typings are screwed 🤦‍
            new Uint8ClampedArray(source.data) as unknown as Uint16Array,
            source.width,
            source.height,
        );
    }

    public createImageData(source: ImageData): ImageData {
        return this.context.createImageData(source);
    }

    public async render(_target: RenderTarget = 'current'): Promise<Imgstry> {
        // FIXME: Implement Node Worker
        throw new Error('Not implemented');
    }
}
