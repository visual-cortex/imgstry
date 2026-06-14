import { decodeRaw } from '~/utils/raw/decodeRaw';
import { extractEmbeddedJpeg } from '~/utils/raw/extractEmbeddedJpeg';
import { loadImage } from '~/utils/dom/loadImage';
import type { RawSource } from '~/utils/dom/loadRaw';

interface ImageConstructor {
    new(): HTMLImageElement
}

export interface LoadedRaw {
    /** Width of the decoded image (sensor or preview). */
    width: number
    /** Height of the decoded image. */
    height: number
    /** RGBA8 buffer ready to write into a canvas. */
    imageData: ImageData
    /** "sensor" when the full 16-bit pipeline ran, "preview" for fallback. */
    source: 'sensor' | 'preview'
    /** Linear demosaiced 16-bit RGB. Present only for source="sensor". */
    rgb16?: Uint16Array
    /** Per-channel white-balance multipliers (R, G, B). */
    whiteBalance?: [number, number, number]
    /** Sensor black level (raw counts). */
    blackLevel?: number
    /** Sensor white level (raw counts). */
    whiteLevel?: number
}

const toBuffer = async (source: RawSource): Promise<ArrayBuffer> => {
    if (source instanceof ArrayBuffer) {
        return source;
    }
    if (ArrayBuffer.isView(source)) {
        const copy = new Uint8Array(source.byteLength);
        copy.set(new Uint8Array(source.buffer, source.byteOffset, source.byteLength));
        return copy.buffer;
    }
    return source.arrayBuffer();
};

const decodeViaPreview = async (
    ImageCtor: ImageConstructor,
    buffer: ArrayBuffer,
): Promise<LoadedRaw> => {
    const jpeg = extractEmbeddedJpeg(buffer);
    if (!jpeg) {
        throw new Error('No embedded JPEG preview found in RAW file.');
    }
    const blob = new Blob([jpeg], { type: 'image/jpeg' });
    const url = URL.createObjectURL(blob);
    try {
        const image = await loadImage(ImageCtor, url);
        const canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Failed to acquire 2D context for RAW preview.');
        }
        ctx.drawImage(image, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        return {
            width: canvas.width,
            height: canvas.height,
            imageData,
            source: 'preview',
        };
    } finally {
        URL.revokeObjectURL(url);
    }
};

/**
 * Decodes a camera RAW file into an ImageData. Tries the full 16-bit
 * sensor pipeline (TIFF + LJPEG / uncompressed + demosaic + tonemap)
 * first; falls back to the embedded JPEG preview when no IFD matches.
 *
 * The returned object includes the linear `rgb16` source for sensor
 * decodes so callers can rebake an 8-bit ImageData with different
 * exposure / white-balance without losing headroom.
 * @param ImageCtor the HTMLImageElement constructor reference
 * @param source the RAW file's bytes, view, or Blob/File
 * @returns the loaded raw with metadata, or rejects when neither path works
 */
export const loadRawFull = async (
    ImageCtor: ImageConstructor,
    source: RawSource,
): Promise<LoadedRaw> => {
    const buffer = await toBuffer(source);

    const sensor = decodeRaw(buffer);
    if (sensor) {
        const rgba = new Uint8ClampedArray(sensor.rgba);
        const imageData = new ImageData(rgba, sensor.width, sensor.height);
        return {
            width: sensor.width,
            height: sensor.height,
            imageData,
            source: 'sensor',
            rgb16: sensor.rgb16,
            whiteBalance: sensor.whiteBalance,
            blackLevel: sensor.blackLevel,
            whiteLevel: sensor.whiteLevel,
        };
    }

    return decodeViaPreview(ImageCtor, buffer);
};
