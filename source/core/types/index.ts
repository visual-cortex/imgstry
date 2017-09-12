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
  filter: string;
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
 * Imgstry processor message defintion
 *
 * @export
 * @interface ImgstryProcessorData
 */
export interface ImgstryProcessorData {
  /**
   * Image data object
   *
   * @type {ImageData}
   * @memberOf ImgstryProcessorData
   */
  image: ImageData;
  /**
   * List of filter that need to be applied
   *
   * @type {FilterOption[]}
   * @memberOf ImgstryProcessorData
   */
  options: FilterOption[];
  /**
   * Width of the processed image
   *
   * @type {number}
   * @memberOf ImgstryProcessorData
   */
  width: number;
  /**
   * Height of the processed image
   *
   * @type {number}
   * @memberOf ImgstryProcessorData
   */
  height: number;
  /**
   * Process id
   *
   * @type {string}
   * @memberOf ImgstryProcessorData
   */
  identifier?: string;
}

/**
 * Histogram data arrays
 *
 * @export
 * @interface HistogramData
 */
export interface HistogramData {
  all: number[];
  channels: {
    red: number[],
    green: number[],
    blue: number[],
  };
}
