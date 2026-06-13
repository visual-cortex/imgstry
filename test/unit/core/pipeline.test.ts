import { describe, beforeEach, expect, it } from 'vitest';
import { Imgstry } from '~/platform/node';

const meanChannel = (data: Uint8ClampedArray, channel: 0 | 1 | 2): number => {
    let sum = 0;
    for (let i = 0; i < data.length; i += 4) {
        sum += data[i + channel];
    }
    return sum / (data.length / 4);
};

describe('pipeline: new operations', () => {
    let processor: Imgstry;

    beforeEach(() => {
        processor = new Imgstry(32, 32);
        processor.fill('#808080').renderSync();
    });

    it('exposure(1) doubles channel intensity (clamped)', () => {
        processor.exposure(1).renderSync();
        expect(meanChannel(processor.imageData.data, 0)).approximately(255, 1);
    });

    it('exposure(-1) halves channel intensity', () => {
        processor.exposure(-1).renderSync();
        expect(meanChannel(processor.imageData.data, 0)).approximately(64, 1);
    });

    it('temperature(100) warms (raises r, drops b)', () => {
        processor.temperature(100).renderSync();
        const data = processor.imageData.data;
        expect(meanChannel(data, 0)).greaterThan(meanChannel(data, 2));
    });

    it('temperature(-100) cools (raises b, drops r)', () => {
        processor.temperature(-100).renderSync();
        const data = processor.imageData.data;
        expect(meanChannel(data, 2)).greaterThan(meanChannel(data, 0));
    });

    it('whites(50) lifts pixels near white only', () => {
        processor = new Imgstry(32, 32);
        processor.fill('#F0F0F0').renderSync();
        const before = meanChannel(processor.imageData.data, 0);
        processor.whites(50).renderSync();
        expect(meanChannel(processor.imageData.data, 0)).greaterThan(before);
    });

    it('blacks(-50) crushes pixels near black only', () => {
        processor = new Imgstry(32, 32);
        processor.fill('#101010').renderSync();
        const before = meanChannel(processor.imageData.data, 0);
        processor.blacks(-50).renderSync();
        expect(meanChannel(processor.imageData.data, 0)).lessThan(before);
    });

    it('levels collapses range', () => {
        processor.levels({ inLow: 100, inHigh: 200, outLow: 0, outHigh: 255 }).renderSync();
        // grey 128 -> normalized .28 -> stretched
        const value = meanChannel(processor.imageData.data, 0);
        expect(value).greaterThan(60);
        expect(value).lessThan(80);
    });

    it('curve respects shared mapping', () => {
        const mapping = new Array<number>(256).fill(0).map((_, i) => 255 - i);
        processor.curve({ rgb: mapping }).renderSync();
        expect(meanChannel(processor.imageData.data, 0)).approximately(255 - 128, 1);
    });

    it('vignette darkens corners', () => {
        processor.vignette({ amount: -100, midpoint: 30, feather: 80 }).renderSync();
        const corner = processor.imageData.data;
        // top-left corner
        expect(corner[0]).lessThan(128);
        // center should be untouched
        const cx = 16, cy = 16;
        const offset = (cy * 32 + cx) * 4;
        expect(corner[offset]).approximately(128, 5);
    });

    it('channel mixer can swap red and blue', () => {
        processor = new Imgstry(8, 8);
        processor.fill('#FF0000').renderSync();
        processor.channelMixer({
            r: { r: 0, g: 0, b: 1 },
            g: { r: 0, g: 1, b: 0 },
            b: { r: 1, g: 0, b: 0 },
        }).renderSync();
        const data = processor.imageData.data;
        expect(data[0]).equal(0);
        expect(data[2]).equal(255);
    });

    it('clarity boosts midtone contrast (no NaN, identity on flat field)', () => {
        processor.clarity(50).renderSync();
        const value = meanChannel(processor.imageData.data, 0);
        expect(value).approximately(128, 2);
    });

    it('fuses LUT operations into a single pass without changing the output', () => {
        const a = new Imgstry(8, 8);
        a.fill('#808080').renderSync();
        a.brightness(20).contrast(15).gamma(10).renderSync();

        const b = new Imgstry(8, 8);
        b.fill('#808080').renderSync();
        b.brightness(20).renderSync();
        b.contrast(15).renderSync();
        b.gamma(10).renderSync();

        const left = a.imageData.data;
        const right = b.imageData.data;
        for (let i = 0; i < left.length; i++) {
            expect(left[i]).approximately(right[i], 1);
        }
    });
});
