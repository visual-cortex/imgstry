/* eslint-disable sonarjs/cognitive-complexity */
// Minimal TIFF / TIFF-EP / DNG IFD reader. Resolves enough tags to drive
// a RAW decoder: dimensions, bit depth, compression code, strip / tile
// offsets, CFA pattern, black + white levels, AsShotNeutral. Other tags
// pass through as raw number arrays.

const TIFF_TYPE_SIZE: Readonly<Record<number, number>> = {
    1: 1,  // BYTE
    2: 1,  // ASCII
    3: 2,  // SHORT
    4: 4,  // LONG
    5: 8,  // RATIONAL
    6: 1,  // SBYTE
    7: 1,  // UNDEFINED
    8: 2,  // SSHORT
    9: 4,  // SLONG
    10: 8, // SRATIONAL
    11: 4, // FLOAT
    12: 8, // DOUBLE
};

const TAG_SUB_IFDS = 0x014A;
const MAX_IFDS = 32;

export interface TiffField {
    tag: number
    type: number
    count: number
    values: number[]
}

export interface TiffIfd {
    fields: ReadonlyMap<number, TiffField>
    nextOffset: number
}

export interface TiffDoc {
    littleEndian: boolean
    ifds: TiffIfd[]
}

interface TiffReader {
    view: DataView
    le: boolean
}

const u16 = (r: TiffReader, o: number): number => r.view.getUint16(o, r.le);
const u32 = (r: TiffReader, o: number): number => r.view.getUint32(o, r.le);
const i16 = (r: TiffReader, o: number): number => r.view.getInt16(o, r.le);
const i32 = (r: TiffReader, o: number): number => r.view.getInt32(o, r.le);
const f32 = (r: TiffReader, o: number): number => r.view.getFloat32(o, r.le);
const f64 = (r: TiffReader, o: number): number => r.view.getFloat64(o, r.le);

/**
 * Reads `count` numbers of the given TIFF type starting at `start`.
 * @param r the reader
 * @param type the TIFF type code (1-12)
 * @param count the number of items
 * @param start the byte offset of the first item
 * @returns the parsed values as a number array
 */
const readValuesAt = (r: TiffReader, type: number, count: number, start: number): number[] => {
    const out: number[] = new Array(count);
    switch (type) {
        // BYTE, ASCII, UNDEFINED all read as raw bytes; ASCII callers
        // can rebuild a string. We do not need ASCII for RAW decode.
        case 1: case 2: case 7:
            for (let i = 0; i < count; i++) {
                out[i] = r.view.getUint8(start + i);
            }
            break;
        case 3:
            for (let i = 0; i < count; i++) {
                out[i] = u16(r, start + i * 2);
            }
            break;
        case 4:
            for (let i = 0; i < count; i++) {
                out[i] = u32(r, start + i * 4);
            }
            break;
        case 5:
            for (let i = 0; i < count; i++) {
                const num = u32(r, start + i * 8);
                const den = u32(r, start + i * 8 + 4);
                out[i] = den === 0 ? 0 : num / den;
            }
            break;
        case 6:
            for (let i = 0; i < count; i++) {
                out[i] = r.view.getInt8(start + i);
            }
            break;
        case 8:
            for (let i = 0; i < count; i++) {
                out[i] = i16(r, start + i * 2);
            }
            break;
        case 9:
            for (let i = 0; i < count; i++) {
                out[i] = i32(r, start + i * 4);
            }
            break;
        case 10:
            for (let i = 0; i < count; i++) {
                const num = i32(r, start + i * 8);
                const den = i32(r, start + i * 8 + 4);
                out[i] = den === 0 ? 0 : num / den;
            }
            break;
        case 11:
            for (let i = 0; i < count; i++) {
                out[i] = f32(r, start + i * 4);
            }
            break;
        case 12:
            for (let i = 0; i < count; i++) {
                out[i] = f64(r, start + i * 8);
            }
            break;
        default:
            return [];
    }
    return out;
};

/**
 * Reads the values of a single IFD entry whose 12 bytes start at
 * `entryOffset`. Handles the inline vs. out-of-line distinction.
 * @param r the reader
 * @param entryOffset the byte offset of the 12-byte entry
 * @returns the parsed field, or null when the type is unknown
 */
