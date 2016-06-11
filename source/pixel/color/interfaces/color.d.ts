interface Color {
  toHsv(): Color;
  toRgb(): Color;
  toCmyk(): Color;
  toHex(): Color;
  clamp(): Color;
}
