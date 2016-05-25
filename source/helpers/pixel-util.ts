class PixelUtil {

  /**
   * (Clamps the pixel channel values to keep it in a working rgb space.)
   * 
   * @static
   * @param {RgbPixel} pixel (rgb pixel that needs to be clamped.)
   * @returns {RgbPixel} (clamped rgb pixel.)
   */
  public static clamp(pixel: RgbPixel): RgbPixel {
    return {
      r: this.toByte(pixel.r),
      g: this.toByte(pixel.g),
      b: this.toByte(pixel.b),
    };
  }

  /**
   * (Converts an RGB pixel to an HSV value.)
   * 
   * @static
   * @param {RgbPixel} pixel (RGB pixel that needs to be converted to HSV space.)
   * @returns {HsvPixel} (HSV equivalent of the input pixel.)
   */
  public static toHsv(pixel: RgbPixel): HsvPixel {
    pixel.r /= 255;
    pixel.g /= 255;
    pixel.b /= 255;

    let max = Math.max(pixel.r, pixel.g, pixel.b);
    let min = Math.min(pixel.r, pixel.g, pixel.b);

    let v = max;
    let d = max - min;
    let s = max === 0 ? 0 : d / max;
    let h: number;

    if(max === min) {
      h = 0;
    } else {
      h = (function() {
          switch (max) {
            case pixel.r:
              return (pixel.g - pixel.b) / d + (pixel.g < pixel.b ? 6 : 0);
            case pixel.g:
              return (pixel.b - pixel.r) / d + 2;
            case pixel.b:
              return (pixel.r - pixel.g) / d + 4;
          }
        })();
      h /= 6;
    }

    return {
      h: h,
      s: s,
      v: v,
    };
  }

  /**
   * (Converts an HSV color to an RGB pixel.)
   * 
   * @static
   * @param {HsvPixel} pixel (HSV pixel that needs to be converted to RGB space.)
   * @returns {RgbPixel} (RGB equivalent of the input pixel.)
   */
  public static toRgb(pixel: HsvPixel): RgbPixel {
      let i = Math.floor(pixel.h * 6);
      let f = pixel.h * 6 - i;
      let p = pixel.v * (1 - pixel.s);
      let q = pixel.v * (1 - f * pixel.s);
      let t = pixel.v * (1 - (1 - f) * pixel.s);

      let newPixel: RgbPixel;

      switch (i % 6) {
        case 0:
          newPixel.r = pixel.v;
          newPixel.g = t;
          newPixel.b = p;
          break;
        case 1:
          newPixel.r = q;
          newPixel.g = pixel.v;
          newPixel.b = p;
          break;
        case 2:
          newPixel.r = p;
          newPixel.g = pixel.v;
          newPixel.b = t;
          break;
        case 3:
          newPixel.r = p;
          newPixel.g = q;
          newPixel.b = pixel.v;
          break;
        case 4:
          newPixel.r = t;
          newPixel.g = p;
          newPixel.b = pixel.v;
          break;
        case 5:
          newPixel.r = pixel.v;
          newPixel.g = p;
          newPixel.b = q;
      }

      newPixel.r = Math.floor(newPixel.r * 255);
      newPixel.g = Math.floor(newPixel.g * 255);
      newPixel.b = Math.floor(newPixel.b * 255);

      return newPixel;
  }

  private static toByte(value: number) {
    return value > 255 ? 255 : value < 0 ? 0 : 255;
  }
}

export = PixelUtil;
