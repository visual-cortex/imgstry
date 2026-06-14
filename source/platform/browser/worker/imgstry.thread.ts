// eslint-disable-file jsdoc/valid-types
import {
    animationFrameScheduler,
    fromEvent,
    Subject,
} from 'rxjs';
import {
    filter,
    first,
    observeOn,
    takeUntil,
} from 'rxjs/operators';
// eslint-disable-next-line import-x/default
import ImgstryWorker from './imgstry.worker?worker';
import {
    IFloatThreadData,
    IFloatThreadResult,
    IImgstryThread,
    IThreadData,
    IThreadResult,
} from '~/core/imgstry.thread';
import {
    IWorkerData,
    IWorkerResult,
} from '~/platform/browser/worker/types';
import { IDisposable } from '~/types';
import { Logger } from '~/utils/logger';
import { uuid } from '~/utils/random';

/**
 * Browser thread option contract.
 */
export interface ImgstryThreadOptions {
    isEnabled?: boolean
    isDebugEnabled?: boolean
}

/**
 * Thread communication layer for the browser.
 * @ignore
 */
export class ImgstryThread implements IImgstryThread, IDisposable {
    public process$ = new Subject<IThreadResult>();
    public floatProcess$ = new Subject<IFloatThreadResult>();

    private _disposed$ = new Subject();
    private _worker: Worker;
    private _logger: Logger;

    /**
     * Creates an instance of ImgstryThread.
     * @param _options The thread options.
     */
    public constructor(
        _options: ImgstryThreadOptions,
    ) {
        this._logger = new Logger(!!_options.isDebugEnabled);
        this._worker = new ImgstryWorker();

        type EventMap = {
            message: MessageEvent
            error: ErrorEvent
        };

        const delegate = <
            TEvent extends keyof EventMap,
            TMessage = EventMap[TEvent],
        >(event: TEvent, cb: (message: TMessage) => void) => {
            fromEvent<TMessage>(this._worker, event)
                .pipe(
                    takeUntil(this._disposed$),
                )
                .subscribe(cb);
        };

        delegate('message', this._handleMessage);
        delegate('error', this._handleError);
    }

    /**
     * Queues a new set of operations, throttled @ 250ms.
     * @param options { imageData, operations }
     * @param options.imageData The image data to process.
     * @param options.operations The operations to apply.
     * @returns A promise with the resulting image.
     */
    public run({
        imageData,
        operations,
    }: IThreadData): Promise<IThreadResult | undefined> {
        const identifier = uuid();

        const data: IWorkerData = {
            kind: 'u8',
            buffer: imageData.data.buffer,
            width: imageData.width,
            height: imageData.height,
            operations: operations,
            guid: identifier,
        };

        this._worker.postMessage(data, [data.buffer]);

        return this.process$
            .pipe(
                filter(response => response.guid === identifier),
                first(),
                observeOn(animationFrameScheduler),
            )
            .toPromise();
    }

    /**
     * Queues a Float32 buffer + operations to run on the worker.
     * @param payload the float buffer + dimensions + ops
     * @param payload.buffer the Float32 RGBA buffer
     * @param payload.width image width
     * @param payload.height image height
     * @param payload.operations the operations to execute
     * @returns a promise resolving to the processed float buffer
     */
    public runFloat({
        buffer,
        width,
        height,
        operations,
    }: IFloatThreadData): Promise<IFloatThreadResult | undefined> {
        const identifier = uuid();
        // Copy so the transferable ownership rule doesn't strip the
        // caller's buffer; the engine wants to keep its source alive.
        const copy = new Float32Array(buffer.length);
        copy.set(buffer);
        const transfer = copy.buffer;

        const data: IWorkerData = {
            kind: 'float',
            buffer: transfer,
            width,
            height,
            operations: operations,
            guid: identifier,
        };

        this._worker.postMessage(data, [transfer]);

        return this.floatProcess$
            .pipe(
                filter(response => response.guid === identifier),
                first(),
                observeOn(animationFrameScheduler),
            )
            .toPromise();
    }

    /**
     * Terminates the current worker thread and completes active streams.
     */
    public dispose(): void {
        this._worker.terminate();
        this._disposed$.next(void 0);
        this._disposed$.complete();
        this.process$.complete();
        this.floatProcess$.complete();
    }

    private _handleMessage = (message: MessageEvent) => {
        this._logger.info(
            'Worker received:',
            message.data,
        );
        const result = message.data as IWorkerResult;
        if (result.kind === 'float') {
            this.floatProcess$.next({
                buffer: new Float32Array(result.buffer),
                width: result.width,
                height: result.height,
                guid: result.guid,
            });
            return;
        }
        this.process$.next({
            imageData: new ImageData(new Uint8ClampedArray(result.buffer), result.width, result.height),
            guid: result.guid,
        });
    };

    private _handleError = (err: ErrorEvent) => {
        this._logger.error(err);
        this.process$.error(err);
    };
}
