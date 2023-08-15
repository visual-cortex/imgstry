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
     * @returns {IColor}
     */
    toHsv(): IColor
    /**
     * Converts the color to RGB.
     * @returns {IColor}
     */
    toRgb(): IColor
    /**
     * Converts the color to CMYK.
     * @returns {IColor}
     */
    toCmyk(): IColor
    /**
     * Converts the color to HEX.
     * @returns {IColor}
     */
    toHex(): IColor
    /**
     * Clamps the color values to prevent bleeding.
     * @returns {IColor}
     */
    clamp(): IColor
}
