const _selectorRegex: RegExp = /#[a-zA-Z]+[a-zA-Z0-9\-\_]+/;

/**
 * Retrieves the canvas elemented for a specified 'id'.
 *
 * @param {string | HTMLCanvasElement} selector canvas id selector or the canvas element
 * @return {HTMLCanvasElement} the canvas element
 */
export const getCanvas = (selector: string | HTMLCanvasElement): HTMLCanvasElement => {
  if (selector instanceof HTMLCanvasElement) {
    return selector;
  }

  if (!selector) {
    throw 'A canvas selector must be provided.';
  }

  if (!_selectorRegex.test(selector)) {
    throw `'${selector}' is not a valid id.`;
  }

  const [hashBang] = selector;
  if (hashBang === '#') {
    selector = selector.substring(1);
  }

  let canvas = document.getElementById(selector);

  if (!(canvas instanceof HTMLCanvasElement)) {
    throw `'${selector}' does not identify a canvas element.`;
  }

  return <HTMLCanvasElement>canvas;
};
