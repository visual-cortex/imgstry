const SELECTOR_REGEX = /#[a-zA-Z]+[a-zA-Z0-9\-_]+/;

/**
 * Retrieves the canvas elemented for a specified 'id'.
 * @param selector canvas id selector or the canvas element
 * @returns the canvas element
 */
export const getCanvas = (selector: string | HTMLCanvasElement): HTMLCanvasElement => {
    if (selector instanceof HTMLCanvasElement) {
        return selector;
    }

    if (!selector) {
        throw new Error('A canvas selector must be provided.');
    }

    if (!SELECTOR_REGEX.test(selector)) {
        throw new Error(`'${selector}' is not a valid id.`);
    }

    const [hashBang] = selector;
    if (hashBang === '#') {
        selector = selector.substring(1);
    }

    const canvas = document.getElementById(selector);

    if (!(canvas instanceof HTMLCanvasElement)) {
        throw new Error(`'${selector}' does not identify a canvas element.`);
    }

    return <HTMLCanvasElement>canvas;
};
