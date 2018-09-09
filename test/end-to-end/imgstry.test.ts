import Imgstry = require('../../dist/js/browser');

declare let imgstry: typeof Imgstry;
declare let callPhantom: (options: { screenshot: string }) => void;

const isPhantom = typeof this.callPhantom === 'function';
const isServer = document.location.protocol &&
  document.location.protocol.indexOf('http') !== -1;

let takeScreenshot = (test: Mocha.Test) => {
  if (isPhantom) {
    let testName = test.title.split(' ').join('-');
    let fileName = `reports/end-to-end/screenshots/${test.state}/${testName}-${test.speed}-${test.duration}ms`;
    callPhantom({
      screenshot: fileName,
    });
  }
};

type RenderMethod = keyof typeof RenderMethod;
const RenderMethod = {
  sync: 'sync' as 'sync',
  async: 'async' as 'async',
};

const render = async (processor: Imgstry, method: RenderMethod) => {
  switch (method) {
    case 'sync':
      return processor.renderSync();
    case 'async':
      return await processor.render();
  }
};

const renderers = ['sync'];

if (isServer) {
  renderers.push('async');
}

renderers.forEach((method: RenderMethod) => {
  if (!isServer) {
    describe('imgstry renderer async', () => {
      it(`use run npm watch to test the async methods`, () => {
        // Just a simple announcer.
      });
    });
  }

  describe(`imgstry renderer ${method}`, () => {
    let anchor = '#board';
    let board: HTMLCanvasElement;
    let processor: Imgstry;

    beforeEach(() => {
      board = imgstry.getCanvas(anchor);
      processor = new imgstry(board, {
        thread: {
          isDevelopment: true,
        },
      });
    });

    afterEach(function () {
      takeScreenshot(this.currentTest);
    });

    context('ctor', () => {
      it('should be able to fetch the canvas reference from the DOM', () => {
        board.should.be.not.empty;
      });

      it('should correctly populate the width and height properties', () => {
        processor.width.should.equal(500);
        processor.height.should.equal(500);
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

        channelSum.should.equal(0);
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
        (channelSum / pixelData.length * 4).should.equal(255);
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
        (channelSum / pixelData.length * 4).should.oneOf([127, 128]);
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

        (rgb.r / pixelData.length * 4).should.equal(236);
        (rgb.g / pixelData.length * 4).should.equal(214);
        (rgb.b / pixelData.length * 4).should.equal(198);
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
        (channelSum / pixelData.length * 4).should.equal(176);
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
        (channelSum / pixelData.length * 4).should.approximately(180, 1);
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
        channelSum.should.be.equal(true);
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
        (channelSum / pixelData.length * 4).should.approximately(202, 1);
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
        result.all.reduce((a: number, b: number) => a + b, 0).should.approximately(1, .00000001);
        result.channel.red.reduce((a: number, b: number) => a + b, 0).should.approximately(1, .00000001);
        result.channel.green.reduce((a: number, b: number) => a + b, 0).should.approximately(1, .00000001);
        result.channel.blue.reduce((a: number, b: number) => a + b, 0).should.approximately(1, .00000001);
      });
    });

    context('convolution', () => {
      context('edge detection', () => {
        it('should have 98.% percent of pixels black after detection', (done) => {
          const image = new Image();
          image.onload = async () => {
            try {
              processor
                .context
                .drawImage(image, 0, 0);

              let pixelData = processor.imageData.data;
              let initialAlpha = 0;
              for (let i = 0; i < pixelData.length; i += 4) {
                initialAlpha += pixelData[i + 3];
              }

              await render(
                processor
                  .convolve(imgstry.Utility.EdgeDetection()),
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
              (channelSum / pixelData.length).should
                .approximately(0, 1.51);
              alpha.should.equal(initialAlpha, 'the alpha channel was mutated by the convolution');
            } catch (e) {
              return done(e);
            }

            done();
          };
          image.src = 'resources/rnm.jpg';
        });
      });

      context('gaussian blur', () => {
        it('should have 99.8% of pixels black after applying a 9x9 kernel and edge detection', (done) => {
          const image = new Image();
          image.onload = async () => {
            try {
              processor.context.drawImage(image, 0, 0);

              await render(
                processor
                  .convolve(imgstry.Utility.GaussianBlur(9, 100))
                  .convolve(imgstry.Utility.EdgeDetection()),
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
              (channelSum / pixelData.length).should
                .approximately(0, .2);
            } catch (e) {
              return done(e);
            }

            done();
          };
          image.src = 'resources/rnm.jpg';
        });
      });
    });
  });
});

