import { Theme } from '~platform/browser/theme';

export const splineTheme = (theme: Theme) => {
  switch (theme) {
    case Theme.Dark:
      return {
        gridLine: '#485460',
        anchor: {
          idle: '#05c46b',
          hovered: '#4bcffa',
        },
        spline: '#d2dae2',
      };
    case Theme.Light:
      return {
        gridLine: '#d2dae2',
        anchor: {
          idle: '#ffa801',
          hovered: '#ff5e57',
        },
        spline: '#808e9b',
      };
  }
};
