import { IWorkerData } from '~platform/browser/worker/types';
import { Imgstry } from '~platform/browser/worker/imgstry.background';

const worker = self as any as Worker;

worker.onmessage = (message) => {
  const data: IWorkerData = message.data;
  const processor = new Imgstry(data)
    .batch(data.operations);

  worker.postMessage({
    buffer: processor.imageData.data.buffer,
    width: processor.imageData.width,
    height: processor.imageData.height,
  },
    [processor.imageData.data.buffer],
  );
};
