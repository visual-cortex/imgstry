import Imgstry = require('../../dist/js/browser');

declare let imgstry: typeof Imgstry;
declare let callPhantom: (options: { screenshot: string }) => void;

const GREY_MAP = [{
  name: 'dark grey',
  index: {
    r: 64,
    g: 64,
    b: 64,
  },
}, {
  name: 'neutral grey',
  index: {
    r: 128,
    g: 128,
    b: 128,
  },
}, {
  name: 'light grey',
  index: {
    r: 192,
    g: 192,
    b: 192,
  },
}, {
  name: 'white',
  index: {
    r: 255,
    g: 255,
    b: 255,
  },
}, {
  name: 'black',
  index: {
    r: 0,
    g: 0,
    b: 0,
  },
}];

const HEX_MAP = [
  {
    name: 'Fantasy',
    color: '#f9ebea',
  },
  {
    name: 'Vanilla Ice',
    color: '#f2d7d5',
  },
  {
    name: 'Shilo',
    color: '#e6b0aa',
  },
  {
    name: 'New York Pink',
    color: '#d98880',
  },
  {
    name: 'Tall Poppy',
    color: '#c0392b',
  },
  {
    name: 'Mexican Red',
    color: '#a93226',
  },
  {
    name: 'Old Brick',
    color: '#922b21',
  },
  {
    name: 'Mocha',
    color: '#7b241c',
  },
  {
    name: 'Cherrywood',
    color: '#641e16',
  },
  {
    name: 'Provincial Pink',
    color: '#fdedec',
  },
  {
    name: 'Azalea',
    color: '#fadbd8',
  },
  {
    name: 'Mandys Pink',
    color: '#f5b7b1',
  },
  {
    name: 'Burnt Sienna',
    color: '#ec7063',
  },
  {
    name: 'Cinnabar',
    color: '#e74c3c',
  },
  {
    name: 'Flush Mahogany',
    color: '#cb4335',
  },
  {
    name: 'Well Read',
    color: '#b03a2e',
  },
  {
    name: 'Burnt Umber',
    color: '#943126',
  },
  {
    name: 'Metallic Copper',
    color: '#78281f',
  },
  {
    name: 'White Lilac',
    color: '#f5eef8',
  },
  {
    name: 'Light Wisteria',
    color: '#c39bd3',
  },
  {
    name: 'Whisper',
    color: '#f4ecf7',
  },
  {
    name: 'Studio',
    color: '#8e44ad',
  },
  {
    name: 'Vivid Violet',
    color: '#7d3c98',
  },
  {
    name: 'Black Squeeze',
    color: '#eaf2f8',
  },
  {
    name: 'Link Water',
    color: '#d4e6f1',
  },
  {
    name: 'Regent St Blue',
    color: '#a9cce3',
  },
  {
    name: 'Half Baked',
    color: '#7fb3d5',
  },
  {
    name: 'Danube',
    color: '#5499c7',
  },
  {
    name: 'Matisse',
    color: '#1f618d',
  },
  {
    name: 'Biscay',
    color: '#154360',
  },
  {
    name: 'Polar',
    color: '#ebf5fb',
  },
  {
    name: 'Humming Bird',
    color: '#d6eaf8',
  },
  {
    name: 'Blizzard Blue',
    color: '#aed6f1',
  },
  {
    name: 'Seagull',
    color: '#85c1e9',
  },
  {
    name: 'Picton Blue',
    color: '#5dade2',
  },
  {
    name: 'Curious Blue',
    color: '#3498db',
  },
  {
    name: 'Aqua Spring',
    color: '#e8f8f5',
  },
  {
    name: 'Iceberg',
    color: '#d1f2eb',
  },
  {
    name: 'Morning Glory',
    color: '#a3e4d7',
  },
  {
    name: 'Bermuda',
    color: '#76d7c4',
  },
  {
    name: 'Puerto Rico',
    color: '#48c9b0',
  },
  {
    name: 'Aqua Squeeze',
    color: '#e8f6f3',
  },
  {
    name: 'Swans Down',
    color: '#d0ece7',
  },
  {
    name: 'Sinbad',
    color: '#a2d9ce',
  },
  {
    name: 'Monte Carlo',
    color: '#73c6b6',
  },
  {
    name: 'Keppel',
    color: '#45b39d',
  },
  {
    name: 'Deep Sea Green',
    color: '#0b5345',
  },
  {
    name: 'Narvik',
    color: '#e9f7ef',
  },
  {
    name: 'Apple Green',
    color: '#d4efdf',
  },
  {
    name: 'Fringy Flower',
    color: '#a9dfbf',
  },
  {
    name: 'Vista Blue',
    color: '#7dcea0',
  },
  {
    name: 'Parsley',
    color: '#145a32',
  },
  {
    name: 'Off Green',
    color: '#eafaf1',
  },
  {
    name: 'Granny Apple',
    color: '#d5f5e3',
  },
  {
    name: 'Madang',
    color: '#abebc6',
  },
  {
    name: 'Algae Green',
    color: '#82e0aa',
  },
  {
    name: 'Shamrock',
    color: '#2ecc71',
  },
  {
    name: 'Off Yellow',
    color: '#fef9e7',
  },
  {
    name: 'Double Pearl Lusta',
    color: '#fcf3cf',
  },
  {
    name: 'Marzipan',
    color: '#f9e79f',
  },
  {
    name: 'Portica',
    color: '#f7dc6f',
  },
  {
    name: 'Saffron',
    color: '#f4d03f',
  },
  {
    name: 'Galliano',
    color: '#d4ac0d',
  },
  {
    name: 'Hot Toddy',
    color: '#b7950b',
  },
  {
    name: 'Yukon Gold',
    color: '#7d6608',
  },
  {
    name: 'Solitaire',
    color: '#fef5e7',
  },
  {
    name: 'Oasis',
    color: '#fdebd0',
  },
  {
    name: 'Corvette',
    color: '#fad7a0',
  },
  {
    name: 'Rajah',
    color: '#f8c471',
  },
  {
    name: 'Casablanca',
    color: '#f5b041',
  },
  {
    name: 'Meteor',
    color: '#d68910',
  },
  {
    name: 'Pumpkin Skin',
    color: '#b9770e',
  },
  {
    name: 'Rusty Nail',
    color: '#7e5109',
  },
  {
    name: 'Old Lace',
    color: '#fdf2e9',
  },
  {
    name: 'Champagne',
    color: '#fae5d3',
  },
  {
    name: 'Maize',
    color: '#f5cba7',
  },
  {
    name: 'Tacao',
    color: '#f0b27a',
  },
  {
    name: 'Jaffa',
    color: '#eb984e',
  },
  {
    name: 'Zest',
    color: '#e67e22',
  },
  {
    name: 'Hot Cinnamon',
    color: '#ca6f1e',
  },
  {
    name: 'Reno Sand',
    color: '#af601a',
  },
  {
    name: 'Hawaiian Tan',
    color: '#935116',
  },
  {
    name: 'Raw Umber',
    color: '#784212',
  },
  {
    name: 'Linen',
    color: '#fbeee6',
  },
  {
    name: 'Albescent White',
    color: '#f6ddcc',
  },
  {
    name: 'Gold Sand',
    color: '#edbb99',
  },
  {
    name: 'Red Damask',
    color: '#dc7633',
  },
  {
    name: 'Burnt Orange',
    color: '#d35400',
  },
  {
    name: 'Rose of Sharon',
    color: '#ba4a00',
  },
  {
    name: 'Oregon',
    color: '#a04000',
  },
  {
    name: 'Peru Tan',
    color: '#873600',
  },
  {
    name: 'Nutmeg Wood Finish',
    color: '#6e2c00',
  },
  {
    name: 'Catskill White',
    color: '#fdfefe',
  },
  {
    name: 'Rolling Stone',
    color: '#797d7f',
  },
  {
    name: 'Submarine',
    color: '#bfc9ca',
  },
  {
    name: 'Tower Gray',
    color: '#aab7b8',
  },
  {
    name: 'Cascade',
    color: '#95a5a6',
  },
  {
    name: 'Corduroy',
    color: '#5f6a6a',
  },
  {
    name: 'Edward',
    color: '#99a3a4',
  },
  {
    name: 'Nandor',
    color: '#515a5a',
  },
  {
    name: 'Cadet Blue',
    color: '#aeb6bf',
  },
  {
    name: 'Froly',
    color: '#F08080',
  },
  {
    name: 'Salmon',
    color: '#FA8072',
  },
  {
    name: 'Vivid Tangerine',
    color: '#FFA07A',
  },
  {
    name: 'White',
    color: '#FFFFFF',
  },
  {
    name: 'Silver',
    color: '#C0C0C0',
  },
  {
    name: 'Gray',
    color: '#808080',
  },
  {
    name: 'Black',
    color: '#000000',
  },
  {
    name: 'Red',
    color: '#FF0000',
  },
  {
    name: 'Maroon',
    color: '#800000',
  },
  {
    name: 'Yellow',
    color: '#FFFF00',
  },
  {
    name: 'Olive',
    color: '#808000',
  },
  {
    name: 'Green',
    color: '#00FF00',
  },
  {
    name: 'Japanese Laurel',
    color: '#008000',
  },
  {
    name: 'Cyan / Aqua',
    color: '#00FFFF',
  },
  {
    name: 'Teal',
    color: '#008080',
  },
  {
    name: 'Blue',
    color: '#0000FF',
  },
  {
    name: 'Navy Blue',
    color: '#000080',
  },
  {
    name: 'Magenta / Fuchsia',
    color: '#FF00FF',
  },
  {
    name: 'Fresh Eggplant',
    color: '#800080',
  },
];

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

      [
        ...GREY_MAP.map(rgb => ({
          name: rgb.name,
          color: new imgstry.Utility.Rgb(rgb.index).toHex().value,
        })),
        ...HEX_MAP,
      ]
        .forEach((hex) => {
          it(`should have spikes for ${hex.name}`, async () => {
            const rgb = new imgstry.Utility.Hex(hex.color).toRgb();
            const mean = Math.floor((rgb.r + rgb.g + rgb.b) / 3);
            await render(
              processor
                .fill(hex.color),
              method,
            );
            const result = processor.histogram;

            result.all[mean].should.approximately(1, .00000001);
            result.channel.red[rgb.r].should.approximately(1, .00000001);
            result.channel.green[rgb.g].should.approximately(1, .00000001);
            result.channel.blue[rgb.b].should.approximately(1, .00000001);
          });
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

