/// <reference path="../../typings/globals/should/index.d.ts" />
/// <reference path="../../typings/mocha/mocha.d.ts" />
declare var imgstry: any;
declare var callPhantom: any;

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
    let imageData = processor.getData();
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
    let imageData = processor.getData();
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
    let imageData = processor.getData();
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
    (channelSum / pixelData.length * 4).should.equalOneOf([127, 128]);
  });

  it('should should tint pomegranate', () => {
    let processor = new imgstry(board);
    processor.brightness(50);
    processor.tint('#c0392b');
    let imageData = processor.getData();
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
    let imageData = processor.getData();
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
});
