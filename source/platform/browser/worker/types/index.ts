import { OperationOption } from '~/core';

/**
 * Buffer kind: u8 is canvas-shaped RGBA; float is the engine's
 * Float32 RGBA representation.
 */
export type WorkerBufferKind = 'u8' | 'float';

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
    /** The buffer kind ("u8" = Uint8ClampedArray, "float" = Float32Array). */
    kind?: WorkerBufferKind
    buffer: ArrayBuffer
    width: number
    height: number
    guid: string
}
