import { Operation } from '~/core';
import { Kernel } from '~/kernel';

/**
 * Holds a collection of operation method names.
 */
export type OperationMethod = keyof typeof Operation | 'convolve';

/**
 * Defines possible operation values.
 */
export type OperationValue = number | string | [number, number, number] | Kernel | number[][] | null;

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
