
import {
    type ChannelMixerMatrix,
    type SplitToneOptions,
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
} from './pixel';
import {
    type VignetteOptions,
    applyClarity,
    applyConvolve,
    applyVignette,
} from './spatial';
import {
    type CurveMapping,
    type LevelsOptions,
    type ToneRegion,
    applyBrightness,
    applyContrast,
    applyCurve,
    applyExposure,
    applyGain,
    applyGamma,
    applyInvert,
    applyLevels,
    applyToneRegion,
    temperatureGain,
    tintGain,
} from './tone';
import { OperationOption } from '~/core/types';
import { Kernel } from '~/kernel';

type FunctionStage = { kind: 'fn'; run: (data: Float32Array) => void };
type SpatialStage  = { kind: 'spatial'; run: (data: Float32Array, width: number, height: number) => void };
type ConvolveStage = { kind: 'convolve'; kernel: Kernel | number[][] };
type Stage = FunctionStage | SpatialStage | ConvolveStage;

const fnBuilders: Record<string, (value: any) => (data: Float32Array) => void> = {
    brightness:  (v: number) => (d) => applyBrightness(d, v),
    contrast:    (v: number) => (d) => applyContrast(d, v),
    gamma:       (v: number) => (d) => applyGamma(d, v),
    invert:      () => (d) => applyInvert(d),
    exposure:    (v: number) => (d) => applyExposure(d, v),
    levels:      (v: LevelsOptions) => (d) => applyLevels(d, v),
    temperature: (v: number) => (d) => applyGain(d, temperatureGain(v)),
    tintShift:   (v: number) => (d) => applyGain(d, tintGain(v)),
    shadows:     (v: number) => (d) => applyToneRegion(d, v, 'shadows' as ToneRegion),
    highlights:  (v: number) => (d) => applyToneRegion(d, v, 'highlights'),
    whites:      (v: number) => (d) => applyToneRegion(d, v, 'whites'),
    blacks:      (v: number) => (d) => applyToneRegion(d, v, 'blacks'),
    curve:       (v: CurveMapping) => (d) => applyCurve(d, v),
    saturation:  (v: number) => (d) => applySaturation(d, v),
    vibrance:    (v: number) => (d) => applyVibrance(d, v),
    sepia:       (v: number) => (d) => applySepia(d, v),
    noise:       (v: number) => (d) => applyNoise(d, v),
    hue:         (v: number) => (d) => applyHue(d, v),
    blackAndWhite: (ratio: [number, number, number]) => (d) => applyBlackAndWhite(d, ratio),
    tint:        (c: string) => (d) => applyTint(d, c),
    fill:        (c: string) => (d) => applyFill(d, c),
    channelMixer: (matrix: ChannelMixerMatrix) => (d) => applyChannelMixer(d, matrix),
    splitTone:   (opts: SplitToneOptions) => (d) => applySplitTone(d, opts),
};

const spatialBuilders: Record<string, (value: any) => (data: Float32Array, width: number, height: number) => void> = {
    vignette: (options: VignetteOptions) => (d, w, h) => applyVignette(d, w, h, options),
    clarity:  (value: number) => (d, w, h) => applyClarity(d, w, h, value),
};

export interface FloatPipelineHost {
    width: number
    height: number
    floatBuffer: Float32Array
    setFloatBuffer(buffer: Float32Array): void
}

/**
 * Runs a list of operations against a Float32 RGBA buffer in place.
 * Convolution produces a fresh buffer and replaces the host's buffer.
 * @param host the host providing the float buffer + dimensions
 * @param options the operations to apply, in priority order
 */
export const runFloatPipeline = (host: FloatPipelineHost, options: OperationOption[]): void => {
    if (!options.length) {
        return;
    }

    const sorted = [...options].sort((a, b) => a.priority - b.priority);
    const stages: Stage[] = [];

    for (const option of sorted) {
        if (option.name === 'convolve') {
            stages.push({ kind: 'convolve', kernel: option.value as Kernel | number[][] });
            continue;
        }
        const fn = fnBuilders[option.name];
        if (fn) {
            stages.push({ kind: 'fn', run: fn(option.value as never) });
            continue;
        }
        const spatial = spatialBuilders[option.name];
        if (spatial) {
            stages.push({ kind: 'spatial', run: spatial(option.value as never) });
        }
    }

    if (!stages.length) {
        return;
    }

    let buffer = host.floatBuffer;
    for (const stage of stages) {
        switch (stage.kind) {
            case 'fn':
                stage.run(buffer);
                break;
            case 'spatial':
                stage.run(buffer, host.width, host.height);
                break;
            case 'convolve':
                buffer = applyConvolve(buffer, host.width, host.height, stage.kernel);
                break;
            default:
                break;
        }
    }

    host.setFloatBuffer(buffer);
};
