import { describe, expect, it } from 'vitest';
import { extractEmbeddedJpeg } from '~/utils/raw';

/**
 * Builds a minimal JPEG: SOI + APP0 segment + optional SOS (compressed
 * payload) + EOI. Length of the APP0 payload tunes the byte size so tests
 * can compare "smaller vs larger" reliably.
 * @param appPayloadLength bytes of dummy payload inside the APP0 segment
 * @param withSos when true, appends a small SOS + entropy segment
 * @returns the synthetic JPEG bytes
 */
const buildJpeg = (
    appPayloadLength: number,
    withSos = false,
): Uint8Array => {
    const segments: number[] = [];

    // SOI
    segments.push(0xFF, 0xD8);

    // APP0: marker + length (BE, includes the two length bytes) + payload
    segments.push(0xFF, 0xE0);
    const segmentLength = appPayloadLength + 2;
    segments.push((segmentLength >> 8) & 0xFF, segmentLength & 0xFF);
    for (let i = 0; i < appPayloadLength; i++) {
        segments.push(i & 0xFF);
    }

    if (withSos) {
        // SOS marker + minimal length (2) + entropy-coded body containing
        // a stuffed FF00 (must not be confused with a real marker).
        segments.push(0xFF, 0xDA, 0x00, 0x02);
        segments.push(0x12, 0x34, 0xFF, 0x00, 0x56, 0x78);
    }

    // EOI
    segments.push(0xFF, 0xD9);

    return new Uint8Array(segments);
};

const concat = (...parts: Uint8Array[]): Uint8Array => {
    const total = parts.reduce((sum, part) => sum + part.length, 0);
    const out = new Uint8Array(total);
    let offset = 0;
    for (const part of parts) {
        out.set(part, offset);
        offset += part.length;
    }
    return out;
};

describe('util: extractEmbeddedJpeg', () => {
    it('should return null for garbage with no SOI marker', () => {
        const garbage = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

        expect(extractEmbeddedJpeg(garbage)).toBeNull();
    });

    it('should return null when buffer is too small to contain a JPEG', () => {
        const tiny = new Uint8Array([0xFF, 0xD8]);

        expect(extractEmbeddedJpeg(tiny)).toBeNull();
    });

    it('should return the JPEG slice when one preview is embedded', () => {
        const jpeg = buildJpeg(16);
        const container = concat(
            new Uint8Array([0x49, 0x49, 0x2A, 0x00, 0x08, 0, 0, 0]),
            jpeg,
            new Uint8Array([0xAA, 0xBB, 0xCC]),
        );

        const extracted = extractEmbeddedJpeg(container);
        expect(extracted).not.toBeNull();
        expect(new Uint8Array(extracted as ArrayBuffer)).toEqual(jpeg);
    });

    it('should return the LARGEST JPEG when several are embedded', () => {
        const small = buildJpeg(8);
        const large = buildJpeg(128);
        const container = concat(
            new Uint8Array([0x4D, 0x4D, 0x00, 0x2A]),
            small,
            new Uint8Array([0xDE, 0xAD, 0xBE, 0xEF]),
            large,
            new Uint8Array([0x00, 0x00]),
        );

        const extracted = extractEmbeddedJpeg(container);
        expect(extracted).not.toBeNull();
        expect(new Uint8Array(extracted as ArrayBuffer)).toEqual(large);
    });

    it('should walk past SOS compressed data correctly', () => {
        const jpeg = buildJpeg(8, true);
        const container = concat(
            new Uint8Array([0x00, 0x01, 0x02]),
            jpeg,
        );

        const extracted = extractEmbeddedJpeg(container);
        expect(extracted).not.toBeNull();
        expect(new Uint8Array(extracted as ArrayBuffer)).toEqual(jpeg);
    });

    it('should ignore FFD8 not followed by APPn or DQT (random sensor noise)', () => {
        const noise = new Uint8Array([
            0xFF, 0xD8, 0xFF, 0x99,         // not a real preview start
            0x00, 0x00, 0x00,
            0xFF, 0xD8, 0xFF, 0x12,         // not a real preview start
            0x34, 0x56,
        ]);

        expect(extractEmbeddedJpeg(noise)).toBeNull();
    });

    it('should accept SOI followed directly by DQT', () => {
        const jpeg = new Uint8Array([
            0xFF, 0xD8,                     // SOI
            0xFF, 0xDB, 0x00, 0x04, 0xAA, 0xBB, // DQT segment of length 4
            0xFF, 0xD9,                     // EOI
        ]);

        const extracted = extractEmbeddedJpeg(jpeg);
        expect(extracted).not.toBeNull();
        expect(new Uint8Array(extracted as ArrayBuffer)).toEqual(jpeg);
    });

    it('should accept an ArrayBuffer input', () => {
        const jpeg = buildJpeg(16);
        const buffer = new ArrayBuffer(jpeg.byteLength);
        new Uint8Array(buffer).set(jpeg);

        const extracted = extractEmbeddedJpeg(buffer);
        expect(extracted).not.toBeNull();
        expect(new Uint8Array(extracted as ArrayBuffer)).toEqual(jpeg);
    });

    it('should reject a truncated JPEG (no EOI)', () => {
        const truncated = new Uint8Array([
            0xFF, 0xD8,
            0xFF, 0xE0, 0x00, 0x06, 0x01, 0x02, 0x03, 0x04,
            // missing EOI
        ]);

        expect(extractEmbeddedJpeg(truncated)).toBeNull();
    });
});
