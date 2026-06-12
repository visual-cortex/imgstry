import { describe, beforeEach, expect, it } from 'vitest';
import { blendInto } from '~/core';
import { Imgstry } from '~/platform/node';

const pixelAt = (image: ImageData, x: number, y: number) => {
    const offset = (y * image.width + x) * 4;
    return {
        r: image.data[offset],
        g: image.data[offset + 1],
        b: image.data[offset + 2],
        a: image.data[offset + 3],
    };
};

describe('class: Layer', () => {
    const size = 16;
    let host: Imgstry;

    beforeEach(() => {
        host = new Imgstry(size, size);
        host.fill('#0000FF').renderSync();
    });

    it('should create a transparent layer with sane defaults', () => {
        const layer = host.createLayer();

        expect(layer.opacity).equal(1);
        expect(layer.blendMode).equal('normal');
        expect(layer.visible).equal(true);
        expect(layer.width).equal(size);
        expect(layer.height).equal(size);
        expect(layer.imageData.data[3]).equal(0);
        expect(host.layers).length(1);
    });

    it('should composite an opaque normal layer over the base', () => {
        host.createLayer().fill('#FF0000').renderSync();

        host.flatten();

        const pixel = pixelAt(host.imageData, 8, 8);
        expect(pixel.r).equal(255);
        expect(pixel.g).equal(0);
        expect(pixel.b).equal(0);
        expect(pixel.a).equal(255);
    });

    it('should respect layer opacity', () => {
        const layer = host.createLayer({ opacity: .5 });
        layer.fill('#FF0000').renderSync();

        host.flatten();

        const pixel = pixelAt(host.imageData, 8, 8);
        expect(pixel.r).approximately(128, 1);
        expect(pixel.b).approximately(128, 1);
        expect(pixel.a).equal(255);
    });

    it('should skip invisible layers', () => {
        const layer = host.createLayer({ visible: false });
        layer.fill('#FF0000').renderSync();

        host.flatten();

        const pixel = pixelAt(host.imageData, 8, 8);
        expect(pixel.b).equal(255);
        expect(pixel.r).equal(0);
    });

    it('should support fluent operations on a layer', () => {
        const layer = host.createLayer();
        layer
            .fill('#808080')
            .brightness(50)
            .renderSync();

        host.flatten();

        const pixel = pixelAt(host.imageData, 8, 8);
        expect(pixel.r).greaterThan(128);
    });

    it('should remove layers', () => {
        const layer = host.createLayer();
        host.removeLayer(layer);

        expect(host.layers).length(0);
    });

    it('should reorder layers', () => {
        const bottom = host.createLayer({ name: 'bottom' });
        const top = host.createLayer({ name: 'top' });

        host.moveLayer(top, 0);

        expect(host.layers[0]).equal(top);
        expect(host.layers[1]).equal(bottom);
    });

    it('should compose layers in stack order', () => {
        host.createLayer().fill('#FF0000').renderSync();
        host.createLayer().fill('#00FF00').renderSync();

        host.flatten();

        const pixel = pixelAt(host.imageData, 8, 8);
        expect(pixel.g).equal(255);
        expect(pixel.r).equal(0);
    });

    it('should reset a layer to its creation state', () => {
        const layer = host.createLayer();
        layer.fill('#FF0000').renderSync();
        layer.reset();

        expect(layer.imageData.data[3]).equal(0);
    });

    it('should throw for toDataUrl', () => {
        const layer = host.createLayer();

        expect(() => layer.toDataUrl()).to.throw(/flatten/);
    });
});

describe('function: blendInto', () => {
    const single = (rgba: [number, number, number, number]) => {
        const image = new Imgstry(1, 1).imageData;
        image.data.set(rgba);
        return image;
    };

    it('multiply with white should be identity', () => {
        const base = single([100, 150, 200, 255]);
        blendInto(base, single([255, 255, 255, 255]), 'multiply', 1);

        expect(Array.from(base.data)).deep.equal([100, 150, 200, 255]);
    });

    it('multiply with black should produce black', () => {
        const base = single([100, 150, 200, 255]);
        blendInto(base, single([0, 0, 0, 255]), 'multiply', 1);

        expect(Array.from(base.data)).deep.equal([0, 0, 0, 255]);
    });

    it('screen with black should be identity', () => {
        const base = single([100, 150, 200, 255]);
        blendInto(base, single([0, 0, 0, 255]), 'screen', 1);

        expect(Array.from(base.data)).deep.equal([100, 150, 200, 255]);
    });

    it('darken should keep the smaller channel', () => {
        const base = single([100, 150, 200, 255]);
        blendInto(base, single([150, 100, 250, 255]), 'darken', 1);

        expect(Array.from(base.data)).deep.equal([100, 100, 200, 255]);
    });

    it('lighten should keep the larger channel', () => {
        const base = single([100, 150, 200, 255]);
        blendInto(base, single([150, 100, 250, 255]), 'lighten', 1);

        expect(Array.from(base.data)).deep.equal([150, 150, 250, 255]);
    });

    it('transparent source should leave the base untouched', () => {
        const base = single([100, 150, 200, 255]);
        blendInto(base, single([255, 255, 255, 0]), 'normal', 1);

        expect(Array.from(base.data)).deep.equal([100, 150, 200, 255]);
    });

    it('source over transparent base should keep the source color', () => {
        const base = single([0, 0, 0, 0]);
        blendInto(base, single([255, 0, 0, 255]), 'normal', 1);

        expect(Array.from(base.data)).deep.equal([255, 0, 0, 255]);
    });
});
