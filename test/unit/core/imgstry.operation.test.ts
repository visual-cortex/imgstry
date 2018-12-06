import { Operation } from '../../../source/core/imgstry.operation';
import { Rgb } from '../../../source/pixel/color/spaces/rgb';
import { expect } from 'chai';

describe('Image operations', () => {
  context('black and white', () => {
    it('should flatten channel', () => {
      const pixel = new Rgb({
        r: 128,
        g: 190,
        b: 255,
      });

      const result: Rgb = Operation.blackAndWhite()(pixel);

      expect(result.r).equal(result.g);
      expect(result.g).equal(result.b);
    });

    it('should ignore ratio if sum is not 1', () => {
      const pixel = new Rgb({
        r: 128,
        g: 190,
        b: 255,
      });

      let result: Rgb;
      result = Operation.blackAndWhite([1, 1, 1])(pixel);

      expect(result.r).equal(result.g);
      expect(result.g).equal(result.b);

      result = Operation.blackAndWhite([.3, .3, .3])(pixel);

      expect(result.r).equal(result.g);
      expect(result.g).equal(result.b);
    });

    it('should apply provided priority ratio', () => {
      for (let i = 1e-2; i < 1; i += 1e-2) {
        const ratio: [number, number, number] = [i, (1 - i) / 2, (1 - i) / 2];

        const pixel = new Rgb({
          r: 128,
          g: 190,
          b: 255,
        });

        const result: Rgb = Operation.blackAndWhite(ratio)(pixel);

        const rRatio = (result.r - ratio[1] * pixel.g - ratio[2] * pixel.b) / pixel.r;
        expect(rRatio).approximately(ratio[0], 1e-9);

        const gRatio = (result.g - ratio[0] * pixel.r - ratio[2] * pixel.b) / pixel.g;
        expect(gRatio).approximately(ratio[1], 1e-9);

        const bRatio = (result.b - ratio[0] * pixel.r - ratio[1] * pixel.g) / pixel.b;
        expect(bRatio).approximately(ratio[2], 1e-9);
      }
    });
  });
});
