export const hexToRgb =
  (hex: string) =>
    /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      .filter(value => value !== hex)
      .map(partial => parseInt(partial, 16));

