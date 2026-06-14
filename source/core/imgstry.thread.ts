import { OperationOption } from '~/core/types';

/**
 * Thread execution data (u8 pipeline).
 */
export interface IThreadData extends IThreadResult {
    operations: OperationOption[]
}

/**
 * Thread result data (u8 pipeline).
 */
export interface IThreadResult {
    imageData: ImageData
    guid?: string
}

/**
 * Thread execution data for the float pipeline.
 */
export interface IFloatThreadData extends IFloatThreadResult {
    operations: OperationOption[]
}

/**
 * Thread result data for the float pipeline.
 */
export interface IFloatThreadResult {
    buffer: Float32Array
    width: number
    height: number
    guid?: string
}

/**
 * Defines the imgstry thread schema.
 */
export interface IImgstryThread {
    /**
     * Starts a worker thread and processes the operations against an
     * 8-bit ImageData buffer.
     * @param options the data + operations
     * @param options.imageData the image data to be processed
     * @param options.operations the operations to be executed
     * @returns the processed image data, or undefined when the worker is gone
     */
    run({
        imageData,
        operations,
    }: IThreadData): Promise<IThreadResult | undefined>

    /**
     * Starts a worker thread and processes the operations against a
     * Float32 RGBA buffer.
     * @param options the float buffer + operations
     * @param options.buffer the Float32 RGBA buffer
     * @param options.width image width
     * @param options.height image height
     * @param options.operations the operations to be executed
     * @returns the processed float buffer, or undefined when the worker is gone
     */
    runFloat({
        buffer,
        width,
        height,
        operations,
    }: IFloatThreadData): Promise<IFloatThreadResult | undefined>
}
