export enum ColorSpace {
    Empty = 'Empty',
    Rgb = 'Rgb',
    Cmyk = 'Cmyk',
    Hex = 'Hex',
    Hsv = 'Hsv',
}

/**
 * Color interface, describes a colorspace.
 */
export interface IColor {
    /**
     * Returns the colorspace value associated to this color.
     */
    kind: ColorSpace

    /**
     * Converts the color to HSV.
     * @returns
     */
    toHsv(): IColor
    /**
     * Converts the color to RGB.
     * @returns
     */
    toRgb(): IColor
    /**
     * Converts the color to CMYK.
     * @returns
     */
    toCmyk(): IColor
    /**
     * Converts the color to HEX.
     * @returns
     */
    toHex(): IColor
    /**
     * Clamps the color values to prevent bleeding.
     * @returns
     */
    clamp(): IColor
}
