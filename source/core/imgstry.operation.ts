import {
  Hex,
  Rgb,
} from '~pixel';

export
/**
 * A collection of atomic operations used by the processor.
 *
 * @ignore
 */
namespace Operation {
  const Default = {
    blackAndWhite: {
      ratio: [.3, .59, .11] as [number, number, number],
    },
    rgb: {
      max: 255,
      min: 0,
    },
  };

  const _lookup = (delegate: (i: number) => number): number[] => {
    const arr: any[] = [];
    for (let i = Default.rgb.min; i <= Default.rgb.max; i++) {
      arr[i] = delegate(i);
    }
    return arr;
  };

  export const hue = (value: number) => {
    value *= .5;

    return (pixel: Rgb) => {
      let hsv = pixel.toHsv();

      hsv.h += Math.abs(value);

      return hsv.toRgb();
    };
  };

  export const sepia = (value: number) => {
    if (!value) {
      value = 100;
    }
    value /= 100;
    return (pixel: Rgb) => {
      pixel.r =
        (pixel.r *
          (1 - .607 * value)) +
        (pixel.g *
          (.769 * value)) +
        (pixel.b *
          (.189 * value));
      pixel.g =
        (pixel.r *
          (.349 * value)) +
        (pixel.g *
          (1 - .314 * value)) +
        (pixel.b *
          (.168 * value)
        );
      pixel.b =
        (pixel.r *
          (.272 * value)) +
        (pixel.g *
          (.534 * value)) +
        (pixel.b * (
          1 - .869 * value));

      return pixel;
    };
  };

  export const gamma = (value: number) => {
    if (value >= 0) {
      value = 1 - (value / 100);
    } else {
      value /= -10;
    }

    const lookup = _lookup((i) => {
      return Math.pow(i / Default.rgb.max, value) * Default.rgb.max;
    });

    return (pixel: Rgb) => {
      pixel = pixel.clamp();

      pixel.r = lookup[pixel.r];
      pixel.g = lookup[pixel.g];
      pixel.b = lookup[pixel.b];

      return pixel;
    };
  };

  export const noise = (value: number) => {
    return (pixel: Rgb) => {
      let random = Math.random() * value * (Default.rgb.max / 100);
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
      let amount: number;
      let average: number;
      let max: number;

      max = Math.max(pixel.r, pixel.g, pixel.b);
      average = (pixel.r + pixel.g + pixel.b) / 3;
      amount = ((Math.abs(max - average) * 2 / Default.rgb.max) * value) / 100;

      pixel.r += (max - pixel.r) * amount;
      pixel.g += (max - pixel.g) * amount;
      pixel.b += (max - pixel.b) * amount;

      return pixel;
    };
  };

  export const invert = () => {
    return (pixel: Rgb) => {
      pixel.r ^= Default.rgb.max;
      pixel.g ^= Default.rgb.max;
      pixel.b ^= Default.rgb.max;

      return pixel;
    };
  };

  export const tint = (color: string) => {
    let rgb = new Hex(color).toRgb();

    return (pixel: Rgb) => {
      pixel.r = pixel.r + (Default.rgb.max - pixel.r) * (rgb.r / Default.rgb.max);
      pixel.g = pixel.g + (Default.rgb.max - pixel.g) * (rgb.g / Default.rgb.max);
      pixel.b = pixel.b + (Default.rgb.max - pixel.b) * (rgb.b / Default.rgb.max);

      return pixel;
    };
  };

  export const fill = (color: string) => {
    let rgb = new Hex(color).toRgb();

    return () => {
      return rgb;
    };
  };

  export const blackAndWhite = ([rRatio, gRatio, bRatio]: [number, number, number] = Default.blackAndWhite.ratio) => {
    if (rRatio + gRatio + bRatio !== 1) {
      [rRatio, gRatio, bRatio] = Default.blackAndWhite.ratio;
    }

    return (pixel: Rgb) => {
      let bwValue = rRatio * pixel.r + gRatio * pixel.g + bRatio * pixel.b;

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

    const lookup = _lookup((i) => {
      i /= Default.rgb.max;
      i -= .5;
      i *= value;
      i += .5;
      i *= Default.rgb.max;

      return i;
    });

    return (pixel: Rgb) => {
      pixel = pixel.clamp();

      pixel.r = lookup[pixel.r];
      pixel.g = lookup[pixel.g];
      pixel.b = lookup[pixel.b];

      return pixel;
    };
  };

  export const brightness = (value: number) => {
    value = Math.floor(Default.rgb.max * (value / 100));

    return (pixel: Rgb) => {
      pixel.r += value;
      pixel.g += value;
      pixel.b += value;

      return pixel;
    };
  };

  export const saturation = (value: number) => {
    value *= -.01;

    const lookup = _lookup((i) => {
      return i * value;
    });

    return (pixel: Rgb) => {
      let max = Math.max(pixel.r, pixel.g, pixel.b);
      pixel = pixel.clamp();

      pixel.r += lookup[max - pixel.r];
      pixel.g += lookup[max - pixel.g];
      pixel.b += lookup[max - pixel.b];

      return pixel;
    };
  };
}
