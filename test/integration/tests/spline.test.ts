import { expect } from 'chai';
import {
  ImgstrySpline,
  Theme,
} from '~platform/browser';

type MutableEvent = Record<string, string | boolean | number> & Event;

const event = (type: string, opts: any = {}) => {
  opts = opts || {};

  const ev = document.createEvent('Event') as MutableEvent;

  ev.initEvent(type, true, false);

  // attach remaining unused options to the object
  for (const key of Object.keys(opts)) {
    ev[key] = opts[key];
  }

  return ev;
};

describe('class: ImgstrySpline (browser)', () => {
  const anchor = '#board';
  const transposeY = (y: number) => gridHeight - y;
  let spline: ImgstrySpline;
  let padding: number;
  let element: HTMLCanvasElement;
  let gridHeight: number;
  let gridWidth: number;

  beforeEach(() => {
    spline = new ImgstrySpline(ImgstrySpline.getCanvas(anchor), {
      anchorSize: 5,
      gridSize: 4,
      theme: Theme.Light,
    });
    padding = spline['_options'].anchorSize * 2;
    element = document.querySelector(anchor);
    gridHeight = element.height - padding * 2;
    gridWidth = element.width - padding * 2;
  });

  context('ctor', () => {
    it('should have 2 points predefined', () => {
      expect(spline['_points'].length).equal(2);
    });

    it('should have initial points in (0, 0) and (1, 1)', () => {
      const [first, second] = spline['_points'];

      expect(first.x).equal(0);
      expect(first.y).equal(0);

      expect(second.x).equal(1);
      expect(second.y).equal(1);
    });

    it('should generate a lookup with 256 values between 0...255', () => {
      const lookup = spline.lookup();

      expect(lookup).not.null;
      expect(lookup.length).equal(256);

      lookup.forEach((y, x) => {
        expect(y).equal(x);
      });
    });

  });
  context('interpolation', () => {
    it('should interpolate correct values for x in range 0...1', () => {
      for (let x = 0; x <= 1.001; x += .001) {
        const y = spline.interpolateOne(x);
        expect(x).approximately(y, 1e-9, `for x: ${x}`);
      }
    });
  });

  context('remove', () => {
    it('should remove all point (0, 0) and (1, 0)', () => {
      spline.remove({ x: 0, y: 0 });
      spline.remove({ x: 1, y: 1 });

      expect(spline['_points'].length).equal(0);
    });

    it('should NOT add point (1, 0) and (0, 1) - X axis overlap scenario', () => {
      expect(spline['_points'].length).equal(2);

      spline.add({ x: 1, y: 0 });
      spline.add({ x: 0, y: 1 });

      expect(spline['_points'].length).equal(2);
    });

    it('should add point (.99, 0) and (.01, 1)', () => {
      expect(spline['_points'].length).equal(2);

      spline.add({ x: .99, y: 0 });
      spline.add({ x: .01, y: 1 });

      expect(spline['_points'].length).equal(4);
    });
  });

  context('interpolation', () => {
    context('result for points (0, 1) and (1, 0)', () => {
      it('should interpolate correct values for x in range 0...1', () => {
        spline.remove({ x: 0, y: 0 });
        spline.remove({ x: 1, y: 1 });

        spline.add({ x: 0, y: 1 });
        spline.add({ x: 1, y: 0 });

        const lookup = spline.lookup();

        expect(lookup).not.null;
        expect(lookup.length).equal(256);

        lookup.forEach((y, x) => {
          expect(y).approximately(255 - x, 1);
        });
      });
    });

    context('result for points (0, 0), (.5, 1) and (1, 1)', () => {
      it('should interpolate correct values for x in range 0...1', () => {
        spline.add({ x: .5, y: 1 });

        const lookup = spline.lookup();

        expect(lookup).not.null;
        expect(lookup.length).equal(256);

        let lastY = -1;
        lookup.forEach((y, x) => {
          if (x >= 256 * .5) {
            expect(y).equal(255);
          } else if (
            x !== 0 &&
            y !== 0
          ) {
            expect(x / (y || 1))
              .greaterThan(.3)
              .and
              .lessThan(.5);

            expect(y)
              .greaterThan(lastY);

            lastY = y;
          }
        });
      });
    });

    context('result for points (1, 0), (.5, 1) and (0, 1)', () => {
      it('should interpolate correct values for x in range 0...1', () => {
        spline.remove({ x: 0, y: 0 });
        spline.remove({ x: 1, y: 1 });

        spline.add({ x: 0, y: 1 });
        spline.add({ x: 1, y: 0 });
        spline.add({ x: .5, y: 1 });

        const lookup = spline.lookup();

        expect(lookup).not.null;
        expect(lookup.length).equal(256);

        let lastY = 256;
        lookup.forEach((y, x) => {
          if (x < 256 * .5) {
            expect(y).equal(255);
          } else {
            expect(y / x)
              .lessThan(2)
              .and
              .greaterThan(-1e-8);

            expect(y)
              .lessThan(lastY);
            lastY = y;
          }
        });
      });
    });

    context('interactive usage', () => {
      it('should add a new point if dblclick-ed', () => {
        const clickPoint = {
          offsetX: 50,
          offsetY: 75,
        };

        const dblclick = event('dblclick', clickPoint);

        expect(spline['_points'].length).to.equal(2);

        element.dispatchEvent(dblclick);

        expect(spline['_points'].length).to.equal(3);

        const x = (clickPoint.offsetX - padding) / gridWidth;
        const y = transposeY(clickPoint.offsetY - padding) / gridHeight;

        const point = spline['_points'].find({ x, y });

        expect(point).to.not.be.undefined;
        expect(point.index).to.equal(1);
        expect(point.point).to.deep.include({ x, y });
      });

      it(`should allow only maximum 15 anchors to be added`, () => {
        const maxAnchors = spline['_maxAnchors'];
        const addCount = maxAnchors + 3;
        const stepX = gridWidth / addCount;
        const stepY = gridHeight / addCount;

        for (let i = 1; i < addCount; i++) {
          const dblclick = event('dblclick', {
            offsetX: stepX * i,
            offsetY: stepY * i,
          });
          element.dispatchEvent(dblclick);
        }

        expect(spline['_points'].length).to.equal(maxAnchors);
      });

      it('should move point onusemove', () => {
        const initialPoint = {
          offsetX: 50,
          offsetY: 75,
        };

        const dblclick = event('dblclick', initialPoint);
        element.dispatchEvent(dblclick);

        const moveOverPoint = event('mousemove', initialPoint);
        element.dispatchEvent(moveOverPoint);

        element.dispatchEvent(moveOverPoint);

        const pressMouseDown = event('mousedown');
        element.dispatchEvent(pressMouseDown);

        const updatedPoint = {
          offsetX: 100,
          offsetY: 150,
        };

        expect(spline['_dragging$'].value).to.be.true;
        expect(spline['_anchor$'].value.index).to.equal(1);

        const moveToNewPosition = event('mousemove', updatedPoint);
        element.dispatchEvent(moveToNewPosition);

        const releaseMouse = event('mouseup');
        element.dispatchEvent(releaseMouse);

        const xInitial = (initialPoint.offsetX - padding) / gridWidth;
        const yInitial = transposeY(initialPoint.offsetY - padding) / gridHeight;

        const initial = spline['_points'].find({ x: xInitial, y: yInitial });

        expect(initial.index).to.equal(-1);

        const xUpdated = (updatedPoint.offsetX - padding) / gridWidth;
        const yUpdated = transposeY(updatedPoint.offsetY - padding) / gridHeight;

        const updated = spline['_points'].find({ x: xUpdated, y: yUpdated });

        expect(updated.index).to.equal(1);
      });

      it('should mark drag with no point', () => {
        expect(spline['_dragging$'].value).to.be.false;

        const pressMouseDown = event('mousedown');
        element.dispatchEvent(pressMouseDown);

        expect(spline['_dragging$'].value).to.be.true;
        expect(spline['_anchor$'].value.index).to.equal(-1);
      });

      it('should stop dragging if leaving canvas', () => {
        const initialPoint = {
          offsetX: 50,
          offsetY: 75,
        };

        const dblclick = event('dblclick', initialPoint);
        element.dispatchEvent(dblclick);

        const moveOverPoint = event('mousemove', initialPoint);
        element.dispatchEvent(moveOverPoint);

        element.dispatchEvent(moveOverPoint);

        const pressMouseDown = event('mousedown');
        element.dispatchEvent(pressMouseDown);

        const updatedPoint = {
          offsetX: 100,
          offsetY: 150,
        };

        const moveToNewPosition = event('mousemove', updatedPoint);
        element.dispatchEvent(moveToNewPosition);

        expect(spline['_dragging$'].value).to.be.true;
        expect(spline['_anchor$'].value).to.be.not.be.undefined;
        expect(spline['_anchor$'].value.index).to.be.greaterThan(-1);

        const leaveCanvas = event('mouseleave');
        element.dispatchEvent(leaveCanvas);

        expect(spline['_dragging$'].value).to.be.false;
        expect(spline['_anchor$'].value).to.be.not.be.undefined;
        expect(spline['_anchor$'].value.index).to.equal(-1);
      });
    });
  });
});
