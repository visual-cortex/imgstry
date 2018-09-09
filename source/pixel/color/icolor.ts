/**
 * Color interface, describes a colorspace.
 *
 * @export
 * @interface IColor
 */
export interface IColor {
  /**
   * Converts the color to HSV.
   *
   * @returns {IColor}
   * @memberof IColor
   */
  toHsv(): IColor;
  /**
   * Converts the color to RGB.
   *
   * @returns {IColor}
   * @memberof IColor
   */
  toRgb(): IColor;
  /**
   * Converts the color to CMYK.
   *
   * @returns {IColor}
   * @memberof IColor
   */
  toCmyk(): IColor;
  /**
   * Converts the color to HEX.
   *
   * @returns {IColor}
   * @memberof IColor
   */
  toHex(): IColor;
  /**
   * Clamps the color values to prevent bleeding.
   *
   * @returns {IColor}
   * @memberof IColor
   */
  clamp(): IColor;
}
