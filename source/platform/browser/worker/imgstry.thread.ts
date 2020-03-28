import { Subject } from 'rxjs';
import {
  filter,
  first,
} from 'rxjs/operators';
import ImgstryWorker from 'worker-loader?inline=true&fallback=false!./imgstry.worker';
import {
  IImgstryThread,
  IThreadData,
  IThreadResult,
} from '~core/imgstry.thread';
import {
  IWorkerData,
  IWorkerResult,
} from '~platform/browser/worker/types';
import { IDisposable } from '~types';
import { Logger } from '~utils/logger';
import { uuid } from '~utils/random';

/**
 * Browser thread option contract.
 *
 * @export
 * @interface ImgstryThreadOptions
 */
export interface ImgstryThreadOptions {
  isEnabled?: boolean;
  isDebugEnabled?: boolean;
}

/**
 * Thread communication layer for the browser.
 *
 * @export
 * @class ImgstryThread
 * @implements {IImgstryThread}
 * @implements {IDisposable}
 * @ignore
 */
export class ImgstryThread implements IImgstryThread, IDisposable {
  public process$ = new Subject<IThreadResult>();

  private _worker: ImgstryWorker;
  private _logger: Logger;

  /**
   * Creates an instance of ImgstryThread.
   * @param {ImgstryThreadOptions} _options The thread options.
   * @memberof ImgstryThread {isEnabled, isDebugEnabled}
   * @constructor
   */
  constructor(
    _options: ImgstryThreadOptions,
  ) {
    this._logger = new Logger(!!_options.isDebugEnabled);
    this._worker = new ImgstryWorker();

    this._worker.onmessage = (message: MessageEvent) => {
      this._logger.info(
        'Worker recieved:',
        message.data,
      );
      const { buffer, width, height, guid } = (message.data as IWorkerResult);
      this.process$.next({
        imageData: new ImageData(new Uint8ClampedArray(buffer), width, height),
        guid,
      });
    };

    this._worker.onerror = (err: ErrorEvent) => {
      this._logger.error(err);
      this.process$.error(err);
    };
  }

  /**
   * Queues a new set of operations, throttled @ 250ms.
   *
   * @param {IThreadData} data {
   *     imageData,
   *     operations,
   *   }
   * @returns {Promise<IThreadResult>} A promise with the resulting image.
   * @memberof ImgstryThread
   */
  public run({
    imageData,
    operations,
  }: IThreadData): Promise<IThreadResult> {
    const identifier = uuid();

    const data: IWorkerData = {
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
      )
      .toPromise();
  }

  /**
   * Terminates the current worker thread and completes active streams.
   *
   * @memberof ImgstryThread
   * @returns {void}
   */
  public dispose() {
    this._worker.terminate();
    this.process$.complete();
  }
}
