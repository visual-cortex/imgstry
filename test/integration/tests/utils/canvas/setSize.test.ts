import { expect } from 'chai';
import { setSize } from '~utils/canvas';
import { getCanvas } from '~utils/dom';

describe('util: setSize (browser)', () => {
  const anchor = '#board';
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
    })
  });
});
