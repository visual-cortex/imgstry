import { expect } from 'chai';
import { JSDOM } from 'jsdom';
import { getCanvas } from '~utils/dom';

const dom = new JSDOM(`
  <!DOCTYPE html>
  <html>
    <head></head>
    <body>
      <div class="container">
        <canvas id="myCanvas"></canvas>
      </div>
    </body>
  </html>
`);

(global as any).document = dom.window.document;
(global as any).HTMLCanvasElement = dom.window.HTMLCanvasElement.prototype.constructor;

describe('domUtil: getCanvas', () => {
  it('should return back the canvas element if it is passed as the selector property', () => {
    const canvas: any = document.createElement('canvas');
    expect(getCanvas(canvas)).to.equal(canvas);
  });

  [0, null, void 0, false, ''].forEach(value => {
    it(`should throw an error if a (value) is provided`, () => {
      expect(getCanvas.bind(getCanvas, value)).to.throw('A canvas selector must be provided.');
    });
  });

  it(`should throw an error if and invalid id string is provided`, () => {
    const selector = 'lalala';
    expect(getCanvas.bind(getCanvas, selector)).to.throw(`'${selector}' is not a valid id.`);
  });

  it(`should throw an error the canvas associated to requested id cannot be found`, () => {
    const selector = '#lalala';
    expect(getCanvas.bind(getCanvas, selector)).to.throw(`'${selector.substring(1)}' does not identify a canvas element.`);
  });

  it(`should retrieve the canvas element if a valid id is requested`, () => {
    const selector = '#myCanvas';
    const canvas = getCanvas(selector);
    expect(canvas).to.be.a('HTMLCanvasElement');
  });
});
