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
        const clamp = this.clamp();
        const c = clamp.v * clamp.s;
        const x = c * (1 - Math.abs(((clamp.h / 60) % 2) - 1));
        const m = clamp.v - c;

        const result = new Rgb({ r: m, g: m, b: m });

        if (clamp.h >= 0 && clamp.h < 60) {
            result.r += c;
            result.g += x;
        } else if (clamp.h >= 60 && clamp.h < 120) {
            result.r += x;
            result.g += c;
        } else if (clamp.h >= 120 && clamp.h < 180) {
            result.g += c;
            result.b += x;
        } else if (clamp.h >= 180 && clamp.h < 240) {
            result.g += x;
            result.b += c;
        } else if (clamp.h >= 240 && clamp.h < 300) {
            result.r += x;
            result.b += c;
        } else if (clamp.h >= 300 && clamp.h < 360) {
            result.r += c;
            result.b += x;
        }

        result.r = Math.round(result.r * 255);
        result.g = Math.round(result.g * 255);
        result.b = Math.round(result.b * 255);

        return result;
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
            s: Math.min(1, Math.max(0, this.s)),
            v: Math.min(1, Math.max(0, this.v)),
        });
    }
}
