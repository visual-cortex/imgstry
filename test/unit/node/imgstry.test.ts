import { expect } from 'chai';
import { COLOR_MAP } from 'test/color';
import {
  EdgeDetection,
  GaussianBlur,
} from '~kernel';
import {
  Hex,
  Rgb,
} from '~pixel';
import { Imgstry } from '~platform/node';

const IMAGE_SOURCE = './test/resources/rnm.jpg';

describe('class: Imgstry (node)', () => {
  const size = 100;
  let processor: Imgstry;

  beforeEach(() => {
    processor = new Imgstry(size, size);
  });

  it('should be able construct the editor', () => {
    expect(processor).not.equal(undefined);
  });

  it('should correctly populate the width and height properties', () => {
    expect(processor.width).equal(size);
    expect(processor.height).equal(size);
  });

  it('should have all pixels black when constructed', () => {
    let pixelData = processor.imageData.data;

    let channelSum = 0;
    for (let i = 0; i < pixelData.length; i += 4) {
      let rgb = {
        r: pixelData[i],
        g: pixelData[i + 1],
        b: pixelData[i + 2],
      };

      channelSum += (rgb.r + rgb.b + rgb.g) / 3;
    }

    expect(channelSum).equal(0);
  });

  it('should clone the image data', () => {
    processor
      .fill('#8A4F3D')
      .renderSync();

    const original = processor.imageData;
    const cloned = processor.clone(processor.imageData);

    expect(cloned).to.not.equal(processor.imageData);

    original.data.forEach((value, idx) => {
      expect(value).to.equal(cloned.data[idx]);
    });
  });

  context('invert', () => {
    it('should have all pixels white if invert is applied', () => {
      processor.invert().renderSync();
      let pixelData = processor.imageData.data;

      let channelSum = 0;
      for (let i = 0; i < pixelData.length; i += 4) {
        let rgb = {
          r: pixelData[i],
          g: pixelData[i + 1],
          b: pixelData[i + 2],
        };

        channelSum += (rgb.r + rgb.b + rgb.g) / 3;
      }
      expect(channelSum / pixelData.length * 4).equal(255);
    });
  });

  context('brightness', () => {
    it('should have all pixels neutral gray if brigthness is set to 50', () => {
      processor
        .brightness(50).renderSync();

      let pixelData = processor.imageData.data;

      let channelSum = 0;
      for (let i = 0; i < pixelData.length; i += 4) {
        let rgb = {
          r: pixelData[i],
          g: pixelData[i + 1],
          b: pixelData[i + 2],
        };

        channelSum += (rgb.r + rgb.b + rgb.g) / 3;
      }
      expect(channelSum / pixelData.length * 4).oneOf([127, 128]);
    });
  });

  context('sepia', () => {
    it('should apply sepia to #c0392b', () => {
      processor.brightness(50)
        .tint('#c0392b')
        .sepia(100)
        .renderSync();

      let pixelData = processor.imageData.data;
      let rgb = { r: 0, g: 0, b: 0 };

      for (let i = 0; i < pixelData.length; i += 4) {
        rgb.r += pixelData[i];
        rgb.g += pixelData[i + 1];
        rgb.b += pixelData[i + 2];
      }

      expect(rgb.r / pixelData.length * 4).equal(236);
      expect(rgb.g / pixelData.length * 4).equal(214);
      expect(rgb.b / pixelData.length * 4).equal(198);
    });
  });

  context('tint', () => {
    it('should apply pomegranate to neutral grey', () => {

      processor
        .brightness(50)
        .tint('#c0392b').renderSync();

      let pixelData = processor.imageData.data;

      let channelSum = 0;
      for (let i = 0; i < pixelData.length; i += 4) {
        let rgb = {
          r: pixelData[i],
          g: pixelData[i + 1],
          b: pixelData[i + 2],
        };

        channelSum += (rgb.r + rgb.b + rgb.g) / 3;
      }
      expect(channelSum / pixelData.length * 4).equal(176);
    });

    it('should apply green sea to neutral grey', () => {

      processor
        .brightness(50)
        .tint('#16a085').renderSync();

      let pixelData = processor.imageData.data;

      let channelSum = 0;
      for (let i = 0; i < pixelData.length; i += 4) {
        let rgb = {
          r: pixelData[i],
          g: pixelData[i + 1],
          b: pixelData[i + 2],
        };

        channelSum += (rgb.r + rgb.b + rgb.g) / 3;
      }
      expect(channelSum / pixelData.length * 4).approximately(180, 1);
    });
  });

  context('black and white', () => {
    it('should have the same value on all channels', () => {

      processor.brightness(50)
        .tint('#16a085')
        .blackAndWhite()
        .renderSync();

      let pixelData = processor.imageData.data;

      let channelSum = true;
      for (let i = 0; i < pixelData.length; i += 4) {
        let rgb = {
          r: pixelData[i],
          g: pixelData[i + 1],
          b: pixelData[i + 2],
        };

        channelSum = channelSum &&
          rgb.r ===
          rgb.b &&
          rgb.b ===
          rgb.g &&
          rgb.r !== 0;
      }
      expect(channelSum).equal(true);
    });
  });

  context('contrast', () => {
    it('should increase color intensity', () => {

      processor
        .brightness(50)
        .tint('#16a085')
        .contrast(20).renderSync();

      let pixelData = processor.imageData.data;

      let channelSum = 0;
      for (let i = 0; i < pixelData.length; i += 4) {
        let rgb = {
          r: pixelData[i],
          g: pixelData[i + 1],
          b: pixelData[i + 2],
        };

        channelSum += (rgb.r + rgb.b + rgb.g) / 3;
      }
      expect(channelSum / pixelData.length * 4).approximately(202, 1);
    });
  });

  context('histogram', () => {
    it('should have sum of channel color distribution equal to 1', async () => {
      processor
        .brightness(15)
        .noise(25)
        .tint('#16a085')
        .renderSync();

      const result = processor.histogram;
      const sum = (arr: number[]) =>
        arr.reduce((a: number, b: number) => a + b, 0);
      expect(sum(result.all)).approximately(1, 1e-7);
      expect(sum(result.channel.red)).approximately(1, 1e-7);
      expect(sum(result.channel.green)).approximately(1, 1e-7);
      expect(sum(result.channel.blue)).approximately(1, 1e-7);
    });

    Object.keys(COLOR_MAP).map(key => ({
      name: key,
      color: new Rgb(COLOR_MAP[key].rgb).toHex().value,
    })).forEach((hex) => {
      it(`should have spikes for ${hex.name}`, async () => {
        const rgb = new Hex(hex.color).toRgb();
        const mean = Math.floor((rgb.r + rgb.g + rgb.b) / 3);

        processor
          .fill(hex.color)
          .renderSync();

        const result = processor.histogram;

        expect(result.all[mean]).approximately(1, 1e-7);
        expect(result.channel.red[rgb.r]).approximately(1, 1e-7);
        expect(result.channel.green[rgb.g]).approximately(1, 1e-7);
        expect(result.channel.blue[rgb.b]).approximately(1, 1e-7);
      });
    });
  });

  context('convolution', () => {
    context('edge detection', () => {
      it('should have 98.5% percent of pixels black after detection', async () => {
        const image = await Imgstry.loadImage(IMAGE_SOURCE);

        processor
          .drawImage(image);

        let pixelData = processor.imageData.data;
        let initialAlpha = 0;

        for (let i = 0; i < pixelData.length; i += 4) {
          initialAlpha += pixelData[i + 3];
        }

        processor
          .convolve(EdgeDetection())
          .renderSync();

        pixelData = processor.imageData.data;

        let channelSum = 0;
        let alpha = 0;

        for (let i = 0; i < pixelData.length; i += 4) {
          let rgb = {
            r: pixelData[i],
            g: pixelData[i + 1],
            b: pixelData[i + 2],
            a: pixelData[i + 3],
          };

          alpha += rgb.a;
          channelSum += (rgb.r + rgb.b + rgb.g) / 3;
        }

        expect(channelSum / pixelData.length)
          .approximately(0, 1.51);

        expect(alpha)
          .equal(initialAlpha, 'the alpha channel was mutated by the convolution');
      });
    });

    context('gaussian blur', () => {
      it('should have 99.5% of pixels black after applying a 9x9 kernel and edge detection', async () => {

        const image = await Imgstry.loadImage(IMAGE_SOURCE);

        processor.context.drawImage(image, 0, 0);

        processor
          .convolve(GaussianBlur(9, 100))
          .convolve(EdgeDetection())
          .renderSync();

        let channelSum = 0;
        let pixelData = processor.imageData.data;
        for (let i = 0; i < pixelData.length; i += 4) {
          let rgb = {
            r: pixelData[i],
            g: pixelData[i + 1],
            b: pixelData[i + 2],
            a: pixelData[i + 3],
          };

          channelSum += (rgb.r + rgb.b + rgb.g) / 3;
        }
        expect(channelSum / pixelData.length)
          .approximately(0, .5);
      });
    });

    context('reset', () => {
      it('should set original image state', async () => {
        const image = await Imgstry.loadImage(IMAGE_SOURCE);

        processor.drawImage(image);

        const original = processor.clone(processor.imageData);

        processor
          .contrast(100)
          .renderSync()
          .reset();

        expect(processor.imageData.width).to.equal(original.width);
        expect(processor.imageData.height).to.equal(original.height);

        processor.imageData.data.forEach((value, idx) => {
          expect(value).to.equal(original.data[idx]);
        });
      });
    });

    context('base64 conversion', () => {
      it('should serialize canvas data png data uri', async () => {
        const image = await Imgstry.loadImage(IMAGE_SOURCE);

        processor.drawImage(image);

        const dataUri = processor.toDataUrl();

        const dataUriRegex = /^(data:)([\w\/\+]+);(charset=[\w-]+|base64).*,(.*)/gi;

        expect(dataUri).to.match(dataUriRegex);
      });
    });
  });
});
