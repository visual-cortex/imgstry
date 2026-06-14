/* eslint-disable sonarjs/cognitive-complexity */
import { describe, expect, it } from 'vitest';
import { decodeLjpeg } from '~/utils/raw/decodeLjpeg';

/**
 * Minimal LJPEG encoder used to round-trip the decoder. Uses a fixed
 * Huffman table where every magnitude category 0..16 maps to a 5-bit
 * code, and predictor 1.
 * @param samples interleaved samples (height * width * 1)
 * @param width frame width
 * @param height frame height
 * @param precision bit depth (8-16)
 * @returns encoded LJPEG bytes including SOI / EOI
 */
const encodeLjpeg = (
    samples: Uint16Array,
    width: number,
    height: number,
    precision: number,
): Uint8Array => {
    const out: number[] = [];

    // SOI
    out.push(0xFF, 0xD8);

    // SOF3 (single component)
    out.push(0xFF, 0xC3);
    out.push(0x00, 0x0B);
    out.push(precision);
    out.push((height >> 8) & 0xFF, height & 0xFF);
    out.push((width >> 8) & 0xFF, width & 0xFF);
    out.push(0x01);             // Nf
    out.push(0x01, 0x11, 0x00); // Ci, Hi/Vi, Tq

    // DHT (Tc=0 Th=0, lengths: 17 codes of length 5)
    out.push(0xFF, 0xC4);
    out.push(0x00, 0x24);
    out.push(0x00);
    const counts = new Uint8Array(16);
    counts[4] = 17;
    for (const c of counts) {
        out.push(c);
    }
    for (let v = 0; v <= 16; v++) {
        out.push(v);
    }

    // SOS
    out.push(0xFF, 0xDA);
    out.push(0x00, 0x08);
    out.push(0x01);
    out.push(0x01, 0x00);
    out.push(0x01); // predictor
    out.push(0x00);
    out.push(0x00);

    let bitBuf = 0;
    let bitCnt = 0;
    const writeBits = (value: number, n: number): void => {
        for (let i = n - 1; i >= 0; i--) {
            bitBuf = (bitBuf << 1) | ((value >> i) & 1);
            bitCnt++;
            if (bitCnt === 8) {
                const byte = bitBuf & 0xFF;
                out.push(byte);
                if (byte === 0xFF) {
                    out.push(0x00);
                }
                bitBuf = 0;
                bitCnt = 0;
            }
        }
    };

    const initialValue = 1 << (precision - 1);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const sample = samples[y * width + x];

            let pred: number;
            if (x === 0 && y === 0) {
                pred = initialValue;
            } else if (x === 0) {
                pred = samples[(y - 1) * width];
            } else {
                pred = samples[y * width + (x - 1)];
            }

            const diff = sample - pred;
            const mag = diff < 0 ? -diff : diff;
            let ssss = 0;
            let m = mag;
            while (m > 0) {
                ssss++; m >>= 1;
            }

            // 5-bit category code (canonical: ssss itself encoded as
            // length-5 binary, 0 → 00000, 16 → 10000).
            writeBits(ssss, 5);

            if (ssss > 0) {
                const v = diff < 0 ? diff - 1 + (1 << ssss) : diff;
                writeBits(v, ssss);
            }
        }
    }

    if (bitCnt > 0) {
        const remain = 8 - bitCnt;
        bitBuf = (bitBuf << remain) | ((1 << remain) - 1);
        const byte = bitBuf & 0xFF;
        out.push(byte);
        if (byte === 0xFF) {
            out.push(0x00);
        }
    }

    out.push(0xFF, 0xD9);
    return new Uint8Array(out);
};

describe('util: decodeLjpeg', () => {
    it('should round-trip a 4x4 constant image', () => {
        const width = 4;
        const height = 4;
        const samples = new Uint16Array(width * height).fill(8000);

        const encoded = encodeLjpeg(samples, width, height, 14);
        const decoded = decodeLjpeg(encoded, 0, encoded.length);

        expect(decoded.width).toBe(width);
        expect(decoded.height).toBe(height);
        expect(decoded.precision).toBe(14);
        expect(decoded.components).toBe(1);
        expect(Array.from(decoded.samples)).toEqual(Array.from(samples));
    });

    it('should round-trip a gradient at 14-bit precision', () => {
        const width = 8;
        const height = 6;
        const samples = new Uint16Array(width * height);
        for (let i = 0; i < samples.length; i++) {
            samples[i] = (i * 137) & 0x3FFF;
        }

        const encoded = encodeLjpeg(samples, width, height, 14);
        const decoded = decodeLjpeg(encoded, 0, encoded.length);

        expect(Array.from(decoded.samples)).toEqual(Array.from(samples));
    });

    it('should round-trip values that cross many predictor categories', () => {
        const width = 16;
        const height = 12;
        const samples = new Uint16Array(width * height);
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                // Force big swings (high category) and tight runs (low)
                samples[y * width + x] = (((x ^ y) * 73 + y * 991) & 0xFFF) | (y % 3 === 0 ? 0x1000 : 0);
            }
        }

        const encoded = encodeLjpeg(samples, width, height, 14);
        const decoded = decodeLjpeg(encoded, 0, encoded.length);

        expect(Array.from(decoded.samples)).toEqual(Array.from(samples));
    });

    it('should round-trip 12-bit data', () => {
        const width = 4;
        const height = 4;
        const samples = new Uint16Array([
            0,    100,  500, 4000,
            150,  300,  600, 3500,
            200,  350,  650, 3600,
            210,  360,  660, 3610,
        ]);

        const encoded = encodeLjpeg(samples, width, height, 12);
        const decoded = decodeLjpeg(encoded, 0, encoded.length);

        expect(Array.from(decoded.samples)).toEqual(Array.from(samples));
        expect(decoded.precision).toBe(12);
    });

    it('should round-trip data containing 0xFF byte-stuffing triggers', () => {
        // Choose values whose entropy-coded representation is statistically
        // likely to produce an 0xFF byte that needs to be stuffed with 0x00.
        const width = 32;
        const height = 32;
        const samples = new Uint16Array(width * height);
        for (let i = 0; i < samples.length; i++) {
            samples[i] = (i * 1117 + 17) & 0x3FFF;
        }

        const encoded = encodeLjpeg(samples, width, height, 14);
        const decoded = decodeLjpeg(encoded, 0, encoded.length);

        expect(Array.from(decoded.samples)).toEqual(Array.from(samples));
    });

    it('should reject a stream that does not start with SOI', () => {
        const bad = new Uint8Array([0xFF, 0xC3, 0x00, 0x0B]);
        expect(() => decodeLjpeg(bad, 0, bad.length)).toThrow(/SOI/);
    });
});
