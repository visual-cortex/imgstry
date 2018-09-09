import { Operation } from '../imgstry.operation';

/**
 * Holds a collection of operation method names
 *
 * @type OperationMethod
 */
export type OperationMethod = keyof typeof Operation | 'convolve';

/**
 * Imgstry filter option defintion
 *
 * @interface FilterOption
 */
export interface FilterOption {
  /**
   * Applied filter method
   *
   * @type {string}
   * @memberOf FilterOption
   */
  filter: OperationMethod;
  /**
   * Applied filter value
   *
   * @type {(number | string)}
   * @memberOf FilterOption
   */
  value: number | string | Array<any>;


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
