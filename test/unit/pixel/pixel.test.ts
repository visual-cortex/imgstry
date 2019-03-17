import { expect } from 'chai';
import {
  Cmyk,
  ColorSpace,
  Hex,
  Hsv,
  Pixel,
  Rgb,
} from '~pixel';

describe('Pixel', () => {
  context('color space code', () => {
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
