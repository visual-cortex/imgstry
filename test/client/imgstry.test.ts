/// <reference path="../../typings/globals/should/index.d.ts" />
/// <reference path="../../typings/mocha/mocha.d.ts" />
declare var imgstry: any;

describe('imgstry', () => {
  let anchor = '#board';
  let board: HTMLCanvasElement;
  beforeEach(() => {
    board = imgstry.getCanvas(anchor);
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
});
