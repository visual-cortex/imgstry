/**
 * Supported layer blend modes.
 */
export type BlendMode =
    'normal' |
    'multiply' |
    'screen' |
    'overlay' |
    'darken' |
    'lighten';

type BlendFn = (backdrop: number, source: number) => number;

const BLEND: Record<BlendMode, BlendFn> = {
    normal: (_backdrop, source) => source,
    multiply: (backdrop, source) => backdrop * source,
    screen: (backdrop, source) => 1 - (1 - backdrop) * (1 - source),
    overlay: (backdrop, source) =>
        backdrop < .5 ?
            2 * backdrop * source :
            1 - 2 * (1 - backdrop) * (1 - source),
    darken: (backdrop, source) => Math.min(backdrop, source),
    lighten: (backdrop, source) => Math.max(backdrop, source),
};

/**
 * Composites a source image over a base image in place, following the
 * W3C compositing and blending model for non-premultiplied data.
 * @param base the backdrop image, mutated in place
 * @param source the source image to composite over the backdrop
 * @param mode the blend mode applied to the color channels
 * @param opacity the layer opacity in the [0, 1] interval
 */
export const blendInto = (
    base: ImageData,
    source: ImageData,
    mode: BlendMode,
    opacity: number,
): void => {
    const blend = BLEND[mode];
    const baseData = base.data;
    const sourceData = source.data;
    const length = Math.min(baseData.length, sourceData.length);

    for (let i = 0; i < length; i += 4) {
        const sourceAlpha = (sourceData[i + 3] / 255) * opacity;

        if (!sourceAlpha) {
            continue;
        }

        const baseAlpha = baseData[i + 3] / 255;
        const outAlpha = sourceAlpha + baseAlpha * (1 - sourceAlpha);

        for (let c = 0; c < 3; c++) {
            const backdrop = baseData[i + c] / 255;
            const color = sourceData[i + c] / 255;
            const mixed = (1 - baseAlpha) * color + baseAlpha * blend(backdrop, color);
            const out = (mixed * sourceAlpha + backdrop * baseAlpha * (1 - sourceAlpha)) / outAlpha;

            baseData[i + c] = Math.round(out * 255);
        }

        baseData[i + 3] = Math.round(outAlpha * 255);
    }
};
