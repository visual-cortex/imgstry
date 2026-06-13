/* eslint-disable no-console */
import { performance } from 'perf_hooks';
import { Imgstry } from '~/platform/node';
import {
    EdgeDetection,
    GaussianBlur,
} from '~/kernel/collection';

const WIDTH = 1920;
const HEIGHT = 1080;
const RUNS = 7;

const seedImage = (instance: Imgstry) => {
    const image = instance.imageData;
    const data = image.data;
    let seed = 0x2f6e2b1;
    for (let i = 0; i < data.length; i++) {
    // deterministic pseudo-random fill
        seed = (seed * 16807) % 2147483647;
        data[i] = (i + 1) % 4 === 0 ? 255 : seed % 256;
    }
    instance.imageData = image;
    return instance;
};

const median = (values: number[]) => {
    const sorted = [...values].sort((a, b) => a - b);
    return sorted[Math.floor(sorted.length / 2)];
};

const bench = (name: string, setup: () => Imgstry, run: (instance: Imgstry) => void) => {
    const timings: number[] = [];
    for (let i = 0; i < RUNS; i++) {
        const instance = setup();
        const start = performance.now();
        run(instance);
        timings.push(performance.now() - start);
    }
    console.log(`${name.padEnd(34)} median ${median(timings).toFixed(2)}ms  min ${Math.min(...timings).toFixed(2)}ms`);
};

const fresh = () => seedImage(new Imgstry(WIDTH, HEIGHT));

console.log(`imgstry bench ${WIDTH}x${HEIGHT}, ${RUNS} runs\n`);

bench('lut batch (bri+con+gamma)', fresh, (i) => {
    i.brightness(20).contrast(15).gamma(10).renderSync();
});

bench('cross-channel (sat+vib+sepia)', fresh, (i) => {
    i.saturation(10).vibrance(10).sepia(30).renderSync();
});

bench('hue 45', fresh, (i) => {
    i.hue(45).renderSync();
});

bench('blackAndWhite + invert + tint', fresh, (i) => {
    i.blackAndWhite().invert().tint('#FF0000').renderSync();
});

bench('histogram', fresh, (i) => {
    void i.histogram;
});

bench('histogram x5 (cache probe)', fresh, (i) => {
    for (let n = 0; n < 5; n++) {
        void i.histogram;
    }
});

bench('gaussian blur 3x3', fresh, (i) => {
    i.convolve(GaussianBlur()).renderSync();
});

bench('edge detection', fresh, (i) => {
    i.convolve(EdgeDetection()).renderSync();
});

bench('full pipeline', fresh, (i) => {
    i.brightness(10).contrast(10).saturation(15).vibrance(5).hue(20).convolve(GaussianBlur()).renderSync();
});

bench('vignette', fresh, (i) => {
    i.vignette({ amount: 50 }).renderSync();
});

bench('clarity x3 (pool probe)', fresh, (i) => {
    i.clarity(40).renderSync();
    i.clarity(40).renderSync();
    i.clarity(40).renderSync();
});

bench('gaussian blur 9x9', fresh, (i) => {
    i.convolve(GaussianBlur(9, 4)).renderSync();
});

bench('histogram (cold)', fresh, (i) => {
    // pristine state → engine falls back to original buffer; no LUTs, so the
    // histogram cache is invalidated then read once.
    void i.histogram;
});

bench('layer flatten', () => {
    const instance = seedImage(new Imgstry(WIDTH, HEIGHT));
    instance.createLayer({ opacity: 0.6, blendMode: 'screen' }).fill('#FFAA66').renderSync();
    instance.createLayer({ opacity: 0.4, blendMode: 'multiply' }).fill('#3366FF').renderSync();
    return instance;
}, (i) => {
    i.flatten();
});
