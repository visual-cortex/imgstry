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
            const transfer = floatBuffer.buffer.slice(
                floatBuffer.byteOffset,
                floatBuffer.byteOffset + floatBuffer.byteLength,
            );
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
