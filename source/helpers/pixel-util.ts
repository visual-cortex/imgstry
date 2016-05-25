/**
 * PixelUtil
 */
class PixelUtil {
  public static clamp(pixel: Pixel): Pixel {
    return {
      r: this.toByte(pixel.r),
      g: this.toByte(pixel.g),
      b: this.toByte(pixel.b),
    };
  }

  private static toByte(value: number) {
    return value > 255 ? 255 : value < 0 ? 0 : 255;
  }
}
