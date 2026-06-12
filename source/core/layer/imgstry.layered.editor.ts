import { ImgstryEditor } from '~/core/imgstry.editor';
import { blendInto } from '~/core/layer/blend';
import {
    Layer,
    LayerOptions,
} from '~/core/layer/layer';

/**
 * Editor with multi-layer support: layers are stacked over the base
 * image and composited onto the canvas through {@link flatten}.
 */
export abstract class ImgstryLayeredEditor extends ImgstryEditor {
    private _layers: Layer[] = [];

    /**
     * The layer stack, bottom-up render order.
     * @returns the layers in the stack
     */
    public get layers(): readonly Layer[] {
        return this._layers;
    }

    /**
     * Creates a new layer on top of the stack.
     * @param options the layer options
     * @returns the created layer
     */
    public createLayer(options?: LayerOptions): Layer {
        const layer = new Layer(this, options);
        this._layers.push(layer);
        return layer;
    }

    /**
     * Removes a layer from the stack.
     * @param layer the layer to remove
     * @returns the current editor instance
     */
    public removeLayer(layer: Layer): this {
        const index = this._layers.indexOf(layer);

        if (index !== -1) {
            this._layers.splice(index, 1);
        }

        return this;
    }

    /**
     * Moves a layer to a new position in the stack.
     * @param layer the layer to move
     * @param index the target position in the stack
     * @returns the current editor instance
     */
    public moveLayer(layer: Layer, index: number): this {
        const current = this._layers.indexOf(layer);

        if (current === -1) {
            return this;
        }

        this._layers.splice(current, 1);
        this._layers.splice(Math.max(0, Math.min(index, this._layers.length)), 0, layer);

        return this;
    }

    /**
     * Composites all visible layers over the current image
     * and writes the result back to the canvas.
     * @returns the current editor instance
     */
    public flatten(): this {
        if (!this._layers.length) {
            return this;
        }

        const result = this.imageData;

        for (const layer of this._layers) {
            if (!layer.visible || layer.opacity <= 0) {
                continue;
            }

            blendInto(result, layer.imageData, layer.blendMode, layer.opacity);
        }

        this.imageData = result;
        this._invalidateCache();

        return this;
    }
}
