import { expect } from 'chai';
import {
  Cmyk,
  ColorSpace,
  Hex,
  Hsv,
  Pixel,
  Rgb,
} from '~pixel';

describe('class: Pixel', () => {
  context('color space code', () => {
    it('should return correct coordinate values', () => {
      const pixel = new Pixel(10, 5, new Rgb());
      expect(pixel.x).to.equal(10);
      expect(pixel.y).to.equal(5);
    });

    it('should return persist a coordinate value update', () => {
      const pixel = new Pixel(10, 5, new Rgb());

      pixel.x = 100;
      pixel.y = 50;

      expect(pixel.x).to.equal(100);
      expect(pixel.y).to.equal(50);
    });

    it('should return correct color space for empty pixel', () => {
      // @ts-expect-error
      const pixel = new Pixel(0, 0, null);

      expect(pixel.colorSpace).eql(ColorSpace.Empty);
    });

    it('should return for Rgb', () => {
      const pixel = new Pixel(0, 0, new Rgb());
      expect(pixel.colorSpace).eql(ColorSpace.Rgb);
      expect(ColorSpace.Rgb).eql('Rgb');
    });

    it('should return for Hex', () => {
      const pixel = new Pixel(0, 0, new Hex());
      expect(pixel.colorSpace).eql(ColorSpace.Hex);
      expect(ColorSpace.Hex).eql('Hex');
    });

    it('should return for Cmyk', () => {
      const pixel = new Pixel(0, 0, new Cmyk());
      expect(pixel.colorSpace).eql(ColorSpace.Cmyk);
      expect(ColorSpace.Cmyk).eql('Cmyk');
    });

    it('should return for Hsv', () => {
      const pixel = new Pixel(0, 0, new Hsv());
      expect(pixel.colorSpace).eql(ColorSpace.Hsv);
      expect(ColorSpace.Hsv).eql('Hsv');
    });
  });
});
