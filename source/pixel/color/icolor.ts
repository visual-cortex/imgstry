export interface IColor {
  toHsv(): IColor;
  toRgb(): IColor;
  toCmyk(): IColor;
  toHex(): IColor;
  clamp(): IColor;
}
