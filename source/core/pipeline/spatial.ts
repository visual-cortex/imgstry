/* eslint-disable sonarjs/cognitive-complexity */
import { Kernel } from '~/kernel';

const clampU8 = (value: number): number =>
    value <= 0 ? 0 : value >= 255 ? 255 : (value + .5) | 0;

export const applyConvolve = (
    source: ImageData,
    target: ImageData,
    kernel: Kernel | number[][],
    factor = 1,
): ImageData => {
    const normalized = kernel instanceof Kernel ? kernel : new Kernel(kernel);

    const data = source.data;
    const output = target.data;
    const width = source.width;
    const height = source.height;
    const kernelWidth = normalized.width;
    const kernelHeight = normalized.height;
    const halfX = kernelWidth >> 1;
    const halfY = kernelHeight >> 1;
    const weights = normalized.flatten();
    const maxIndex = data.length - 4;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const offset = (y * width + x) * 4;
            let r = 0;
            let g = 0;
            let b = 0;

            for (let ky = 0; ky < kernelHeight; ky++) {
                const sampleY = y + ky - halfY;
                const rowOffset = sampleY * width;
                for (let kx = 0; kx < kernelWidth; kx++) {
                    const weight = weights[ky * kernelWidth + kx];
                    const sample = (rowOffset + x + kx - halfX) * 4;
                    const index = sample < 0 ? 0 : sample > maxIndex ? maxIndex : sample;

                    r += data[index] * weight;
                    g += data[index + 1] * weight;
                    b += data[index + 2] * weight;
                }
            }

            // Convolution math: factor is the per-output gain, applied to
            // the raw weighted sum (NOT to a pre-clamped value). The u8
            // store still clamps at write time.
            output[offset]     = clampU8(factor * r);
            output[offset + 1] = clampU8(factor * g);
            output[offset + 2] = clampU8(factor * b);
            output[offset + 3] = data[offset + 3];
        }
    }

    return target;
};

export interface VignetteOptions {
    amount: number
    midpoint?: number
    roundness?: number
    feather?: number
}

// roundness reaches -100 in the published API, but the historical
// formula `1 / (1 + roundness / 100)` divides by zero there. Cap the
// magnitude just inside ±100 so the ellipse degeneration stays
// well-defined.
const ROUNDNESS_CLAMP = 99.999;

export const applyVignette = (
    data: Uint8ClampedArray,
    width: number,
    height: number,
    options: VignetteOptions,
): void => {
    const amount = options.amount / 100;
    const midpoint = options.midpoint ?? 50;
    const roundness = Math.max(-ROUNDNESS_CLAMP, Math.min(ROUNDNESS_CLAMP, options.roundness ?? 0));
    const feather = (options.feather ?? 50) / 100;

    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(width, height) * (midpoint / 100) * .75;
    const aspect = roundness >= 0 ?
        1 - roundness / 100 :
        1 / (1 + roundness / 100);

    const transition = feather * radius;
    const innerRadius = radius;
    const outerRadius = radius + transition;

    for (let y = 0; y < height; y++) {
        const dy = (y - cy);
        const dyScaled = dy * aspect;

        for (let x = 0; x < width; x++) {
            const dx = x - cx;
            const distance = Math.sqrt(dx * dx + dyScaled * dyScaled);

            let weight = 0;
            if (transition === 0) {
                // Sharp cutoff (feather = 0). Inside the radius: weight 0;
                // outside: weight 1.
                weight = distance >= innerRadius ? 1 : 0;
            } else if (distance > outerRadius) {
                weight = 1;
            } else if (distance > innerRadius) {
                const t = (distance - innerRadius) / transition;
                weight = t * t * (3 - 2 * t);
            }

            const factor = 1 + amount * weight;
            const offset = (y * width + x) * 4;

            data[offset]     = clampU8(data[offset] * factor);
            data[offset + 1] = clampU8(data[offset + 1] * factor);
            data[offset + 2] = clampU8(data[offset + 2] * factor);
        }
    }
};

// Centralised Rec. 709 luma; the u8 op uses the same coefficients as
// the float pipeline so the two paths report identical luminance.
import { luma709 as luminance } from '~/utils/color';

// Reusable Float32 scratchpads. Each clarity call needs three buffers of
// (width * height) floats; with a 24MP image that's ~280MB of allocations
// per call before GC, which murders interactive use. Growing on demand and
// reusing across calls keeps steady-state allocation flat.
interface ScratchBuffers {
    luma: Float32Array
    horizontal: Float32Array
    blur: Float32Array
}

const scratch: ScratchBuffers = {
    luma:       new Float32Array(0),
    horizontal: new Float32Array(0),
    blur:       new Float32Array(0),
};

const ensureFloat32 = (current: Float32Array, length: number): Float32Array =>
    current.length >= length ? current : new Float32Array(length);

export const applyClarity = (
    data: Uint8ClampedArray,
    width: number,
    height: number,
    amount: number,
    radius = 8,
): void => {
    const strength = amount / 100;
    const length = data.length;
    const pixels = length / 4;

    scratch.luma       = ensureFloat32(scratch.luma, pixels);
    scratch.horizontal = ensureFloat32(scratch.horizontal, pixels);
    scratch.blur       = ensureFloat32(scratch.blur, pixels);
    const { luma, horizontal, blur } = scratch;

    // box-blur the luminance channel (separable, two passes)
    for (let i = 0, p = 0; i < length; i += 4, p++) {
        luma[p] = luminance(data[i], data[i + 1], data[i + 2]);
    }

    const window = radius * 2 + 1;

    for (let y = 0; y < height; y++) {
        let sum = 0;
        for (let x = -radius; x <= radius; x++) {
            const sx = x < 0 ? 0 : x >= width ? width - 1 : x;
            sum += luma[y * width + sx];
        }
        for (let x = 0; x < width; x++) {
            horizontal[y * width + x] = sum / window;
            const dropX = x - radius;
            const addX = x + radius + 1;
            const dropIdx = dropX < 0 ? 0 : dropX;
            const addIdx = addX >= width ? width - 1 : addX;
            sum += luma[y * width + addIdx] - luma[y * width + dropIdx];
        }
    }

    for (let x = 0; x < width; x++) {
        let sum = 0;
        for (let y = -radius; y <= radius; y++) {
            const sy = y < 0 ? 0 : y >= height ? height - 1 : y;
            sum += horizontal[sy * width + x];
        }
        for (let y = 0; y < height; y++) {
            blur[y * width + x] = sum / window;
            const dropY = y - radius;
            const addY = y + radius + 1;
            const dropIdx = dropY < 0 ? 0 : dropY;
            const addIdx = addY >= height ? height - 1 : addY;
            sum += horizontal[addIdx * width + x] - horizontal[dropIdx * width + x];
        }
    }

    for (let i = 0, p = 0; i < length; i += 4, p++) {
        const diff = luma[p] - blur[p];
        const boost = diff * strength;

        data[i]     = clampU8(data[i]     + boost);
        data[i + 1] = clampU8(data[i + 1] + boost);
        data[i + 2] = clampU8(data[i + 2] + boost);
    }
};
