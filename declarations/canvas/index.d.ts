declare namespace NodeCanvas {
  export class Canvas extends HTMLCanvasElement {
    constructor(width: number, height: number);
  }

  export class Image extends HTMLImageElement {
    constructor();
  }
}

declare module 'canvas' {
  export = NodeCanvas;
}
