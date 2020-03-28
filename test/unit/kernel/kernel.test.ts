import { expect } from 'chai';
import { Kernel } from '~kernel';

describe('class: Kernel', () => {
  context('ctor', () => {
    it('should construct correctly', () => {
      const kernel = new Kernel([[]]);
      expect(kernel).to.not.be.undefined;
      expect(kernel.width).to.equal(0);
      expect(kernel.height).to.equal(1);
    });

    it(`should throw an error if it's not provided a two-dimensional array`, () => {
      // @ts-expect-error
      expect(Kernel.bind(Kernel, null)).to.throw;
      expect(Kernel.bind(Kernel, [])).to.throw;
      // @ts-expect-error
      expect(Kernel.bind(Kernel, {})).to.throw;
    });

    it('should traverse kernel', () => {
      const kernel = new Kernel([[1, 2], [3, 4]]);

      const expected = [1, 2, 3, 4];
      let eIdx = 0;
      kernel.forEach((value, idx) => {
        expect(value).to.be.a('number');
        expect(idx.x).to.be.a('number');
        expect(idx.y).to.be.a('number');
        expect(value).to.equal(expected[eIdx++]);
      });
    });
  });
});
