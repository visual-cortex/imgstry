/* eslint-disable sonarjs/cognitive-complexity */
const FF = 0xFF;
const SOI = 0xD8;
const EOI = 0xD9;
const SOS = 0xDA;

// APPn (E0-EF) or DQT (DB) right after FFD8 is the signature of a real
// preview JPEG. Filters out FFD8 byte pairs that occur inside compressed
// sensor data or random metadata blobs.
const isPreviewLeadMarker = (byte: number): boolean =>
    (byte >= 0xE0 && byte <= 0xEF) || byte === 0xDB;

const isRestartMarker = (byte: number): boolean =>
    byte >= 0xD0 && byte <= 0xD7;

/**
 * Scans the entropy-coded segment that follows a Start-Of-Scan marker. Any
 * FFxx where xx is non-zero and not a restart marker terminates the scan.
 * @param data the buffer being parsed
 * @param start position right after the SOS segment header
 * @returns position of the next marker's leading FF byte
 */
const skipEntropySegment = (data: Uint8Array, start: number): number => {
    const length = data.length;
    let i = start;

    while (i < length - 1) {
        if (data[i] === FF) {
            const next = data[i + 1];
            if (next !== 0x00 && !isRestartMarker(next)) {
                return i;
            }
        }
        i++;
    }

    return i;
};

/**
 * Walks JPEG markers from the byte right after FFD8 until it finds an
 * FFD9 (EOI). Returns the position right after the EOI, or -1 if the
 * marker chain is malformed.
 * @param data the buffer being parsed
 * @param start the byte position right after FFD8
 * @returns position right after the EOI, or -1 on malformed input
 */
const walkToEoi = (data: Uint8Array, start: number): number => {
    const length = data.length;
    let i = start;

    while (i < length - 1) {
        if (data[i] !== FF) {
            return -1;
        }

        // Spec allows fill bytes (0xFF) before a marker.
        while (i < length && data[i] === FF) {
            i++;
        }

        if (i >= length) {
            return -1;
        }

        const marker = data[i++];

        if (marker === EOI) {
            return i;
        }

        if (marker === 0x00 || isRestartMarker(marker)) {
            continue;
        }

        if (marker === SOS) {
            i = skipEntropySegment(data, i);
            continue;
        }

        if (i + 1 >= length) {
            return -1;
        }

        // Variable-length segment: 2 big-endian bytes including the length
        // bytes themselves.
        const segmentLength = (data[i] << 8) | data[i + 1];
        if (segmentLength < 2) {
            return -1;
        }
        i += segmentLength;
    }

    return -1;
};

/**
 * Scans a byte buffer (the body of a TIFF-based RAW file or any container
 * with an embedded JPEG) and returns the largest complete JPEG preview as
 * its own ArrayBuffer. Returns `null` when no full JPEG range is found.
 *
 * Works across CR2, NEF, ARW, DNG, ORF, RW2, PEF and RAF. CR3 / HEIF-based
 * formats are not parsed; callers that need their sensor data require a
 * dedicated decoder.
 * @param source the RAW file's bytes (or any buffer to scan)
 * @returns the largest embedded JPEG as its own ArrayBuffer, or null
 */
export const extractEmbeddedJpeg = (
    source: ArrayBuffer | ArrayBufferView,
): ArrayBuffer | null => {
    const view = source instanceof ArrayBuffer ?
        new Uint8Array(source) :
        new Uint8Array(source.buffer, source.byteOffset, source.byteLength);

    const length = view.length;
    if (length < 8) {
        return null;
    }

    let bestStart = -1;
    let bestEnd = -1;
    let bestSize = 0;

    const lastCandidate = length - 4;

    for (let i = 0; i <= lastCandidate; i++) {
        if (view[i] !== FF || view[i + 1] !== SOI) {
            continue;
        }
        if (view[i + 2] !== FF || !isPreviewLeadMarker(view[i + 3])) {
            continue;
        }

        const end = walkToEoi(view, i + 2);
        if (end < 0) {
            continue;
        }

        const size = end - i;
        if (size > bestSize) {
            bestSize = size;
            bestStart = i;
            bestEnd = end;
        }

        // Skip past this JPEG so we don't re-scan its inner bytes.
        // eslint-disable-next-line sonarjs/updated-loop-counter
        i = end - 1;
    }

    if (bestStart < 0) {
        return null;
    }

    return view.slice(bestStart, bestEnd).buffer;
};
