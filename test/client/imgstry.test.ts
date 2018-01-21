declare let imgstry: any;
declare let callPhantom: any;

let takeScreenshot = (title: string, status: string) => {
  if (this['callPhantom'] && callPhantom) {
    let date = new Date();
    let testName = title.split(' ').map((keyWord: string, index: number) => {
      let lowerCase = keyWord.toLowerCase();
      return index === 0 ? lowerCase : `${lowerCase.charAt(0).toUpperCase()}${lowerCase.substring(1)}`;
    }).join('');
    let fileName = `reports/client/screenshots/${status}/${testName}_${date.getTime()}`;
    callPhantom({
      'screenshot': fileName,
    });
  }
};

describe('imgstry', () => {
  let anchor = '#board';
  let board: HTMLCanvasElement;

  beforeEach(() => {
    board = imgstry.getCanvas(anchor);
  });

  afterEach(function () {
    takeScreenshot(this.currentTest.title, this.currentTest.state);
  });

  it('should get canvas', () => {
    board.should.be.not.empty;
  });

  it('should construct correctly', () => {
    let processor = new imgstry(board);
    processor.width.should.equal(500);
    processor.height.should.equal(500);
  });

  it('should be black', () => {
    let processor = new imgstry(board);
    let imageData = processor.data;
    let pixelData = imageData.data;

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

  it('should invert to white', () => {
    let processor = new imgstry(board);
    processor.invert();
    let imageData = processor.data;
    let pixelData = imageData.data;

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

  it('should be neutral gray', () => {
    let processor = new imgstry(board);
    processor.brightness(50);
    let imageData = processor.data;
    let pixelData = imageData.data;

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

  it('should should tint pomegranate', () => {
    let processor = new imgstry(board);
    processor.brightness(50);
    processor.tint('#c0392b');
    let imageData = processor.data;
    let pixelData = imageData.data;

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

  it('should should tint green sea', () => {
    let processor = new imgstry(board);
    processor.brightness(50);
    processor.tint('#16a085');
    let imageData = processor.data;
    let pixelData = imageData.data;

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

  it('should turn bw', () => {
    let processor = new imgstry(board);
    processor.brightness(50);
    processor.tint('#16a085');
    processor.bw();
    let imageData = processor.data;
    let pixelData = imageData.data;

    let channelSum = true;
    for (let i = 0; i < pixelData.length; i += 4) {
      let rgb = {
        r: pixelData[i],
        g: pixelData[i + 1],
        b: pixelData[i + 2],
      };

      channelSum = rgb.r === rgb.b && rgb.b === rgb.g;
      if (channelSum) {
        break;
      }
    }
    channelSum.should.be.equal(true);
  });

  it('should contrast color', () => {
    let processor = new imgstry(board);
    processor.brightness(50);
    processor.tint('#16a085');
    processor.contrast(20);
    let imageData = processor.data;
    let pixelData = imageData.data;

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

  it('should have sum of channel color distribution equal to 1', () => {
    let processor = new imgstry(board);
    processor.brightness(15).noise(25).tint('#16a085');
    const result = processor.histogram;
    result.all.reduce((a: number, b: number) => a + b, 0).should.approximately(1, .00000001);
    result.channels.red.reduce((a: number, b: number) => a + b, 0).should.approximately(1, .00000001);
    result.channels.green.reduce((a: number, b: number) => a + b, 0).should.approximately(1, .00000001);
    result.channels.blue.reduce((a: number, b: number) => a + b, 0).should.approximately(1, .00000001);
  });

  it('should apply edge detection kernel succesfully', (done) => {

    const image = new Image();
    image.onload = () => {
      try {
        const processor = new imgstry(board);
        processor.context.drawImage(image, 0, 0);

        let pixelData = processor.data.data;
        let initialAlpha = 0;
        for (let i = 0; i < pixelData.length; i += 4) {
          initialAlpha += pixelData[i + 3];
        }

        const edgeDetectionKernel = [
          -1, -1, -1,
          -1, 8, -1,
          -1, -1, -1,
        ];
        processor.convolve(edgeDetectionKernel);

        pixelData = processor.data.data;
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
        // after edge detection expect 90% of pixels to be black
        (channelSum / pixelData.length * 4).should.approximately(0, 10);
        alpha.should.equal(initialAlpha, 'the alpha channel was mutated by the convolution');
      } catch (e) {
        return done(e);
      }

      done();
    };
    image.src = 'rnm.jpg';
  });
});
