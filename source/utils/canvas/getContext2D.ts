export /**
 * Safely retrieve canvas and throw if not found.
 *
 * @param {HTMLCanvasElement} canvas the target canvas
 * @returns {CanvasRenderingContext2D} the 2D context
 */
const getContext2D = (canvas: HTMLCanvasElement): CanvasRenderingContext2D => {
  const ctx = canvas.getContext('2d');

  if (!!ctx) { return ctx!; }

  throw new Error(`Could not retrieve context.`);
};
