import { expect } from 'chai';
import { splineTheme } from '~platform/browser/spline/spline.theme';
import { Theme } from '~platform/browser/theme';

const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

describe('spline theme', () => {
  it(`should have a valid 'light' theme defined`, () => {
    const theme = splineTheme(Theme.light);

    expect(theme).to.not.be.undefined;
    expect(theme.anchor).to.be.not.be.undefined;
    expect(theme.anchor.hovered).to.match(hexRegex);
    expect(theme.anchor.idle).to.match(hexRegex);
    expect(theme.gridLine).to.match(hexRegex);
    expect(theme.spline).to.match(hexRegex);
  });

  it(`should have a valid 'dark' theme defined`, () => {
    const theme = splineTheme(Theme.dark);

    expect(theme).to.not.be.undefined;
    expect(theme.anchor).to.be.not.be.undefined;
    expect(theme.anchor.hovered).to.match(hexRegex);
    expect(theme.anchor.idle).to.match(hexRegex);
    expect(theme.gridLine).to.match(hexRegex);
    expect(theme.spline).to.match(hexRegex);
  });
});
