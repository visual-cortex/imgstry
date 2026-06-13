import {
    ColorSpace,
    IColor,
} from '~/pixel/color/color';
import { Hex } from '~/pixel/color/spaces/hex';
import { Hsv } from '~/pixel/color/spaces/hsv';
import { Rgb } from '~/pixel/color/spaces/rgb';

export interface ICmyk {
    c: number
    m: number
    y: number
    k: number
}

const DEFAULT: ICmyk = {
    c: 0,
    m: 0,
    y: 0,
    k: 0,
};

/**
 * CMYK colorspace.
 */
export class Cmyk implements IColor {
    public c: number;
    public m: number;
    public y: number;
    public k: number;

    public constructor({ c, m, y, k }: ICmyk = DEFAULT) {
        this.c = c;
        this.m = m;
        this.y = y;
        this.k = k;
    }

    public get kind() {
        return ColorSpace.Cmyk;
    }

    public toRgb(): Rgb {
        const kInv = 1 - this.k;
        const cMix = this.c * kInv + this.k;
        const mMix = this.m * kInv + this.k;
        const yMix = this.y * kInv + this.k;

        return new Rgb({
            r: 255 * (1 - (cMix > 1 ? 1 : cMix)),
            g: 255 * (1 - (mMix > 1 ? 1 : mMix)),
            b: 255 * (1 - (yMix > 1 ? 1 : yMix)),
        });
    }

    public toHsv(): Hsv {
        return this.toRgb().toHsv();
    }

    public toCmyk(): Cmyk {
        return new Cmyk(this);
    }

    public toHex(): Hex {
        return this.toRgb().toHex();
    }

    public clamp(): Cmyk {
        return new Cmyk({
            c: this.c < 0 ? 0 : this.c > 1 ? 1 : this.c,
            m: this.m < 0 ? 0 : this.m > 1 ? 1 : this.m,
            y: this.y < 0 ? 0 : this.y > 1 ? 1 : this.y,
            k: this.k < 0 ? 0 : this.k > 1 ? 1 : this.k,
        });
    }
}
