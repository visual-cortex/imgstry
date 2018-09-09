import { Kernel } from '../../kernel';
import { Operation } from '../imgstry.operation';
import { Rgb } from '../../pixel';

/**
 * Holds a collection of operation method names.
 *
 * @type OperationMethod
 */
export type OperationMethod = keyof typeof Operation | 'convolve';

/**
 * Defines possible operation values.
 */
export type OperationValue = number | string | [number, number, number] | Kernel | number[][];

/**
 * Imgstry filter option defintion
 *
 * @interface FilterOption
 */
export interface OperationOption {
  /**
   * Applied filter method
   *
   * @type {string}
   * @memberOf FilterOption
   */
  name: OperationMethod;
  /**
   * Applied filter value
   *
   * @type {(number | string)}
   * @memberOf FilterOption
   */
  value: OperationValue;


  /**
   * Evalution priority
   *
   * @type {number}
   * @memberOf FilterOption
   */
  priority: number;
}

/**
 * Histogram data arrays.
 *
 * @export
 * @interface HistogramData
 */
export interface HistogramData {
  /**
   * Global channel distribution
   *
   * @type {number[]}
   * @memberof HistogramData
   */
  all: number[];
  /**
   * Color distribution per channel.
   *
   * @type {{
   *     red: number[],
   *     green: number[],
   *     blue: number[],
   *   }}
   * @memberof HistogramData
   */
  channel: {
    red: number[],
    green: number[],
    blue: number[],
  };
}

/**
 * Defines the traverse information passed to the delegate.
 *
 * @interface TraversalPixelInfo
 */
export interface TraversalPixelInfo {
  /**
   * Holds the pixel position information.
   *
   * @type {{
   *     x: number;
   *     y: number;
   *     offset: number;
   *   }}
   * @memberof TraversalPixelInfo
   */
  position: {
    x: number;
    y: number;
    offset: number;
  };
  /**
   * Total number of pixels in the image.
   *
   * @type {number}
   * @memberof TraversalPixelInfo
   */
  total: number;
}
