import {
  Hex,
  IRgb,
  Rgb,
} from '~pixel';

export
/**
 * A collection of atomic operations used by the processor.
 *
 * @ignore
 */
namespace Operation {
  export const DEFAULT = {
    blackAndWhite: {
      ratio: [.3, .59, .11] as [number, number, number],
    },
    rgb: {
      max: 255,
      min: 0,
    },
  };

  const _generateLut = <T = number>(delegate: (i: number) => T): Record<number, T> => {
    const lut: T[] = [];
    for (let i = DEFAULT.rgb.min; i <= DEFAULT.rgb.max; i++) {
      lut[i] = delegate(i);
    }
    return lut;
  };

  export const lookup = (lut: Record<number, number>) => {
    return (pixel: Rgb) => {
      pixel = pixel.clamp();
      pixel.r = lut[pixel.r];
      pixel.g = lut[pixel.g];
      pixel.b = lut[pixel.b];
      return pixel;
    };
  };

  export const hue = (value: number) => {
    return (pixel: Rgb) => {
      let hsv = pixel.clamp().toHsv();
      hsv.h += value;
      return hsv.toRgb();
    };
  };


  const _sepiaRChannel = (pixel: Rgb, value: number) =>
    (pixel.r *
      (1 - .607 * value)) +
    (pixel.g *
      (.769 * value)) +
    (pixel.b *
      (.189 * value));

  const _sepiaGChannel = (pixel: Rgb, value: number) =>
    (pixel.r *
      (.349 * value)) +
    (pixel.g *
      (1 - .314 * value)) +
    (pixel.b *
      (.168 * value)
    );

  const _sepiaBChannel = (pixel: Rgb, value: number) =>
    (pixel.r *
      (.272 * value)) +
    (pixel.g *
      (.534 * value)) +
    (pixel.b * (
      1 - .869 * value));

  export const sepia = (value: number) => {
    if (!value) {
      value = 100;
    }
    value /= 100;
    return (pixel: Rgb) => {
      pixel = pixel.clamp();

      pixel.r = _sepiaRChannel(pixel, value);
      pixel.g = _sepiaGChannel(pixel, value);
      pixel.b = _sepiaBChannel(pixel, value);

      return pixel;
    };
  };

  export const gamma = (value: number) => {
    if (value >= 0) {
      value = 1 - (value / 100);
    } else {
      value /= -10;
    }

    const lut = _generateLut((i) => {
      return Math.pow(i / DEFAULT.rgb.max, value) * DEFAULT.rgb.max;
    });

    return (pixel: Rgb) => lookup(lut)(pixel);
  };

  export const noise = (value: number) => {
    return (pixel: Rgb) => {
      pixel = pixel.clamp();
      let random = Math.random() * value * (DEFAULT.rgb.max / 100);
      random = (Math.random() > .5 ? -random : random);

      pixel.r += random;
      pixel.b += random;
      pixel.g += random;

      return pixel;
    };
  };

  export const vibrance = (value: number) => {
    value *= -1;

    return (pixel: Rgb) => {
      pixel = pixel.clamp();
      let amount: number;
      let average: number;
      let max: number;

      max = Math.max(pixel.r, pixel.g, pixel.b);
      average = (pixel.r + pixel.g + pixel.b) / 3;
      amount = ((Math.abs(max - average) * 2 / DEFAULT.rgb.max) * value) / 100;

      pixel.r += (max - pixel.r) * amount;
      pixel.g += (max - pixel.g) * amount;
      pixel.b += (max - pixel.b) * amount;

      return pixel;
    };
  };

  export const invert = () => {
    return (pixel: Rgb) => {
      pixel = pixel.clamp();
      pixel.r ^= DEFAULT.rgb.max;
      pixel.g ^= DEFAULT.rgb.max;
      pixel.b ^= DEFAULT.rgb.max;

      return pixel;
    };
  };

  const _tintOffset = (pixelChannel: number, tintChannel: number) =>
    (DEFAULT.rgb.max - pixelChannel) *
    (tintChannel / DEFAULT.rgb.max);

  export const tint = (color: string) => {
    let rgb = new Hex(color).toRgb();

    return (pixel: Rgb) => {
      pixel = pixel.clamp();
      pixel.r = pixel.r + _tintOffset(pixel.r, rgb.r);
      pixel.g = pixel.g + _tintOffset(pixel.g, rgb.g);
      pixel.b = pixel.b + _tintOffset(pixel.b, rgb.b);

      return pixel;
    };
  };

  export const fill = (color: string) => {
    let rgb = new Hex(color).toRgb();

    return () => {
      return rgb;
    };
  };

  export const blackAndWhite = ([rRatio, gRatio, bRatio]: [number, number, number] = DEFAULT.blackAndWhite.ratio) => {
    if (rRatio + gRatio + bRatio !== 1) {
      [rRatio, gRatio, bRatio] = DEFAULT.blackAndWhite.ratio;
    }

    const lut = _generateLut<IRgb>((i) => ({
      r: i * rRatio,
      g: i * gRatio,
      b: i * bRatio,
    }));

    return (pixel: Rgb) => {
      pixel = pixel.clamp();
      let bwValue = lut[pixel.r].r + lut[pixel.g].g + lut[pixel.b].b;

      pixel.r = bwValue;
      pixel.g = bwValue;
      pixel.b = bwValue;

      return pixel;
    };
  };

  export const contrast = (value: number) => {
    if (value < 0) {
      value /= 10;
    }

    value = Math.pow((value + 100) / 100, 2);

    const lut = _generateLut((i) => {
      i /= DEFAULT.rgb.max;
      i -= .5;
      i *= value;
      i += .5;
      i *= DEFAULT.rgb.max;

      return i;
    });

    return (pixel: Rgb) => lookup(lut)(pixel);
  };

  export const brightness = (value: number) => {
    value = Math.floor(DEFAULT.rgb.max * (value / 100));

    const lut = _generateLut((i) => i += value);

    return (pixel: Rgb) => lookup(lut)(pixel);
  };

  export const saturation = (value: number) => {
    value *= -.01;

    const lut = _generateLut((i) => {
      return i * value;
    });

    return (pixel: Rgb) => {
      pixel = pixel.clamp();

      let max = Math.max(pixel.r, pixel.g, pixel.b);

      pixel.r += lut[max - pixel.r];
      pixel.g += lut[max - pixel.g];
      pixel.b += lut[max - pixel.b];

      return pixel;
    };
  };
}
