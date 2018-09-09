import {
  IThreadData,
  IThreadResult,
  ImgstryThread,
} from '../../core/imgstry.thread';
import {
  IWorkerData,
  IWorkerResult,
} from './types';

import { ImgstryWorker } from './imgstry.worker';
import { Logger } from '../../helpers/logger';

declare const importScripts: (...scripts: string[]) => void;
declare const imgstry: typeof ImgstryWorker;

const executor = () => {
  const worker = self as any as Worker;

  try {
    importScripts('#-url-');
  } catch (e) {
    console.error(e.message);
  }

  worker.onmessage = (message) => {
    const data: IWorkerData = message.data;
    const processor = new imgstry(data)
      .batch(data.operations);

    worker.postMessage({
      buffer: processor.imageData.data.buffer,
      width: processor.imageData.width,
      height: processor.imageData.height,
    },
      [processor.imageData.data.buffer],
    );
  };
};

/**
 * Browser thread option contract.
 *
 * @export
 * @interface ThreadBrowserOptions
 */
export interface ThreadBrowserOptions {
  isEnabled?: boolean;
  isDevelopment?: boolean;
  host?: {
    url: string,
    scriptDirectory: string,
  };
}

const generateSlaveBlob = (scriptLocation: string) => {
  return new Blob([`(
    ${
    executor.toString()
      .replace('#-url-', scriptLocation)
    })()`], {
      type: 'text/javascript',
    });
};

/**
 * Thread communication layer for the browser.
 *
 * @export
 * @class ImgstryBrowserThread
 * @implements {ImgstryThread}
 * @ignore
 */
export class ImgstryBrowserThread implements ImgstryThread {
  private _worker: Worker;
  private _promise: Promise<IThreadResult>;
  private _logger: Logger;

  constructor(
    private _options: ThreadBrowserOptions,
  ) {
    const scriptLocation = `${this._options.host.url}${this._options.host.scriptDirectory}imgstry.worker.min.js`;
    const blob = generateSlaveBlob(scriptLocation);
    this._logger = new Logger(_options.isDevelopment);
    this._worker = new Worker(URL.createObjectURL(blob));

    this._logger.info(
      'Worker import: ',
      scriptLocation,
    );

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
