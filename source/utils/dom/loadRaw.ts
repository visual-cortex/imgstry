import { extractEmbeddedJpeg } from '~/utils/raw';

interface ImageConstructor {
    new(): HTMLImageElement
}

export type RawSource = ArrayBuffer | ArrayBufferView | Blob;

const toArrayBuffer = async (source: RawSource): Promise<ArrayBuffer> => {
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

/**
 * Decodes a camera RAW file by lifting its embedded full-size JPEG
 * preview, then returns it as an HTMLImageElement ready for canvas draw.
 *
 * Works for TIFF-based RAW (CR2, NEF, ARW, DNG, ORF, RW2, PEF) plus
 * RAF. CR3 / HEIF-based formats are not parsed; they fall through to the
 * "no preview" error and need a full sensor decoder.
 * @param ImageCtor the HTMLImageElement constructor reference
 * @param source the RAW file's bytes, view, or Blob/File
 * @returns a promise resolving to the loaded preview image element
 */
export const loadRaw = async (
    ImageCtor: ImageConstructor,
    source: RawSource,
): Promise<HTMLImageElement> => {
    const buffer = await toArrayBuffer(source);
    const jpeg = extractEmbeddedJpeg(buffer);

    if (!jpeg) {
        throw new Error('No embedded JPEG preview found in RAW file.');
    }

    const blob = new Blob([jpeg], { type: 'image/jpeg' });
    const url = URL.createObjectURL(blob);

    try {
        return await new Promise<HTMLImageElement>((res, rej) => {
            const image = new ImageCtor();
            image.crossOrigin = 'Anonymous';
            image.onload = () => res(image);
            image.onerror = (err) => rej(err);
            image.src = url;
        });
    } finally {
        URL.revokeObjectURL(url);
    }
};
