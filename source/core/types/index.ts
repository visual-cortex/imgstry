import { Operation } from '~/core';
import type {
    ChannelMixerMatrix,
    SplitToneOptions,
} from '~/core/pipeline/pixel';
import type { VignetteOptions } from '~/core/pipeline/spatial';
import { Kernel } from '~/kernel';

/**
 * Names of operations available through the pipeline runner.
 */
export type PipelineOperationName =
    | 'exposure'
    | 'temperature'
    | 'tintShift'
    | 'shadows'
    | 'highlights'
    | 'whites'
    | 'blacks'
    | 'levels'
    | 'curve'
    | 'clarity'
    | 'vignette'
    | 'channelMixer'
    | 'splitTone';

/**
 * Holds a collection of operation method names.
 */
export type OperationMethod = keyof typeof Operation | 'convolve' | PipelineOperationName;

/**
 * Convolution kernel inputs accepted by the pipeline.
 */
export type KernelLike = Kernel | number[][];

/**
 * Tone-curve mapping (per channel or shared).
 */
export interface CurveMapping {
    r?: number[]
    g?: number[]
    b?: number[]
    rgb?: number[]
}

/**
 * Image-levels remap options.
 */
export interface LevelsOptions {
    inLow?: number
    inHigh?: number
    gamma?: number
    outLow?: number
    outHigh?: number
}

/**
 * The complete set of value shapes an operation can carry. Each shape is
 * typed against the op-name it belongs to elsewhere; this union exists for
 * the storage layer (history, serialisation) which is op-agnostic.
 */
export type OperationValue =
    | number
    | string
    | [number, number, number]
    | KernelLike
    | CurveMapping
    | LevelsOptions
    | VignetteOptions
    | ChannelMixerMatrix
    | SplitToneOptions
    | null;

/**
 * Imgstry filter option defintion
 */
export interface OperationOption {
    /**
     * Applied filter method
     */
    name: OperationMethod
    /**
     * Applied filter value
     */
    value: OperationValue


    /**
     * Evalution priority
     */
    priority: number
}

/**
 * Histogram data arrays.
 */
export interface HistogramData {
    /**
     * Global channel distribution
     */
    all: number[]
    /**
     * Color distribution per channel.
     */
    channel: {
        red: number[]
        green: number[]
        blue: number[]
    }
}

/**
 * Defines the traverse information passed to the delegate.
 */
export interface TraversalPixelInfo {
    /**
     * Holds the pixel position information.
     */
    position: {
        x: number
        y: number
        offset: number
    }
    /**
     * Total number of pixels in the image.
     */
    total: number
}

export type RenderTarget = 'current' | 'original';
