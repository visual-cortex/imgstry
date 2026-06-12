import {
    ColorSpace,
    IColor,
} from '~/pixel/color/color';
import { Cmyk } from '~/pixel/color/spaces/cmyk';
import { Hex } from '~/pixel/color/spaces/hex';
import { Hsv } from '~/pixel/color/spaces/hsv';

export interface IRgb {
    r: number
    g: number
    b: number
}

const DEFAULT: IRgb = {
    r: 0,
    g: 0,
    b: 0,
};

/**
 * Rgb colorspace.
 */
export class Rgb implements IRgb, IColor {
    public r: number;
    public g: number;
    public b: number;
    /**
     * Optional alpha override in the [0, 255] interval; when set,
     * the processor writes it back to the alpha channel.
     */
    public alpha?: number;

    public constructor({ r, g, b }: IRgb = DEFAULT) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    public get kind() {
        return ColorSpace.Rgb;
    }

    public toHsv(): Hsv {
        const r = Math.round(Math.min(255, Math.max(0, this.r))) / 255;
        const g = Math.round(Math.min(255, Math.max(0, this.g))) / 255;
        const b = Math.round(Math.min(255, Math.max(0, this.b))) / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);

        const delta = max - min;

        const result = new Hsv({
            h: 0,
            s: max === 0 ? 0 : delta / max,
            v: max,
        });

        result.h = this._determineHue(min, max, delta, r, g, b);
        result.h = Math.round(Math.min(result.h * 60, 360));
        result.h += result.h < 0 ? 360 : 0;

        return result;
    }

    public toRgb(): Rgb {
        return new Rgb(this);
    }

    public toCmyk(): Cmyk {
        const clamp = this.clamp();

        clamp.r /= 255;
        clamp.g /= 255;
        clamp.b /= 255;

        const min = Math.min(1 - clamp.r, 1 - clamp.g, 1 - clamp.b);

        return new Cmyk({
            k: min,
            c: (1 - clamp.r - min) / (1 - min) || 0,
            m: (1 - clamp.g - min) / (1 - min) || 0,
            y: (1 - clamp.b - min) / (1 - min) || 0,
        });
    }

    public toHex(): Hex {
        const { r, g, b } = this._clamp(this);

        const numeric = (
            (1 << 24) +
            (Math.round(r) << 16) +
            (Math.round(g) << 8) +
            Math.round(b)
        );

        return new Hex(`#${numeric.toString(16).toUpperCase().slice(1)}`);
    }

    public clamp(): Rgb {
        return new Rgb(this._clamp(this));
    }

    /**
     * Clamps the channels of this instance without allocating a new object.
     * Used by per-pixel hot paths.
     * @returns the current instance with clamped channel values
     */
    public clampInPlace(): Rgb {
        this.r = Math.round(Math.min(255, Math.max(0, this.r)));
        this.g = Math.round(Math.min(255, Math.max(0, this.g)));
        this.b = Math.round(Math.min(255, Math.max(0, this.b)));
        return this;
    }

    private _clamp({ r, g, b }: IRgb) {
        return {
            r: Math.round(Math.min(255, Math.max(0, r))),
            g: Math.round(Math.min(255, Math.max(0, g))),
            b: Math.round(Math.min(255, Math.max(0, b))),
        };
    }

    private _determineHue(min: number, max: number, delta: number, r: number, g: number, b: number) {
        switch (max) {
            case min:
                return 0;
            case r:
                return (g - b) / delta;
            case g:
                return 2 + (b - r) / delta;
            case b:
                return 4 + (r - g) / delta;
            default:
                return 0;
        }
    }
}
