import { OperationOption } from '~/core';

/**
 * Internal web worker data definition.
 * @ignore
 */
export interface IWorkerData extends IWorkerResult {
    operations: OperationOption[]
}

/**
 * Internal web worker result definition.
 * @ignore
 */
export interface IWorkerResult {
    buffer: ArrayBuffer
    width: number
    height: number
    guid: string
}
