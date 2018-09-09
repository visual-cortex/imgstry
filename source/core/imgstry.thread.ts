import { OperationOption } from './types/index';

/**
 * Thread execution data.
 *
 * @export
 * @interface IThreadData
 * @extends {IThreadResult}
 */
export interface IThreadData extends IThreadResult {
  operations: OperationOption[];
}

/**
 * Thread result data.
 *
 * @export
 * @interface IThreadResult
 */
export interface IThreadResult {
  imageData: ImageData;
}

export interface ImgstryThread {
  /**
   * Starts a worker thread and initiates the request operations.
   *
   * @param {IThreadData} {
   *     imageData,
   *     operations,
   *   }
   * @returns {Promise<IThreadResult>}
   * @memberof ImgstryThread
   */
  run({
    imageData,
    operations,
  }: IThreadData): Promise<IThreadResult>;
}
