
import {
    ChannelLut,
    applyChannelLut,
    brightnessLut,
    composeLut,
    contrastLut,
    curveLut,
    exposureLut,
    gainLut,
    gammaLut,
    invertLut,
    levelsLut,
    toneRegionLut,
} from '~/core/pipeline/lut';
import {
    ChannelMixerMatrix,
    SplitToneOptions,
    applyBlackAndWhite,
    applyChannelMixer,
    applyFill,
    applyHue,
    applyNoise,
    applySaturation,
    applySepia,
    applySplitTone,
    applyTint,
    applyVibrance,
    temperatureGain,
    tintGain,
} from '~/core/pipeline/pixel';
import {
    VignetteOptions,
    applyClarity,
    applyConvolve,
    applyVignette,
} from '~/core/pipeline/spatial';
import { OperationOption } from '~/core/types';
import { Kernel } from '~/kernel';

type Stage =
    | { kind: 'lut'; lut: ChannelLut }
    | { kind: 'pixel'; run: (data: Uint8ClampedArray) => void }
    | { kind: 'spatial'; run: (data: Uint8ClampedArray, width: number, height: number) => void }
    | { kind: 'convolve'; kernel: Kernel | number[][] };

const lutBuilders: Record<string, (value: any) => ChannelLut> = {
    brightness: brightnessLut,
    contrast: contrastLut,
    gamma: gammaLut,
    invert: invertLut,
    exposure: exposureLut,
    levels: levelsLut,
    temperature: (value: number) => gainLut(temperatureGain(value)),
    tintShift: (value: number) => gainLut(tintGain(value)),
    shadows: (value: number) => toneRegionLut(value, 'shadows'),
    highlights: (value: number) => toneRegionLut(value, 'highlights'),
    whites: (value: number) => toneRegionLut(value, 'whites'),
    blacks: (value: number) => toneRegionLut(value, 'blacks'),
    curve: curveLut,
};

const pixelBuilders: Record<string, (value: any) => (data: Uint8ClampedArray) => void> = {
    saturation: (value: number) => (data) => applySaturation(data, value),
    vibrance: (value: number) => (data) => applyVibrance(data, value),
    sepia: (value: number) => (data) => applySepia(data, value),
    noise: (value: number) => (data) => applyNoise(data, value),
    hue: (value: number) => (data) => applyHue(data, value),
    blackAndWhite: (ratio: [number, number, number]) => (data) => applyBlackAndWhite(data, ratio),
    tint: (color: string) => (data) => applyTint(data, color),
    fill: (color: string) => (data) => applyFill(data, color),
    channelMixer: (matrix: ChannelMixerMatrix) => (data) => applyChannelMixer(data, matrix),
    splitTone: (options: SplitToneOptions) => (data) => applySplitTone(data, options),
};

const spatialBuilders: Record<string, (value: any) => (data: Uint8ClampedArray, width: number, height: number) => void> = {
    vignette: (options: VignetteOptions) => (data, width, height) => applyVignette(data, width, height, options),
    clarity: (value: number) => (data, width, height) => applyClarity(data, width, height, value),
};

export interface PipelineHost {
    width: number
    height: number
    imageData: ImageData
    createImageData(source: ImageData): ImageData
}

/**
 * Run a list of operations against a host image, mutating the host's image data.
 * Coalesces consecutive LUT operations into a single linear scan.
 * @param host the processor providing image data and dimensions
 * @param options the operations to apply in priority order
 */
export const runPipeline = (host: PipelineHost, options: OperationOption[]): void => {
    if (!options.length) {
        return;
    }

    const sorted = [...options].sort((a, b) => a.priority - b.priority);
    const stages: Stage[] = [];

    let accumulated: ChannelLut | null = null;

    const flushLut = () => {
        if (accumulated) {
            stages.push({ kind: 'lut', lut: accumulated });
            accumulated = null;
        }
    };

    const buildStage = (option: OperationOption): void => {
        if (option.name === 'convolve') {
            flushLut();
            stages.push({ kind: 'convolve', kernel: option.value as Kernel | number[][] });
            return;
        }

        const lutBuilder = lutBuilders[option.name];
        if (lutBuilder) {
            const next = lutBuilder(option.value as never);
            accumulated = accumulated ? composeLut(accumulated, next) : next;
            return;
        }

        const pixelBuilder = pixelBuilders[option.name];
        if (pixelBuilder) {
            flushLut();
            stages.push({ kind: 'pixel', run: pixelBuilder(option.value as never) });
            return;
        }

        const spatialBuilder = spatialBuilders[option.name];
        if (spatialBuilder) {
            flushLut();
            stages.push({ kind: 'spatial', run: spatialBuilder(option.value as never) });
        }
    };

    for (const option of sorted) {
        buildStage(option);
    }

    flushLut();

    if (!stages.length) {
        return;
    }

    let image = host.imageData;

    const runStage = (stage: Stage): void => {
        switch (stage.kind) {
            case 'lut':
                applyChannelLut(image.data, stage.lut, host.width);
                break;
            case 'pixel':
                stage.run(image.data);
                break;
            case 'spatial':
                stage.run(image.data, host.width, host.height);
                break;
            case 'convolve': {
                const target = host.createImageData(image);
                applyConvolve(image, target, stage.kernel);
                image = target;
                break;
            }
            default:
                break;
        }
    };

    for (const stage of stages) {
        runStage(stage);
    }

    host.imageData = image;
};
