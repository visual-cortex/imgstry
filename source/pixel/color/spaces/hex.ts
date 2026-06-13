import {
    ColorSpace,
    IColor,
} from '~/pixel/color/color';
import { Cmyk } from '~/pixel/color/spaces/cmyk';
import { Hsv } from '~/pixel/color/spaces/hsv';
import { Rgb } from '~/pixel/color/spaces/rgb';

const CODE_ZERO = 48;
const CODE_NINE = 57;
const CODE_A = 65;
const CODE_F_UPPER = 70;
const CODE_A_LOWER = 97;
const CODE_F_LOWER = 102;

const decodeHex = (code: number): number => {
    if (code >= CODE_ZERO && code <= CODE_NINE) {
        return code - CODE_ZERO;
    }

    if (code >= CODE_A && code <= CODE_F_UPPER) {
        return code - CODE_A + 10;
    }

    if (code >= CODE_A_LOWER && code <= CODE_F_LOWER) {
        return code - CODE_A_LOWER + 10;
    }

    return 0;
};

const clampHexCode = (code: number): number => {
    if (code <= CODE_ZERO) {
        return CODE_ZERO;
    }

    if (code > CODE_NINE && code < CODE_A) {
        return CODE_ZERO;
    }

    if (code > CODE_F_UPPER) {
        return CODE_F_UPPER;
    }

    return code;
};

/**
 * HEX colorspace.
 */
export class Hex implements IColor {
    public value: string;

    public constructor(color = '#000000') {
        this.value = color;
    }

    public get kind() {
        return ColorSpace.Hex;
    }

    public toRgb(): Rgb {
        const value = this.value;
        const offset = value.charCodeAt(0) === 35 ? 1 : 0;

        const r = (decodeHex(value.charCodeAt(offset)) << 4) | decodeHex(value.charCodeAt(offset + 1));
        const g = (decodeHex(value.charCodeAt(offset + 2)) << 4) | decodeHex(value.charCodeAt(offset + 3));
        const b = (decodeHex(value.charCodeAt(offset + 4)) << 4) | decodeHex(value.charCodeAt(offset + 5));

        return new Rgb({ r, g, b });
    }

    public toHsv(): Hsv {
        return this.toRgb().toHsv();
    }

    public toCmyk(): Cmyk {
        return this.toRgb().toCmyk();
    }

    public toHex(): Hex {
        return new Hex(this.value);
    }

    public clamp(): Hex {
        const value = this.value;
        const length = value.length;
        const buffer = new Array<string>(length);

        buffer[0] = '#';

        for (let i = 1; i < length; i++) {
            buffer[i] = String.fromCharCode(clampHexCode(value.charCodeAt(i)));
        }

        return new Hex(buffer.join(''));
    }
}
