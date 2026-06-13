import {
    ColorSpace,
    IColor,
} from '~/pixel/color/color';
import { Cmyk } from '~/pixel/color/spaces/cmyk';
import { Hex } from '~/pixel/color/spaces/hex';
import { Rgb } from '~/pixel/color/spaces/rgb';

export interface IHsv {
    h: number
    s: number
    v: number
}

const DEFAULT: IHsv = {
    h: 0,
    s: 0,
    v: 0,
};

/**
 * HSV colorspace.
 */
export class Hsv implements IColor {
    public h: number;
    public s: number;
    public v: number;

    public constructor({ h, s, v }: IHsv = DEFAULT) {
        this.h = h;
        this.s = s;
        this.v = v;
    }

    public get kind() {
        return ColorSpace.Hsv;
    }

    public toRgb(): Rgb {
        const h = (this.h < 0 ? (360 + this.h) : this.h) % 361;
        const s = this.s < 0 ? 0 : this.s > 1 ? 1 : this.s;
        const v = this.v < 0 ? 0 : this.v > 1 ? 1 : this.v;

        const c = v * s;
        const hPrime = h / 60;
        const sector = hPrime | 0;
        const x = c * (1 - Math.abs((hPrime % 2) - 1));
        const m = v - c;

        let r = m;
        let g = m;
        let b = m;

        switch (sector) {
            case 0:
                r += c; g += x; break;
            case 1:
                r += x; g += c; break;
            case 2:
                g += c; b += x; break;
            case 3:
                g += x; b += c; break;
            case 4:
                r += x; b += c; break;
            case 5:
                r += c; b += x; break;
            default:
                break;
        }

        return new Rgb({
            r: (r * 255 + .5) | 0,
            g: (g * 255 + .5) | 0,
            b: (b * 255 + .5) | 0,
        });
    }

    public toHsv(): Hsv {
        return new Hsv(this);
    }

    public toCmyk(): Cmyk {
        return this.toRgb().toCmyk();
    }

    public toHex(): Hex {
        return this.toRgb().toHex();
    }

    public clamp(): Hsv {
        return new Hsv({
            h: (this.h < 0 ? (360 + this.h) : this.h) % 361,
            s: this.s < 0 ? 0 : this.s > 1 ? 1 : this.s,
            v: this.v < 0 ? 0 : this.v > 1 ? 1 : this.v,
        });
    }
}
