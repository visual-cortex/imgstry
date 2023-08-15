import { describe, beforeEach, expect, it } from 'vitest';
import { setSize } from '~/utils/canvas';
import { getCanvas } from '~/utils/dom';
import { JSDOM } from 'jsdom';

const dom = new JSDOM(`
  <!DOCTYPE html>
  <html>
    <head></head>
    <body>
      <div class="container">
        <canvas id="myCanvas"></canvas>
      </div>
    </body>
  </html>
`);

(global as any).document = dom.window.document;
(global as any).HTMLCanvasElement = dom.window.HTMLCanvasElement;

describe('util: setSize (browser)', () => {
    const anchor = '#myCanvas';
    let canvas: HTMLCanvasElement;

    beforeEach(() => {
        canvas = getCanvas(anchor);
    });

    const sides = Array(10).fill(null).map((_, idx) => ++idx * 100);

    sides.forEach(width => {
        sides.forEach(height => {
            it(`should set the size of the canvas to ${width}x${height}`, () => {
                setSize(canvas, width, height);

                expect(canvas.width).to.equal(width);
                expect(canvas.height).to.equal(height);
            });
        });
    });
});
