declare namespace NodeCanvas {
  export class Canvas extends HTMLCanvasElement {
    constructor(width: number, height: number);
  }

  export class Image extends HTMLImageElement {
    constructor();
  }

  export function createImageData(data: Uint16Array, width: number, height: number): ImageData;
}

declare module 'canvas' {
  export = NodeCanvas;
}