const readEntry = (r: TiffReader, entryOffset: number): TiffField | null => {
    const tag = u16(r, entryOffset);
    const type = u16(r, entryOffset + 2);
    const count = u32(r, entryOffset + 4);
    const size = TIFF_TYPE_SIZE[type] ?? 0;

    if (size === 0) {
        return null;
    }

    const totalBytes = size * count;
    const valueSlot = entryOffset + 8;
    const start = totalBytes <= 4 ? valueSlot : u32(r, valueSlot);
    const values = readValuesAt(r, type, count, start);

    return { tag, type, count, values };
};

/**
 * Parses one IFD beginning at `offset` and returns its field map plus
 * the chained next-IFD offset.
 * @param r the reader
 * @param offset the IFD start offset
 * @returns the parsed IFD
 */
const parseIfd = (r: TiffReader, offset: number): TiffIfd => {
    const count = u16(r, offset);
    const fields = new Map<number, TiffField>();

    for (let i = 0; i < count; i++) {
        const field = readEntry(r, offset + 2 + i * 12);
        if (field) {
            fields.set(field.tag, field);
        }
    }

    const nextOffset = u32(r, offset + 2 + count * 12);
    return { fields, nextOffset };
};

/**
 * Parses a TIFF / TIFF-EP / DNG header and walks the IFD chain plus any
 * SubIFDs it points at. Stops at MAX_IFDS to bound runtime on adversarial
 * inputs. Returns null when the bytes are not a valid TIFF.
 * @param source the file bytes
 * @returns the parsed document, or null when the bytes are not TIFF
 */
export const parseTiff = (
    source: ArrayBuffer | ArrayBufferView,
): TiffDoc | null => {
    const view = source instanceof ArrayBuffer ?
        new DataView(source) :
        new DataView(source.buffer, source.byteOffset, source.byteLength);

    if (view.byteLength < 8) {
        return null;
    }

    const order = view.getUint16(0, false);
    let littleEndian: boolean;

    if (order === 0x4949) {
        littleEndian = true;
    } else if (order === 0x4D4D) {
        littleEndian = false;
    } else {
        return null;
    }

    const reader: TiffReader = { view, le: littleEndian };

    try {
        if (u16(reader, 2) !== 42) {
            return null;
        }

        const ifds: TiffIfd[] = [];
        let nextOffset = u32(reader, 4);
        const byteLength = view.byteLength;

        while (
            nextOffset !== 0 &&
            nextOffset + 2 <= byteLength &&
            ifds.length < MAX_IFDS
        ) {
            const entryCount = u16(reader, nextOffset);
            const ifdEnd = nextOffset + 2 + entryCount * 12 + 4;
            if (ifdEnd > byteLength) {
                break;
            }
            const ifd = parseIfd(reader, nextOffset);
            ifds.push(ifd);

            const sub = ifd.fields.get(TAG_SUB_IFDS);
            if (sub) {
                for (const subOffset of sub.values) {
                    if (ifds.length >= MAX_IFDS) {
                        break;
                    }
                    if (subOffset + 2 > byteLength) {
                        continue;
                    }
                    ifds.push(parseIfd(reader, subOffset));
                }
            }

            nextOffset = ifd.nextOffset;
        }

        return { littleEndian, ifds };
    } catch {
        // Malformed input: out-of-range reads, etc. Treat as not-TIFF.
        return null;
    }
};

/**
 * Convenience: returns the first value of a tag, or `fallback`.
 * @param ifd the parsed IFD
 * @param tag the tag number
 * @param fallback the value to return when absent
 * @returns the first value of the tag, or fallback
 */
export const readFirst = (
    ifd: TiffIfd,
    tag: number,
    fallback: number,
): number => {
    const field = ifd.fields.get(tag);
    return field && field.values.length > 0 ? field.values[0] : fallback;
};

/**
 * Convenience: returns the full value list of a tag (empty when absent).
 * @param ifd the parsed IFD
 * @param tag the tag number
 * @returns the values array (empty when absent)
 */
export const readAll = (ifd: TiffIfd, tag: number): readonly number[] => {
    const field = ifd.fields.get(tag);
    return field ? field.values : [];
};
