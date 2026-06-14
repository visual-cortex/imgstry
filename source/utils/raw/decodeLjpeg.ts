/* eslint-disable sonarjs/cognitive-complexity */
// Lossless JPEG (SOF3) decoder per ITU-T T.81 Annex H. Decodes single- or
// multi-component frames using Huffman + predictor 1 (Ra / left, with Rb
// at the start of a line). This is the compression scheme used by
// DNG with Compression=7 and by CR2 / NEF / ARW sensor strips.
//
// Out of scope: predictors 2-7 (rarely used), restart markers, point
// transform (Al > 0), DNG NEF "linearization" mappings.

const MAX_HUFFMAN_LENGTH = 16;
const MAX_PRECISION = 16;

const MARKER_SOI = 0xD8;
const MARKER_EOI = 0xD9;
const MARKER_SOF3 = 0xC3;
const MARKER_DHT = 0xC4;
const MARKER_SOS = 0xDA;

export interface LjpegResult {
    width: number
    height: number
    precision: number
    components: number
    /** Interleaved samples: height * width * components, row-major. */
    samples: Uint16Array
}

interface HuffmanTable {
    /** maxCode[len] = largest code of that length, -1 when absent. */
    maxCode: Int32Array
    /** valPtr[len] = index into values for first code of that length. */
    valPtr: Int32Array
    /** minCode[len] = smallest code of that length. */
    minCode: Int32Array
    values: Uint8Array
}

interface SofComponent {
    id: number
    /** Td (DC table id) is in the SOS header, not here. */
}

interface Sof {
    precision: number
    width: number
    height: number
    components: SofComponent[]
}

interface ScanComponent {
    id: number
    tableId: number
}

class BitReader {
    public buffer = 0;
    public count = 0;
    public done = false;

    public constructor(
        public readonly data: Uint8Array,
        public position: number,
        public readonly end: number,
    ) {}

    public readBit(): number {
        if (this.count === 0) {
            this.fill();
            if (this.done) {
                return 0;
            }
        }
        const bit = (this.buffer >> 7) & 1;
        this.buffer = (this.buffer << 1) & 0xFF;
        this.count--;
        return bit;
    }

    public readBits(n: number): number {
        let value = 0;
        for (let i = 0; i < n; i++) {
            value = (value << 1) | this.readBit();
        }
        return value;
    }

    private fill(): void {
        if (this.position >= this.end) {
            this.done = true;
            return;
        }
        let byte = this.data[this.position++];
        if (byte === 0xFF) {
            if (this.position >= this.end) {
                this.done = true;
                this.position--;
                return;
            }
            const next = this.data[this.position++];
            if (next !== 0x00) {
                // Marker found; rewind so callers can inspect it.
                this.position -= 2;
                this.done = true;
                return;
            }
            byte = 0xFF;
        }
        this.buffer = byte;
        this.count = 8;
    }
}

const buildHuffman = (
    bits: Uint8Array,
    values: Uint8Array,
): HuffmanTable => {
    const minCode = new Int32Array(MAX_HUFFMAN_LENGTH + 1);
    const maxCode = new Int32Array(MAX_HUFFMAN_LENGTH + 1).fill(-1);
    const valPtr = new Int32Array(MAX_HUFFMAN_LENGTH + 1);

    let code = 0;
    let cursor = 0;

    for (let length = 1; length <= MAX_HUFFMAN_LENGTH; length++) {
        const codesAtLength = bits[length];
        if (codesAtLength === 0) {
            code <<= 1;
            continue;
        }
        valPtr[length] = cursor;
        minCode[length] = code;
        code += codesAtLength;
        maxCode[length] = code - 1;
        code <<= 1;
        cursor += codesAtLength;
    }

    return { minCode, maxCode, valPtr, values };
};

const decodeHuffman = (br: BitReader, table: HuffmanTable): number => {
    let code = 0;
    for (let length = 1; length <= MAX_HUFFMAN_LENGTH; length++) {
        code = (code << 1) | br.readBit();
        if (br.done) {
            return 0;
        }
        if (code <= table.maxCode[length]) {
            const index = table.valPtr[length] + (code - table.minCode[length]);
            return table.values[index];
        }
    }
    return 0;
};

/**
 * Sign-extend an unsigned `ssss`-bit value per T.81 F.2.1.5.1.
 * @param value the raw bits read
 * @param ssss the magnitude category
 * @returns the signed difference
 */
const extendSign = (value: number, ssss: number): number => {
    if (ssss === 0) {
        return 0;
    }
    const threshold = 1 << (ssss - 1);
    if (value < threshold) {
        return value + (-1 << ssss) + 1;
    }
    return value;
};

const parseSof3 = (data: Uint8Array, start: number): Sof => {
    let p = start;
    const precision = data[p++];
    const height = (data[p++] << 8) | data[p++];
    const width = (data[p++] << 8) | data[p++];
    const componentCount = data[p++];
    const components: SofComponent[] = [];
    for (let i = 0; i < componentCount; i++) {
        components.push({ id: data[p++] });
        p += 2; // Hi/Vi + Tq (unused for LJPEG)
    }
    return { precision, width, height, components };
};

const parseDht = (
    data: Uint8Array,
    start: number,
    end: number,
    tables: (HuffmanTable | null)[],
): void => {
    let p = start;
    while (p < end) {
        const tableId = data[p++] & 0x0F;
        const bits = new Uint8Array(MAX_HUFFMAN_LENGTH + 1);
        let total = 0;
        for (let i = 1; i <= MAX_HUFFMAN_LENGTH; i++) {
            bits[i] = data[p++];
            total += bits[i];
        }
        const values = new Uint8Array(total);
        for (let i = 0; i < total; i++) {
            values[i] = data[p++];
        }
        tables[tableId] = buildHuffman(bits, values);
    }
};

