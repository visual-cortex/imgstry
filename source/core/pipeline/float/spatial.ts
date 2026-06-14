/* eslint-disable sonarjs/cognitive-complexity */
import { Kernel } from '~/kernel';

export interface VignetteOptions {
    amount: number
    midpoint?: number
    roundness?: number
    feather?: number
}

/**
 * Radial vignette darken/lighten in float space.
 * @param data RGBA float buffer
 * @param width image width
 * @param height image height
 * @param options vignette parameters
 */
// Match the u8 op's roundness guard so the negative boundary doesn't
// produce a 1/0 ellipse aspect.
const ROUNDNESS_CLAMP = 99.999;

export const applyVignette = (
    data: Float32Array,
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
    const aspect = roundness >= 0 ? 1 - roundness / 100 : 1 / (1 + roundness / 100);
    const transition = feather * radius;
    const inner = radius;
    const outer = radius + transition;

    for (let y = 0; y < height; y++) {
        const dy = y - cy;
        const dyScaled = dy * aspect;
        for (let x = 0; x < width; x++) {
            const dx = x - cx;
            const distance = Math.sqrt(dx * dx + dyScaled * dyScaled);
            let weight = 0;
            if (transition === 0) {
                weight = distance >= inner ? 1 : 0;
            } else if (distance > outer) {
                weight = 1;
            } else if (distance > inner) {
                const t = (distance - inner) / transition;
                weight = t * t * (3 - 2 * t);
            }
            const factor = 1 + amount * weight;
            const offset = (y * width + x) * 4;
            data[offset]     *= factor;
            data[offset + 1] *= factor;
            data[offset + 2] *= factor;
        }
    }
};

import { luma709 as luminance } from '~/utils/color';

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

const ensure = (current: Float32Array, length: number): Float32Array =>
    current.length >= length ? current : new Float32Array(length);

/**
 * Clarity: luminance unsharp mask in float space (separable box blur).
 * @param data RGBA float buffer
 * @param width image width
 * @param height image height
 * @param amount clarity, [-100, 100]
 * @param radius blur radius in pixels
 */
export const applyClarity = (
    data: Float32Array,
    width: number,
    height: number,
    amount: number,
    radius = 8,
): void => {
    const strength = amount / 100;
    const pixels = width * height;

    scratch.luma       = ensure(scratch.luma, pixels);
    scratch.horizontal = ensure(scratch.horizontal, pixels);
    scratch.blur       = ensure(scratch.blur, pixels);
    const { luma, horizontal, blur } = scratch;

    for (let i = 0, p = 0; i < data.length; i += 4, p++) {
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

    for (let i = 0, p = 0; i < data.length; i += 4, p++) {
        const diff = luma[p] - blur[p];
        const boost = diff * strength;
        data[i]     += boost;
        data[i + 1] += boost;
        data[i + 2] += boost;
    }
};

/**
 * 2D convolution in float space. Allocates a parallel destination
 * buffer; alpha is copied through unchanged.
 * @param source source RGBA float buffer
 * @param width image width
 * @param height image height
 * @param kernel convolution kernel
 * @param factor output gain multiplier
 * @returns the new RGBA float buffer
 */
export const applyConvolve = (
    source: Float32Array,
    width: number,
    height: number,
    kernel: Kernel | number[][],
    factor = 1,
): Float32Array => {
    const normalized = kernel instanceof Kernel ? kernel : new Kernel(kernel);
    const out = new Float32Array(source.length);
    const kernelWidth = normalized.width;
    const kernelHeight = normalized.height;
    const halfX = kernelWidth >> 1;
    const halfY = kernelHeight >> 1;
    const weights = normalized.flatten();
    const maxIndex = source.length - 4;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const offset = (y * width + x) * 4;
            let r = 0, g = 0, b = 0;
            for (let ky = 0; ky < kernelHeight; ky++) {
                const sampleY = y + ky - halfY;
                const rowOffset = sampleY * width;
                for (let kx = 0; kx < kernelWidth; kx++) {
                    const weight = weights[ky * kernelWidth + kx];
                    const sample = (rowOffset + x + kx - halfX) * 4;
                    const index = sample < 0 ? 0 : sample > maxIndex ? maxIndex : sample;
                    r += source[index]     * weight;
                    g += source[index + 1] * weight;
                    b += source[index + 2] * weight;
                }
            }
            out[offset]     = r * factor;
            out[offset + 1] = g * factor;
            out[offset + 2] = b * factor;
            out[offset + 3] = source[offset + 3];
        }
    }

    return out;
};
