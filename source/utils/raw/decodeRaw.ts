
import { decodeLjpeg } from './decodeLjpeg';
import { demosaicRggbBilinear } from './demosaicRggb';
import { parseTiff, readAll, readFirst, type TiffIfd } from './parseTiff';
import { tonemap16to8 } from './tonemap16';

// Tag numbers used during decode. Names match the TIFF / TIFF-EP / DNG
// specifications.
const TAG_NEW_SUBFILE_TYPE = 0x00FE;
const TAG_IMAGE_WIDTH = 0x0100;
const TAG_IMAGE_LENGTH = 0x0101;
const TAG_BITS_PER_SAMPLE = 0x0102;
const TAG_COMPRESSION = 0x0103;
const TAG_PHOTOMETRIC = 0x0106;
const TAG_STRIP_OFFSETS = 0x0111;
const TAG_ROWS_PER_STRIP = 0x0116;
const TAG_STRIP_BYTE_COUNTS = 0x0117;
const TAG_CFA_PATTERN = 0x828E;
const TAG_CFA_PATTERN_DNG = 0xC616;
const TAG_BLACK_LEVEL = 0xC61A;
const TAG_WHITE_LEVEL = 0xC61D;
const TAG_AS_SHOT_NEUTRAL = 0xC628;

const PHOTOMETRIC_CFA = 32803;
const PHOTOMETRIC_LINEAR_RAW = 34892;

const COMPRESSION_UNCOMPRESSED = 1;
const COMPRESSION_LJPEG = 7;

export interface RawDecodeResult {
    width: number
    height: number
    /** Linear demosaiced RGB at 16 bits per channel, interleaved. */
    rgb16: Uint16Array
    /** Sensor white-balance multipliers (R, G, B). */
    whiteBalance: [number, number, number]
    blackLevel: number
    whiteLevel: number
    /** Default 8-bit RGBA tonemap at exposure 0. */
    rgba: Uint8ClampedArray
}

const isSensorIfd = (ifd: TiffIfd): boolean => {
    const photometric = readFirst(ifd, TAG_PHOTOMETRIC, -1);
    if (photometric === PHOTOMETRIC_CFA || photometric === PHOTOMETRIC_LINEAR_RAW) {
        return true;
    }
    // Some camera-makers omit Photometric; fall back to NewSubFileType=0
    // when the IFD also has a strip large enough to be sensor data.
    const subFileType = readFirst(ifd, TAG_NEW_SUBFILE_TYPE, -1);
    if (subFileType === 0) {
        const stripBytes = readAll(ifd, TAG_STRIP_BYTE_COUNTS);
        const width = readFirst(ifd, TAG_IMAGE_WIDTH, 0);
        const height = readFirst(ifd, TAG_IMAGE_LENGTH, 0);
        if (width >= 256 && height >= 256 && stripBytes.length > 0) {
            return true;
        }
    }
    return false;
};

const checkRggbPattern = (ifd: TiffIfd): boolean => {
    // DNG: TAG_CFA_PATTERN_DNG holds the actual pattern (4 bytes for 2x2).
    // TIFF-EP: TAG_CFA_PATTERN + TAG_CFA_PATTERN_DIM hold it.
    const dng = readAll(ifd, TAG_CFA_PATTERN_DNG);
    const ep = readAll(ifd, TAG_CFA_PATTERN);

    const pattern = dng.length >= 4 ? dng : ep;
    if (pattern.length < 4) {
        // Assume RGGB when the pattern is missing - that's the most
        // common layout and any other order will land on the next pass.
        return true;
    }

    // CFA pattern values: 0 = R, 1 = G, 2 = B
    return pattern[0] === 0 && pattern[1] === 1 && pattern[2] === 1 && pattern[3] === 2;
};

const readBlackLevel = (ifd: TiffIfd): number => {
    const values = readAll(ifd, TAG_BLACK_LEVEL);
    if (values.length === 0) {
        return 0;
    }
    let sum = 0;
    for (const v of values) {
        sum += v;
    }
    return Math.round(sum / values.length);
};

const readWhiteLevel = (ifd: TiffIfd, bitsPerSample: number): number => {
    const value = readFirst(ifd, TAG_WHITE_LEVEL, -1);
    if (value > 0) {
        return value;
    }
    return (1 << bitsPerSample) - 1;
};

const readWhiteBalance = (ifd: TiffIfd): [number, number, number] => {
    const neutral = readAll(ifd, TAG_AS_SHOT_NEUTRAL);
    if (neutral.length < 3) {
        return [1, 1, 1];
    }

    // AsShotNeutral is the camera's sensor RGB triplet for a neutral
    // gray patch. The multipliers needed at render time are the
    // reciprocals, normalised so green = 1.
    const [r, g, b] = [neutral[0], neutral[1], neutral[2]];
    if (r === 0 || g === 0 || b === 0) {
        return [1, 1, 1];
    }
    return [g / r, 1, g / b];
};

