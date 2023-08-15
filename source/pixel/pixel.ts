import { IPoint } from '~/core/point';
import {
    ColorSpace,
    IColor,
} from '~/pixel/color';

/**
 *
 *
 * @template IColor
 */
export class Pixel<T extends IColor> implements IPoint {
    public constructor(
        private _x: number,
        private _y: number,
        public color?: T,
    ) {
        this._y = this._normalize(this._y);
        this._x = this._normalize(this._x);
    }


    public get colorSpace(): ColorSpace {
        return this.color?.kind ?? ColorSpace.Empty;
    }

    public get x() {
        return this._x;
    }

    public get y() {
        return this._y;
    }

    public set x(value: number) {
        this._x = this._normalize(value);
    }

    public set y(value: number) {
        this._y = this._normalize(value);
    }

    private _normalize(coordinate: number) {
        return !coordinate || coordinate < 0
            ? 0
            : coordinate;
    }
}
