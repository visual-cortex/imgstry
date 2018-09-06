declare let imgstry: any;
declare let callPhantom: any;

let takeScreenshot = (test: Mocha.Test) => {
  if (
    this['callPhantom'] &&
    callPhantom
  ) {
    let testName = test.title.split(' ').join('-');
    let fileName = `reports/end-to-end/screenshots/${test.state}/${testName}-${test.speed}-${test.duration}ms`;
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
    takeScreenshot(this.currentTest);
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

        processor.convolve(imgstry.Utility.EdgeDetection);

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
        (channelSum / pixelData.length).should
          .approximately(
            0, 1.51,
            'edge detection should generate 98.5% darkness',
          );
        alpha.should.equal(initialAlpha, 'the alpha channel was mutated by the convolution');
      } catch (e) {
        return done(e);
      }

      done();
    };
    image.src = 'rnm.jpg';
  });

  it('should apply the gaussion blur kernel succesfully', (done) => {
    const image = new Image();
    image.onload = () => {
      try {
        const processor = new imgstry(board);
        processor.context.drawImage(image, 0, 0);

        let pixelData = processor.data.data;

        processor.convolve(imgstry.Utility.GaussianBlur(5, 50));

        let channelSum = 0;

        processor.convolve(imgstry.Utility.EdgeDetection);

        pixelData = processor.data.data;
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
          .approximately(
            0,
            .51,
            'edge detection after blur should generate at least 99.5% darkness',
          );
      } catch (e) {
        return done(e);
      }

      done();
    };
    image.src = 'rnm.jpg';
  });
});