const parseSos = (
    data: Uint8Array,
    start: number,
): { scan: ScanComponent[]; predictor: number; position: number } => {
    let p = start;
    const ns = data[p++];
    const scan: ScanComponent[] = [];
    for (let i = 0; i < ns; i++) {
        const id = data[p++];
        const tdta = data[p++];
        scan.push({ id, tableId: (tdta >> 4) & 0x0F });
    }
    const predictor = data[p++];
    p += 2; // Se + Ah/Al
    return { scan, predictor, position: p };
};

/**
 * Decodes a lossless JPEG (SOF3) stream and returns its samples.
 *
 * Supports single- and multi-component frames at precisions up to 16
 * bits. Only predictor 1 (Ra with Rb at the start of a line) is
 * implemented, which is what every real-world DNG / CR2 / NEF / ARW
 * encoder produces.
 * @param data the file bytes containing the LJPEG stream
 * @param offset start of the SOI marker
 * @param length length of the LJPEG stream in bytes
 * @returns the decoded samples, dimensions, and precision
 */
export const decodeLjpeg = (
    data: Uint8Array,
    offset: number,
    length: number,
): LjpegResult => {
    const end = offset + length;
    let p = offset;

    if (data[p++] !== 0xFF || data[p++] !== MARKER_SOI) {
        throw new Error('LJPEG: missing SOI marker');
    }

    const header = parseHeaders(data, p, end);
    if (header.predictor !== 1) {
        throw new Error(`LJPEG: predictor ${header.predictor} not supported (only 1)`);
    }
    if (header.sof.precision < 8 || header.sof.precision > MAX_PRECISION) {
        throw new Error(`LJPEG: precision ${header.sof.precision} out of range`);
    }

    const samples = decodeEntropy(data, header.scanStart, end, header.sof, header.scan, header.tables);
    return {
        width: header.sof.width,
        height: header.sof.height,
        precision: header.sof.precision,
        components: header.sof.components.length,
        samples,
    };
};

interface ParsedHeader {
    sof: Sof
    scan: ScanComponent[]
    predictor: number
    tables: (HuffmanTable | null)[]
    scanStart: number
}

/**
 * Walks the marker chain from `start` to the first SOS, collecting SOF3,
 * DHT and the resulting SOS into one bundle.
 * @param data the stream bytes
 * @param start position right after the SOI marker
 * @param end exclusive end of the stream
 * @returns the gathered headers + position of the entropy-coded segment
 */
const parseHeaders = (data: Uint8Array, start: number, end: number): ParsedHeader => {
    let p = start;
    let sof: Sof | null = null;
    const tables: (HuffmanTable | null)[] = [null, null, null, null];

    while (p < end - 1) {
        if (data[p++] !== 0xFF) {
            throw new Error('LJPEG: marker expected');
        }
        while (data[p] === 0xFF) {
            p++;
        }
        const marker = data[p++];
        if (marker === MARKER_EOI) {
            throw new Error('LJPEG: EOI before scan data');
        }

        const segmentLength = (data[p] << 8) | data[p + 1];
        const segmentEnd = p + segmentLength;
        p += 2;

        if (marker === MARKER_SOF3) {
            sof = parseSof3(data, p);
        } else if (marker === MARKER_DHT) {
            parseDht(data, p, segmentEnd, tables);
        } else if (marker === MARKER_SOS) {
            const { scan, predictor, position } = parseSos(data, p);
            if (!sof) {
                throw new Error('LJPEG: SOS before SOF3');
            }
            return { sof, scan, predictor, tables, scanStart: position };
        }

        p = segmentEnd;
    }

    throw new Error('LJPEG: no SOS scan header before stream end');
};

const decodeEntropy = (
    data: Uint8Array,
    start: number,
    end: number,
    sof: Sof,
    scan: ScanComponent[],
    tables: (HuffmanTable | null)[],
): Uint16Array => {
    const componentCount = sof.components.length;
    const total = sof.width * sof.height * componentCount;
    const samples = new Uint16Array(total);
    const initialValue = 1 << (sof.precision - 1);
    const mask = (1 << sof.precision) - 1;
    const br = new BitReader(data, start, end);

    // Resolve a Huffman table per scan component (in scan order).
    const scanTables: HuffmanTable[] = scan.map((entry) => {
        const table = tables[entry.tableId];
        if (!table) {
            throw new Error(`LJPEG: missing Huffman table ${entry.tableId}`);
        }
        return table;
    });

    if (scanTables.length === 0) {
        throw new Error('LJPEG: empty scan');
    }

    // Single-table mode: every component reuses scanTables[0] when SOS
    // omitted per-component overrides (some encoders do this).
    const tableFor = (c: number): HuffmanTable =>
        scanTables[c] ?? scanTables[0];

    for (let y = 0; y < sof.height; y++) {
        for (let x = 0; x < sof.width; x++) {
            for (let c = 0; c < componentCount; c++) {
                const table = tableFor(c);
                const ssss = decodeHuffman(br, table);
                let diff: number;

                if (ssss === 16) {
                    // Magic encoding for diff = 2^15 when precision = 16.
                    diff = 32768;
                } else if (ssss === 0) {
                    diff = 0;
                } else {
                    diff = extendSign(br.readBits(ssss), ssss);
                }

                let pred: number;
                if (x === 0 && y === 0) {
                    pred = initialValue;
                } else if (x === 0) {
                    pred = samples[((y - 1) * sof.width) * componentCount + c];
                } else {
                    pred = samples[(y * sof.width + (x - 1)) * componentCount + c];
                }

                samples[(y * sof.width + x) * componentCount + c] = (pred + diff) & mask;
            }
        }
    }

    return samples;
};
