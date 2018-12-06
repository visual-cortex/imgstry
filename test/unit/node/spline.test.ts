import { ImgstrySpline } from '../../../source/platform/node';
import { expect } from 'chai';

describe('Spline Node Processor', () => {
  let spline: ImgstrySpline;

  beforeEach(() => {
    spline = new ImgstrySpline();
  });

  describe('ctor', () => {
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

    describe('interpolation', () => {
      it('should interpolate correct values for x in range 0...1', () => {
        for (let x = 0; x <= 1.001; x += .001) {
          const y = spline.interpolateOne(x);
          expect(x).approximately(y, 1e-9, `for x: ${x}`);
        }
      });
    });
  });

  describe('remove', () => {
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

  describe('interpolation', () => {
    describe('result for points (0, 1) and (1, 0)', () => {
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

    describe('result for points (0, 0), (.5, 1) and (1, 1)', () => {
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

    describe('result for points (1, 0), (.5, 1) and (0, 1)', () => {
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
  });
});