const readUncompressedStrip = (
    bytes: Uint8Array,
    offset: number,
    length: number,
    bitsPerSample: number,
    littleEndian: boolean,
    pixelCount: number,
): Uint16Array => {
    const out = new Uint16Array(pixelCount);

    if (bitsPerSample === 16) {
        const view = new DataView(bytes.buffer, bytes.byteOffset + offset, length);
        for (let i = 0; i < pixelCount; i++) {
            out[i] = view.getUint16(i * 2, littleEndian);
        }
        return out;
    }

    if (bitsPerSample === 8) {
        for (let i = 0; i < pixelCount; i++) {
            out[i] = bytes[offset + i];
        }
        return out;
    }

    // Packed bits (12 / 14): read MSB-first, stride = bitsPerSample bits.
    let bitBuf = 0;
    let bitCnt = 0;
    let cursor = offset;
    const mask = (1 << bitsPerSample) - 1;
    for (let i = 0; i < pixelCount; i++) {
        while (bitCnt < bitsPerSample) {
            bitBuf = (bitBuf << 8) | bytes[cursor++];
            bitCnt += 8;
        }
        out[i] = (bitBuf >> (bitCnt - bitsPerSample)) & mask;
        bitCnt -= bitsPerSample;
    }
    return out;
};

const decodeBayerPlane = (
    bytes: Uint8Array,
    ifd: TiffIfd,
    width: number,
    height: number,
    bitsPerSample: number,
    littleEndian: boolean,
): Uint16Array => {
    const offsets = readAll(ifd, TAG_STRIP_OFFSETS);
    const sizes = readAll(ifd, TAG_STRIP_BYTE_COUNTS);
    const compression = readFirst(ifd, TAG_COMPRESSION, COMPRESSION_UNCOMPRESSED);

    if (offsets.length === 0 || sizes.length === 0) {
        throw new Error('decodeRaw: sensor IFD has no strips');
    }

    if (compression === COMPRESSION_UNCOMPRESSED) {
        return readUncompressedStrip(
            bytes, offsets[0], sizes[0], bitsPerSample, littleEndian, width * height,
        );
    }

    if (compression === COMPRESSION_LJPEG) {
        const rowsPerStrip = readFirst(ifd, TAG_ROWS_PER_STRIP, height);
        const plane = new Uint16Array(width * height);
        let rowCursor = 0;

        for (let s = 0; s < offsets.length; s++) {
            const stripRows = Math.min(rowsPerStrip, height - rowCursor);
            const decoded = decodeLjpeg(bytes, offsets[s], sizes[s]);

            // Some encoders write Nf=2 LJPEG where the frame width is
            // sensor_width / 2 and each pair holds two columns of Bayer.
            const expectedPlaneSize = width * stripRows;
            if (decoded.samples.length === expectedPlaneSize) {
                plane.set(decoded.samples, rowCursor * width);
            } else if (
                decoded.components === 2 &&
                decoded.width * 2 * decoded.height === expectedPlaneSize
            ) {
                // Re-pack interleaved 2-component samples into a flat
                // Bayer plane row by row.
                let dst = rowCursor * width;
                for (let i = 0; i < decoded.samples.length; i++) {
                    plane[dst++] = decoded.samples[i];
                }
            } else {
                throw new Error(
                    `decodeRaw: LJPEG strip size mismatch (got ${decoded.samples.length}, expected ${expectedPlaneSize})`,
                );
            }
            rowCursor += stripRows;
        }

        return plane;
    }

    throw new Error(`decodeRaw: compression ${compression} not supported`);
};

/**
 * Attempts to decode a TIFF-based RAW file into demosaiced 16-bit linear
 * RGB plus a default 8-bit tonemap. Returns null when no IFD looks like
 * sensor data we can decode (in which case callers should fall back to
 * the embedded JPEG preview).
 * @param source the RAW file bytes
 * @returns decode result, or null when the file is unsupported
 */
export const decodeRaw = (
    source: ArrayBuffer | ArrayBufferView,
): RawDecodeResult | null => {
    const tiff = parseTiff(source);
    if (!tiff) {
        return null;
    }

    const bytes = source instanceof ArrayBuffer ?
        new Uint8Array(source) :
        new Uint8Array(source.buffer, source.byteOffset, source.byteLength);

    for (const ifd of tiff.ifds) {
        if (!isSensorIfd(ifd)) {
            continue;
        }
        if (!checkRggbPattern(ifd)) {
            continue;
        }

        const width = readFirst(ifd, TAG_IMAGE_WIDTH, 0);
        const height = readFirst(ifd, TAG_IMAGE_LENGTH, 0);
        const bitsPerSample = readFirst(ifd, TAG_BITS_PER_SAMPLE, 0);

        if (width <= 0 || height <= 0 || bitsPerSample <= 0) {
            continue;
        }

        try {
            const plane = decodeBayerPlane(bytes, ifd, width, height, bitsPerSample, tiff.littleEndian);
            const rgb16 = demosaicRggbBilinear(plane, width, height);
            const blackLevel = readBlackLevel(ifd);
            const whiteLevel = readWhiteLevel(ifd, bitsPerSample);
            const whiteBalance = readWhiteBalance(ifd);

            const rgba = tonemap16to8(rgb16, width, height, {
                blackLevel, whiteLevel, whiteBalance, exposure: 0,
            });

            return { width, height, rgb16, whiteBalance, blackLevel, whiteLevel, rgba };
        } catch {
            // Try the next candidate IFD on any decode failure.
            continue;
        }
    }

    return null;
};
