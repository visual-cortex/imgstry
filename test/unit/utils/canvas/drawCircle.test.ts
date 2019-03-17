import { expect } from 'chai';
import { JSDOM } from 'jsdom';
import { Point } from '~core/point';
import { Hex } from '~pixel';
import { drawCircle } from '~utils/canvas';

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

interface IDrawCircleTestCase {
  width: number;
  height: number;
  color: string;
  radius: number;
  point: {
    x: number;
    y: number;
  };
}

const TEST_CASES: IDrawCircleTestCase[] = [
  {
    width: 100,
    height: 100,
    color: '#ff0011',
    radius: 10,
    point: {
      x: 30,
      y: 30,
    },
  },
  {
    width: 100,
    height: 100,
    color: '#133771',
    radius: 10,
    point: {
      x: 0,
      y: 0,
    },
  },
  {
    width: 100,
    height: 100,
    color: '#1100ff',
    radius: 10,
    point: {
      x: 100,
      y: 100,
    },
  },
  {
    width: 100,
    height: 100,
    color: '#733113',
    radius: 10,
    point: {
      x: 100,
      y: 0,
    },
  },
  {
    width: 100,
    height: 100,
    color: '#113322',
    radius: 10,
    point: {
      x: 0,
      y: 100,
    },
  },
];

describe('canvasUtil: drawCircle', () => {
  TEST_CASES.forEach(testCase => {
    it(`should fill a circle with ${
      testCase.color
      } having the center-point in x:${testCase.point.x} y:${testCase.point.y} of radius ${
      testCase.radius
      }`, () => {
        const canvas: HTMLCanvasElement = document.querySelector('#myCanvas');

        canvas.width = 100;
        canvas.height = 100;

        const color = new Hex(testCase.color);

        const center = new Point({
          x: testCase.point.x,
          // the origin is considered to be bottom-left (canvas stardard is top-left)
          y: canvas.height - testCase.point.y,
        });

        drawCircle(canvas, { ...testCase });

        const { r, g, b } = color.toRgb();

        const data = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;

        for (let y = 0; y < canvas.height; y++) {
          for (let x = 0; x < canvas.width; x++) {
            const idx = (y * canvas.width + x) * 4;

            const distance = center.distanceTo({
              x,
              y,
            });

            const innerSafeZone = Math.pow(testCase.radius - 1.5, 2);

            if (distance < innerSafeZone) {
              expect(data[idx]).to.be.approximately(r, 1);
              expect(data[idx + 1]).to.be.approximately(g, 1);
              expect(data[idx + 2]).to.be.approximately(b, 1);
            }

            // the other pixels are skipped due to raster bleed
            const outerSafeZone = Math.pow(testCase.radius + 1.5, 2);

            if (distance > outerSafeZone) {
              expect(data[idx]).to.equal(0);
              expect(data[idx + 1]).to.equal(0);
              expect(data[idx + 2]).to.equal(0);
            }
          }
        }
      });
  });
});
