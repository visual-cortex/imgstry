import {
  IThreadData,
  IThreadResult,
  IImgstryThread,
} from '../../core/imgstry.thread';

import {
  IWorkerData,
  IWorkerResult,
} from './types';

import ImgstryWorker from 'worker-loader?inline=true&fallback=false!./imgstry.worker';

import { Logger } from '../../helpers/logger';

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
 * @ignore
 */
export class ImgstryThread implements IImgstryThread {
  private _worker: ImgstryWorker;
  private _promise: Promise<IThreadResult>;
  private _logger: Logger;

  constructor(
    _options: ImgstryThreadOptions,
  ) {
    this._logger = new Logger(_options.isDebugEnabled);
    this._worker = new ImgstryWorker();

    this._promise = new Promise((resolve, reject) => {
      this._worker.onmessage = (message: MessageEvent) => {
        this._logger.info(
          'Worker recieved:',
          message.data,
        );
        const { buffer, width, height } = (message.data as IWorkerResult);
        resolve({
          imageData: new ImageData(new Uint8ClampedArray(buffer), width, height),
        });
        this._worker.terminate();
      };

      this._worker.onerror = (err: ErrorEvent) => {
        this._logger.error(err);
        reject(err);
        this._worker.terminate();
      };
    });
  }

  public run({
    imageData,
    operations,
  }: IThreadData): Promise<IThreadResult> {
    this._post({
      buffer: imageData.data.buffer,
      width: imageData.width,
      height: imageData.height,
      operations: operations,
    });

    return this._promise;
  }

  private _post(data: IWorkerData) {
    this._logger.info(
      'Send to worker: ',
      data,
    );

    this._worker.postMessage(data, [data.buffer]);
  }
}
