declare namespace NodeCanvas {
    export class Canvas extends HTMLCanvasElement {
        public constructor(width: number, height: number);
    }

    export class Image extends HTMLImageElement {
        public constructor();
    }

    export function createImageData(data: Uint16Array, width: number, height: number): ImageData;
}

declare module 'canvas' {
    export = NodeCanvas;
}
