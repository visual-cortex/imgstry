import {
  expect,
  spy,
} from 'chai';
import { take } from 'rxjs/operators';
import { COLOR_MAP } from 'test/color';
import { ImgstryEditor } from '~core';
import {
  EdgeDetection,
  GaussianBlur,
} from '~kernel';
import {
  Hex,
  Rgb,
} from '~pixel';
import { Imgstry } from '~platform/browser';

const isServer = document.location.protocol &&
  document.location.protocol.indexOf('http') !== -1;

// FIXME: Take Screenshot with Headless Chrome ?
let takeScreenshot = (_: Mocha.Test) => { return; };

type RenderMethod = keyof typeof RenderMethod;
const RenderMethod = {
  sync: 'sync' as 'sync',
  async: 'async' as 'async',
};

const IMAGE_SOURCE = 'resources/rnm.jpg';

const render = async (processor: ImgstryEditor, method: RenderMethod): Promise<ImgstryEditor> => {
  switch (method) {
    case 'sync':
      return new Promise((res) => { processor.renderSync(); res(processor); });
    case 'async':
      return await processor.render();
  }
};

const wait = async (timeout: number) =>
  new Promise((res) => setTimeout(() => res(), timeout));

const renderers: RenderMethod[] = ['sync'];

if (isServer) {
  renderers.push('async');
}

describe('class: Imgstry (browser)', () => {
  let processor: Imgstry;
  let anchor = '#board';
  let board: HTMLCanvasElement;
  let test: Mocha.Test;

  beforeEach(function () {
    test = this.currentTest!;
    test.timeout(10000);
    board = Imgstry.getCanvas(anchor);
    processor = new Imgstry(board, {
      thread: {
        isDebugEnabled: true,
      },
    });
  });

  afterEach(function () {
    takeScreenshot(this.currentTest!);
  });

  renderers.forEach((method: RenderMethod) => {
    if (!isServer) {
      context('renderer async', () => {
        it(`use run npm watch to test the async methods`, () => {
          // Just a simple announcer.
        });
      });
    }

    context(`renderer ${method}`, () => {
      context('ctor', () => {
        it('should be able to fetch the canvas reference from the DOM', () => {
          expect(board).not.null;
        });

        it('should correctly populate the width and height properties', () => {
          expect(processor.width).equal(500);
          expect(processor.height).equal(500);
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
      });

      context('invert', () => {
        it('should have all pixels white if invert is applied', async () => {
          await render(
            processor
              .invert(),
            method,
          );
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
        it('should have all pixels neutral gray if brigthness is set to 50', async () => {
          await render(
            processor
              .brightness(50),
            method,
          );
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
        it('should apply sepia to #c0392b', async () => {
          await render(
            processor.brightness(50)
              .tint('#c0392b')
              .sepia(100),
            method,
          );

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
        it('should apply pomegranate to neutral grey', async () => {
          await render(
            processor
              .brightness(50)
              .tint('#c0392b'),
            method,
          );
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

        it('should apply green sea to neutral grey', async () => {
          await render(
            processor
              .brightness(50)
              .tint('#16a085'),
            method,
          );
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
        it('should have the same value on all channels', async () => {
          await render(
            processor.brightness(50)
              .tint('#16a085')
              .blackAndWhite(),
            method,
          );
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
        it('should increase color intensity', async () => {
          await render(
            processor
              .brightness(50)
              .tint('#16a085')
              .contrast(20),
            method,
          );
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
          await render(
            processor
              .brightness(15)
              .noise(25)
              .tint('#16a085'),
            method,
          );
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
        }))
          .forEach((hex) => {
            it(`should have spikes for ${hex.name}`, async () => {
              const rgb = new Hex(hex.color).toRgb();
              const mean = Math.floor((rgb.r + rgb.g + rgb.b) / 3);
              await render(
                processor
                  .fill(hex.color),
                method,
              );
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
          it('should have 98.% percent of pixels black after detection', async () => {
            const image = await Imgstry.loadImage(IMAGE_SOURCE);

            processor
              .drawImage(image);

            let pixelData = processor.imageData.data;
            let initialAlpha = 0;
            for (let i = 0; i < pixelData.length; i += 4) {
              initialAlpha += pixelData[i + 3];
            }

            await render(
              processor
                .convolve(EdgeDetection()),
              method,
            );


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
            expect(alpha).equal(initialAlpha, 'the alpha channel was mutated by the convolution');
          });
        });

        context('gaussian blur', () => {
          it('should have 99.8% of pixels black after applying a 9x9 kernel and edge detection', async () => {
            const image = await Imgstry.loadImage(IMAGE_SOURCE);

            processor.drawImage(image);

            await render(
              processor
                .convolve(GaussianBlur(9, 100))
                .convolve(EdgeDetection()),
              method,
            );

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
              .approximately(0, .2);
          });
        });

        context('render', () => {
          it('should render multiple without locking the image buffer', async () => {
            const image = await Imgstry.loadImage(IMAGE_SOURCE);

            processor.drawImage(image);

            await render(
              processor
                .brightness(20),
              method,
            );

            await render(
              processor
                .contrast(10),
              method,
            );

            await render(
              processor
                .contrast(35),
              method,
            );

            await render(
              processor
                .contrast(200),
              method,
            );
          });
        });
      });
    });
  });

  context('reset', () => {
    it('should set original image state', async () => {
      const image = await Imgstry.loadImage(IMAGE_SOURCE);

      processor.drawImage(image);

      const original = processor.clone(processor.imageData);

      processor
        .contrast(100)
        .renderSync();

      processor.reset();

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

  context('event: draw -> histogram', () => {
    it('should emit after an operation is performed (async)', async () => {
      const image = await Imgstry.loadImage(IMAGE_SOURCE);

      const before = await processor.histogram$.pipe(take(1)).toPromise();

      processor.drawImage(image);
      processor.contrast(100);

      await processor.contrast(25).render('current');

      const after = await processor.histogram$.pipe(take(1)).toPromise();

      expect(before).to.not.deep.equal(after);
    });

    it('should emit after an operation is performed (sync)', async () => {
      const image = await Imgstry.loadImage(IMAGE_SOURCE);

      const before = await processor.histogram$.pipe(take(1)).toPromise();

      processor.drawImage(image);
      processor.contrast(100);

      processor.contrast(25).renderSync('current');

      const after = await processor.histogram$.pipe(take(1)).toPromise();

      expect(before).to.not.deep.equal(after);
    });

    it('should emit after resetting to the original (sync)', async () => {
      const image = await Imgstry.loadImage(IMAGE_SOURCE);


      processor.drawImage(image);
      const before = await processor.histogram$.pipe(take(1)).toPromise();

      processor.contrast(100);
      processor.contrast(25).renderSync('current');

      processor.reset();
      const after = await processor.histogram$.pipe(take(1)).toPromise();

      expect(before).to.deep.equal(after);
    });

    it('should emit after an image is drawn', async () => {
      const image = await Imgstry.loadImage(IMAGE_SOURCE);

      processor.drawImage(image);

      const after = await processor.histogram$.pipe(take(1)).toPromise();

      expect(after.all.reduce((acc, curr) => acc += curr, 0)).to.not.equal(0);
      expect(after.channel.red.reduce((acc, curr) => acc += curr, 0)).to.not.equal(0);
      expect(after.channel.green.reduce((acc, curr) => acc += curr, 0)).to.not.equal(0);
      expect(after.channel.blue.reduce((acc, curr) => acc += curr, 0)).to.not.equal(0);
    });
  });
});

