import { Imgstry } from '~/platform/browser/worker/imgstry.background';
import { IWorkerData } from '~/platform/browser/worker/types';

const worker = self as any as Worker;

worker.onmessage = (message) => {
    const data: IWorkerData = message.data;
    const processor = new Imgstry(data);
    processor.batch(data.operations);

    if (data.kind === 'float') {
        const floatBuffer = processor.getFloatBuffer();
        if (floatBuffer) {
            // Transfer the underlying ArrayBuffer outright - the worker
            // constructed the Float32Array straight over the buffer
            // handed in, so no slice / clone is needed before postMessage
            // re-transfers it back to the main thread.
            const transfer = floatBuffer.buffer as ArrayBuffer;
            worker.postMessage({
                kind: 'float',
                buffer: transfer,
                width: processor.width,
                height: processor.height,
                guid: data.guid,
            },
            [transfer],
            );
            return;
        }
    }

    worker.postMessage({
        kind: 'u8',
        buffer: processor.imageData.data.buffer,
        width: processor.imageData.width,
        height: processor.imageData.height,
        guid: data.guid,
    },
    [processor.imageData.data.buffer],
    );
};
