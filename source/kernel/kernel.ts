export interface KernelIndex {
    x: number
    y: number
}

export class Kernel {
    public width: number;
    public height: number;

    public constructor(private _kernel: number[][]) {
        if (
            !(this._kernel instanceof Array) ||
            !(this._kernel[0] instanceof Array)
        ) {
            throw new Error(`Property ${JSON.stringify(this._kernel)} must be two-dimensional array! eg: ${JSON.stringify([[], [], []])}`);
        }
        this.width = this._kernel[0].length;
        this.height = this._kernel.length;
    }

    public forEach(delegate: (value: number, index: KernelIndex) => void) {
        for (let y = 0; y < this.width; ++y) {
            for (let x = 0; x < this.height; ++x) {
                delegate(this._kernel[y][x], {
                    x,
                    y,
                });
            }
        }
    }
}
