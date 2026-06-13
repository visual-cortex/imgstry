import { ImgstryEditor } from '~/core/imgstry.editor';
import { ImgstryProcessor } from '~/core/imgstry.processor';
import { BlendMode } from '~/core/layer/blend';
import { RenderTarget } from '~/core/types';

/**
 * Layer creation options.
 */
export interface LayerOptions {
    /**
     * Display name of the layer.
     */
    name?: string
    /**
     * Layer opacity in the [0, 1] interval.
     */
    opacity?: number
    /**
     * Blend mode used when compositing the layer.
     */
    blendMode?: BlendMode
    /**
     * Whether the layer participates in compositing.
     */
    visible?: boolean
    /**
     * Initial layer content, defaults to a transparent buffer
     * matching the host dimensions.
     */
    imageData?: ImageData
}

/**
 * An off-canvas image buffer with its own operation pipeline,
 * composited over the host image via {@link BlendMode}.
 */
export class Layer extends ImgstryEditor {
    public name: string;
    public opacity: number;
    public blendMode: BlendMode;
    public visible: boolean;

    private _imageData: ImageData;

    /**
     * Creates a layer bound to a host processor.
     * @param _host the processor providing image data factories
     * @param options the layer options
     */
    public constructor(
        private _host: ImgstryProcessor,
        options: LayerOptions = {},
    ) {
        super();
        this.name = options.name ?? 'layer';
        this.opacity = options.opacity ?? 1;
        this.blendMode = options.blendMode ?? 'normal';
        this.visible = options.visible ?? true;
        this._imageData = options.imageData ?? _host.createImageData(_host.imageData);
        this._original = this.clone(this._imageData);
    }

    public get width() {
        return this._imageData.width;
    }

    public get height() {
        return this._imageData.height;
    }

    public get imageData(): ImageData {
        return this._imageData;
    }

    public set imageData(image: ImageData) {
        this._imageData = image;
        this._invalidateCache();
    }

    public toDataUrl(_type?: string): string {
        throw new Error('toDataUrl is not supported on a layer, flatten the host instead.');
    }

    public reset(): ImgstryProcessor {
        this._imageData = this._original ?
            this.clone(this._original) :
            this._host.createImageData(this._imageData);
        this._invalidateCache();
        return <ImgstryProcessor>this;
    }

    public clone(source: ImageData): ImageData {
        return this._host.clone(source);
    }

    public createImageData(source: ImageData): ImageData {
        return this._host.createImageData(source);
    }

    public async render(target: RenderTarget = 'current'): Promise<Layer> {
        return <Layer>this.renderSync(target);
    }
}
