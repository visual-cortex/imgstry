import { expect } from 'chai';
import { JSDOM } from 'jsdom';
import { Hex } from '~pixel';
import { drawGrid } from '~utils/canvas';

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

interface IDrawGridTesCase {
  gridSize: number;
  color: string;
  padding: number;
  width: number;
  height: number;
}

// proper tests can only be written for cases with integer step results
// if we round the steps inside the draw grid util, sometimes last lines not drawn due to position overflows
const TEST_CASES: IDrawGridTesCase[] = [
  {
    gridSize: 4,
    color: '#336611',
    padding: 0,
    width: 100,
    height: 100,
  },
  {
    gridSize: 10,
    color: '#663311',
    padding: 0,
    width: 100,
    height: 100,
  },
  {
    gridSize: 4,
    color: '#111333',
    padding: 36,
    width: 100,
    height: 100,
  },
  {
    gridSize: 4,
    color: '#133773',
    padding: 10,
    width: 60,
    height: 100,
  },
  {
    gridSize: 3,
    color: '#733113',
    padding: 0,
    width: 54,
    height: 30,
  },
  {
    width: 60,
    height: 60,
    color: '#ff0000',
    gridSize: 5,
    padding: 20,
  },
];

describe('canvasUtil: drawGrid', () => {
  TEST_CASES.forEach(testCase => {
    it(`should draw a grid of size ${
      testCase.gridSize
      } on a ${testCase.width}x${testCase.height} canvas with ${
      testCase.padding
      } padding`, () => {
        const canvas: HTMLCanvasElement = document.querySelector('#myCanvas');
        canvas.width = testCase.width;
        canvas.height = testCase.height;

        const color = new Hex(testCase.color);

        drawGrid(canvas, { ...testCase });

        const { r, g, b } = color.toRgb();

        const data = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;

        const stepX = (canvas.width - testCase.padding * 2) / testCase.gridSize;
        const stepY = (canvas.height - testCase.padding * 2) / testCase.gridSize;

        for (let y = testCase.padding; y < canvas.height - testCase.padding; y++) {
          for (let x = testCase.padding; x < canvas.width - testCase.padding; x++) {
            const idx = (y * canvas.width + x) * 4;

            // skip pixels prone to bleeding effect
            if (
              (x - testCase.padding) % stepX === 1 ||
              (x - testCase.padding) % stepX === stepX - 1 ||
              (y - testCase.padding) % stepY === 1 ||
              (y - testCase.padding) % stepY === stepY - 1
            ) { continue; }

            if (
              (x - testCase.padding) % stepX === 0 ||
              (y - testCase.padding) % stepY === 0
            ) {
              expect(data[idx]).to.be.approximately(r, 1);
              expect(data[idx + 1]).to.be.approximately(g, 1);
              expect(data[idx + 2]).to.be.approximately(b, 1);
            } else {
              expect(data[idx]).to.equal(0);
              expect(data[idx + 1]).to.equal(0);
              expect(data[idx + 2]).to.equal(0);
            }
          }
        }
      });
  });
});
