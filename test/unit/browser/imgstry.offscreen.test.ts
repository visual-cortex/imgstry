import { describe, beforeAll, expect, it } from 'vitest';
import { Canvas } from 'canvas';
import { Imgstry } from '~/platform/browser';


const nodeCanvas = require('canvas');

/**
 * Minimal OffscreenCanvas stand-in backed by node-canvas,
 * mirroring the surface imgstry relies on.
 */
class OffscreenCanvasStub {
    private _inner: Canvas;

    public constructor(width: number, height: number) {
        this._inner = new Canvas(width, height);
    }

    public get width(): number {
        return this._inner.width;
    }

    public get height(): number {
        return this._inner.height;
    }

    public set width(value: number) {
        this._inner.width = value;
    }

    public set height(value: number) {
        this._inner.height = value;
    }

    public getContext(contextId: '2d', options?: unknown): unknown {
        void options;
        return this._inner.getContext(contextId);
    }

    public convertToBlob(options?: { type?: string }): Promise<Blob> {
        const buffer = (this._inner as unknown as { toBuffer(): Uint8Array<ArrayBuffer> }).toBuffer();
        return Promise.resolve(new Blob([buffer], { type: options?.type ?? 'image/png' }));
    }
}

describe('class: Imgstry (offscreen canvas)', () => {
    const size = 50;

    beforeAll(() => {
        (globalThis as Record<string, unknown>).ImageData = nodeCanvas.ImageData;
    });

    const create = () =>
        new Imgstry(new OffscreenCanvasStub(size, size) as unknown as OffscreenCanvas);

    it('should construct against an offscreen canvas surface', () => {
        const processor = create();

        expect(processor.width).equal(size);
        expect(processor.height).equal(size);
    });

    it('should process operations synchronously', () => {
        const processor = create();

        processor
            .fill('#3498DB')
            .renderSync();

        const data = processor.imageData.data;

        expect(data[0]).equal(0x34);
        expect(data[1]).equal(0x98);
        expect(data[2]).equal(0xDB);
    });

    it('should compute the histogram', () => {
        const processor = create();

        processor
            .fill('#FFFFFF')
            .renderSync();

        const histogram = processor.histogram;

        expect(histogram.all[255]).approximately(1, 1e-7);
        expect(histogram.channel.red[255]).approximately(1, 1e-7);
    });

    it('should throw for toDataUrl', () => {
        const processor = create();

        expect(() => processor.toDataUrl()).to.throw(/OffscreenCanvas/);
    });

    it('should serialize through toBlob', async () => {
        const processor = create();

        processor
            .fill('#000000')
            .renderSync();

        const blob = await processor.toBlob();

        expect(blob).instanceOf(Blob);
        expect(blob.size).greaterThan(0);
    });
});
