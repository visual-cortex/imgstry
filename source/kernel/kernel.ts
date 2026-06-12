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
        for (let y = 0; y < this.height; ++y) {
            for (let x = 0; x < this.width; ++x) {
                delegate(this._kernel[y][x], {
                    x,
                    y,
                });
            }
        }
    }

    /**
     * Returns the kernel weights as a flat row-major array.
     * @returns the kernel weights in row-major order
     */
    public flatten(): Float64Array {
        const flat = new Float64Array(this.width * this.height);
        for (let y = 0; y < this.height; ++y) {
            for (let x = 0; x < this.width; ++x) {
                flat[y * this.width + x] = this._kernel[y][x];
            }
        }
        return flat;
    }
}
