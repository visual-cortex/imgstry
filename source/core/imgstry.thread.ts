import { OperationOption } from '~/core/types';

/**
 * Thread execution data.
 */
export interface IThreadData extends IThreadResult {
    operations: OperationOption[]
}

/**
 * Thread result data.
 */
export interface IThreadResult {
    imageData: ImageData
    guid?: string
}

/**
 * Defines the imgstry thread schema.
 */
export interface IImgstryThread {
    /**
     * Starts a worker thread and initiates the request operations.
     * @param options
     * @param options.operations The operations to be executed.
     * @param options.imageData The image data to be processed.
     * @returns {Promise<IThreadResult>}
     */
    run({
        imageData,
        operations,
    }: IThreadData): Promise<IThreadResult | undefined>
}
