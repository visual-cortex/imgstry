import { OperationOption } from '~core';

/**
 * Internal web worker data definition.
 *
 * @export
 * @interface IWorkerData
 * @extends {IWorkerResult}
 * @ignore
 */
export interface IWorkerData extends IWorkerResult {
  operations: OperationOption[];
}

/**
 * Internal web worker result definition.
 *
 * @export
 * @interface IWorkerResult
 * @ignore
 */
export interface IWorkerResult {
  buffer: ArrayBuffer;
  width: number;
  height: number;
  guid: string;
}
