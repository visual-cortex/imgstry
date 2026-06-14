import { describe, expect, it } from 'vitest';
import { parseTiff, readFirst, readAll } from '~/utils/raw/parseTiff';

interface Entry {
    tag: number
    type: number
    count: number
    /** Inline values (<= 4 bytes) or absolute file offset when > 4 bytes. */
    payload: number[]
    payloadLayout: 'inline' | 'offset'
}

/**
 * Builds a tiny little-endian TIFF with one IFD containing the given
 * entries. Inline payloads are packed left-justified into the 4-byte
 * value slot; out-of-line payloads are written after the IFD at the
 * offset they reference.
 * @param entries IFD entries to write
 * @param extra extra byte payloads placed at specific file offsets
 * @returns the synthetic TIFF bytes
 */
const buildTiff = (entries: Entry[], extra: { offset: number; bytes: number[] }[] = []): Uint8Array => {
    const ifdSize = 2 + entries.length * 12 + 4;
    const headerSize = 8;
    const baseAfterIfd = headerSize + ifdSize;
    const buffer: number[] = [];

    // Header: II, magic 42, offset to IFD = 8
    buffer.push(0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00);

    // IFD: count
    buffer.push(entries.length & 0xFF, (entries.length >> 8) & 0xFF);

    for (const entry of entries) {
        buffer.push(entry.tag & 0xFF, (entry.tag >> 8) & 0xFF);
        buffer.push(entry.type & 0xFF, (entry.type >> 8) & 0xFF);
        const c = entry.count;
        buffer.push(c & 0xFF, (c >> 8) & 0xFF, (c >> 16) & 0xFF, (c >> 24) & 0xFF);

        if (entry.payloadLayout === 'inline') {
            const slot = [0, 0, 0, 0];
            for (let i = 0; i < Math.min(4, entry.payload.length); i++) {
                slot[i] = entry.payload[i] & 0xFF;
            }
            buffer.push(...slot);
        } else {
            const off = entry.payload[0];
            buffer.push(off & 0xFF, (off >> 8) & 0xFF, (off >> 16) & 0xFF, (off >> 24) & 0xFF);
        }
    }

    // Next IFD offset = 0
    buffer.push(0, 0, 0, 0);

    // Pad to base, then place extras
    while (buffer.length < baseAfterIfd) {
        buffer.push(0);
    }

    for (const { offset, bytes } of extra) {
        while (buffer.length < offset) {
            buffer.push(0);
        }
        for (const b of bytes) {
            buffer.push(b);
        }
    }

    return new Uint8Array(buffer);
};

describe('util: parseTiff', () => {
    it('should reject non-TIFF buffers', () => {
        expect(parseTiff(new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7]))).toBeNull();
        expect(parseTiff(new Uint8Array([0x49, 0x49, 0x00, 0x00]))).toBeNull();
    });

    it('should parse a single SHORT inline value', () => {
        const tiff = buildTiff([{
            tag: 0x0100, type: 3, count: 1,
            payload: [100, 0], payloadLayout: 'inline',
        }]);

        const doc = parseTiff(tiff);
        expect(doc).not.toBeNull();
        expect(doc?.littleEndian).toBe(true);
        expect(doc?.ifds.length).toBe(1);
        expect(readFirst(doc!.ifds[0], 0x0100, -1)).toBe(100);
    });

    it('should parse an out-of-line LONG array', () => {
        // 4 LONGs = 16 bytes, placed at offset 64 in the file.
        const tiff = buildTiff(
            [{
                tag: 0xC61D, type: 4, count: 4,
                payload: [64], payloadLayout: 'offset',
            }],
            [{
                offset: 64,
                bytes: [
                    0x01, 0x00, 0x00, 0x00, // 1
                    0x02, 0x00, 0x00, 0x00, // 2
                    0x03, 0x00, 0x00, 0x00, // 3
                    0x04, 0x00, 0x00, 0x00, // 4
                ],
            }],
        );

        const doc = parseTiff(tiff);
        expect(readAll(doc!.ifds[0], 0xC61D)).toEqual([1, 2, 3, 4]);
    });

    it('should parse RATIONAL (AsShotNeutral-shaped)', () => {
        // 3 RATIONALs at offset 64; 472/1000 = 0.472 etc.
        const tiff = buildTiff(
            [{
                tag: 0xC628, type: 5, count: 3,
                payload: [64], payloadLayout: 'offset',
            }],
            [{
                offset: 64,
                bytes: [
                    0x01, 0x00, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00, // 1/2
                    0x01, 0x00, 0x00, 0x00, 0x04, 0x00, 0x00, 0x00, // 1/4
                    0x01, 0x00, 0x00, 0x00, 0x08, 0x00, 0x00, 0x00, // 1/8
                ],
            }],
        );

        const doc = parseTiff(tiff);
        const values = readAll(doc!.ifds[0], 0xC628);
        expect(values).toEqual([0.5, 0.25, 0.125]);
    });

    it('should ignore unknown field types without throwing', () => {
        const tiff = buildTiff([{
            tag: 0x1234, type: 99, count: 1,
            payload: [42, 0], payloadLayout: 'inline',
        }]);

        const doc = parseTiff(tiff);
        expect(doc).not.toBeNull();
        // Unknown types are dropped silently.
        expect(doc!.ifds[0].fields.has(0x1234)).toBe(false);
    });

    it('should parse multiple SHORTs inline (BitsPerSample = [14])', () => {
        const tiff = buildTiff([{
            tag: 0x0102, type: 3, count: 1,
            payload: [14, 0], payloadLayout: 'inline',
        }]);

        const doc = parseTiff(tiff);
        expect(readFirst(doc!.ifds[0], 0x0102, 0)).toBe(14);
    });

    it('should follow SubIFDs', () => {
        // SubIFD chain: main IFD points to one sub-IFD at offset 200.
        // The sub-IFD has ImageWidth = 500.
        const subIfdOffset = 200;
        const tiff = buildTiff(
            [{
                tag: 0x014A, type: 4, count: 1,
                payload: [subIfdOffset], payloadLayout: 'inline',
            }],
            [{
                offset: subIfdOffset,
                bytes: [
                    // entry count 1
                    0x01, 0x00,
                    // tag 0x0100 (ImageWidth), type 3 (SHORT), count 1, value 500 inline
                    0x00, 0x01, 0x03, 0x00, 0x01, 0x00, 0x00, 0x00, 0xF4, 0x01, 0x00, 0x00,
                    // next IFD 0
                    0x00, 0x00, 0x00, 0x00,
                ],
            }],
        );

        const doc = parseTiff(tiff);
        expect(doc!.ifds.length).toBe(2);
        expect(readFirst(doc!.ifds[1], 0x0100, -1)).toBe(500);
    });

    it('should expose big-endian (MM) TIFFs', () => {
        const buffer: number[] = [];
        // Header: MM, 42 BE, offset 8 BE
        buffer.push(0x4D, 0x4D, 0x00, 0x2A, 0x00, 0x00, 0x00, 0x08);
        // IFD count = 1 (BE)
        buffer.push(0x00, 0x01);
        // entry: tag 0x0100, type 3, count 1, value 100 BE
        buffer.push(0x01, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x01, 0x00, 0x64, 0x00, 0x00);
        // next IFD 0
        buffer.push(0x00, 0x00, 0x00, 0x00);

        const doc = parseTiff(new Uint8Array(buffer));
        expect(doc?.littleEndian).toBe(false);
        expect(readFirst(doc!.ifds[0], 0x0100, -1)).toBe(100);
    });
});
