/* eslint-disable no-console */
import { performance } from 'perf_hooks';
import {
    Cmyk,
    Hex,
    Hsv,
    Rgb,
} from '~/pixel';
import { CubicSpline } from '~/core/spline';

const RUNS = 9;

const median = (values: number[]) => {
    const sorted = [...values].sort((a, b) => a - b);
    return sorted[Math.floor(sorted.length / 2)];
};

const bench = (name: string, iterations: number, run: () => void) => {
    // warmup
    for (let i = 0; i < Math.min(iterations, 1000); i++) {
        run();
    }

    const timings: number[] = [];

    for (let i = 0; i < RUNS; i++) {
        const start = performance.now();
        for (let n = 0; n < iterations; n++) {
            run();
        }
        timings.push(performance.now() - start);
    }

    const ms = median(timings);
    const nsPerOp = (ms * 1e6 / iterations).toFixed(1).padStart(8);
    const total = ms.toFixed(2).padStart(8);
    console.log(`${name.padEnd(38)} ${nsPerOp}ns/op   ${total}ms total (${iterations.toLocaleString()} iter)`);
};

console.log(`color/spline bench, ${RUNS} runs\n`);

bench('Hex#toRgb', 200_000, () => {
    new Hex('#3498DB').toRgb();
});

bench('Rgb#toHsv', 200_000, () => {
    new Rgb({ r: 120, g: 200, b: 50 }).toHsv();
});

bench('Hsv#toRgb', 200_000, () => {
    new Hsv({ h: 220, s: .6, v: .8 }).toRgb();
});

bench('Rgb#toCmyk', 200_000, () => {
    new Rgb({ r: 120, g: 200, b: 50 }).toCmyk();
});

bench('Cmyk#toRgb', 200_000, () => {
    new Cmyk({ c: .3, m: .4, y: .2, k: .1 }).toRgb();
});

bench('Rgb#toHex', 200_000, () => {
    new Rgb({ r: 120, g: 200, b: 50 }).toHex();
});

bench('Rgb#toHsv -> Hsv#toRgb', 100_000, () => {
    const hsv = new Rgb({ r: 120, g: 200, b: 50 }).toHsv();
    hsv.h += 45;
    hsv.toRgb();
});

const points = [
    { x: 0, y: 0 },
    { x: .25, y: .15 },
    { x: .5, y: .8 },
    { x: .75, y: .9 },
    { x: 1, y: 1 },
];

bench('CubicSpline construct (5 points)', 50_000, () => {
    new CubicSpline(points);
});

bench('CubicSpline interp x256', 20_000, () => {
    const spline = new CubicSpline(points);
    for (let i = 0; i < 256; i++) {
        spline.interpolate(i / 255);
    }
});

const densePoints = Array.from({ length: 33 }, (_, i) => ({
    x: i / 32,
    y: Math.sin(i / 32 * Math.PI),
}));

bench('CubicSpline construct (33 points)', 20_000, () => {
    new CubicSpline(densePoints);
});

bench('CubicSpline interp x256 (33 pts)', 5_000, () => {
    const spline = new CubicSpline(densePoints);
    for (let i = 0; i < 256; i++) {
        spline.interpolate(i / 255);
    }
});
