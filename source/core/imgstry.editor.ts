import { Operation } from '~/core/imgstry.operation';
import { ImgstryProcessor } from '~/core/imgstry.processor';
import {
    ChannelMixerMatrix,
    SplitToneOptions,
    VignetteOptions,
} from '~/core/pipeline';
import {
    OperationMethod,
    OperationOption,
    OperationValue,
    RenderTarget,
} from '~/core/types';
import { Kernel } from '~/kernel';

/**
 * Defines the imgstry editor schema.
 * @template T
 */
export abstract class ImgstryEditor extends ImgstryProcessor {
    protected _operations: OperationOption[] = [];

    /**
     * Turn the image black and white with the provided ratio.
     * @param [ratio] an array of rations for each RGB channel the total sum must be 1
     * @returns the current editor instance
     */
    public blackAndWhite(ratio?: [number, number, number]): ImgstryEditor {
        return this._recordOperation('blackAndWhite', ratio ?? Operation.DEFAULT.blackAndWhite.ratio);
    }

    /**
     * Increase / decrease image constrast.
     * @param value contrast intensity
     * @returns the current editor instance
     */
    public contrast(value: number): ImgstryEditor {
        return this._recordOperation('contrast', value);
    }

    /**
     * Increase / decrease image brightness.
     * @param value brightness intensity
     * @returns the current editor instance
     */
    public brightness(value: number): ImgstryEditor {
        return this._recordOperation('brightness', value);
    }

    /**
     * Increase / decrease image saturation.
     * @param value saturation intensity
     * @returns the current editor instance
     */
    public saturation(value: number): ImgstryEditor {
        return this._recordOperation('saturation', value);
    }

    /**
     * Shift the image hue.
     * @param value hue shift value (-180, 180)
     * @returns the current editor instance
     */
    public hue(value: number): ImgstryEditor {
        return this._recordOperation('hue', value);
    }

    /**
     * Apply sepia with the specified intensity.
     * @param value desired intensity of the sepia effect
     * @returns the current editor instance
     */
    public sepia(value: number): ImgstryEditor {
        return this._recordOperation('sepia', value);
    }

    /**
     * Increase / decrease image gamma.
     * @param value gamma intensity
     * @returns the current editor instance
     */
    public gamma(value: number): ImgstryEditor {
        return this._recordOperation('gamma', value);
    }

    /**
     * Add a provided amount of noise to the image.
     * @param value noise amount
     * @returns the current editor instance
     */
    public noise(value: number): ImgstryEditor {
        return this._recordOperation('noise', value);
    }

    /**
     * Increase / decrease image vibrance.
     * @param value vibrance intensity
     * @returns the current editor instance
     */
    public vibrance(value: number): ImgstryEditor {
        return this._recordOperation('vibrance', value);
    }

    /**
     * Invert the image colors.
     * @returns the current editor instance
     */
    public invert(): ImgstryEditor {
        return this._recordOperation('invert', null);
    }

    /**
     * Apply a color tint to the image.
     * @param color the hex color code of the desired tint
     * @returns the current editor instance
     */
    public tint(color: string): ImgstryEditor {
        return this._recordOperation('tint', color);
    }

    /**
     * Fill the canvas with a color.
     * @param color the hex color code of the desired tint
     * @returns the current editor instance
     */
    public fill(color: string): ImgstryEditor {
        return this._recordOperation('fill', color);
    }

    /**
     * Apply a kernel to the active image
     * @param kernel a square matrice that will be applied to the image
     * @returns the current editor instance
     */
    public convolve(kernel: Kernel | number[][]): ImgstryEditor {
        return this._recordOperation('convolve', kernel);
    }

    /**
     * Apply an exposure shift in stops (value 1 doubles, -1 halves).
     * @param stops exposure stops, [-5, 5]
     * @returns the current editor instance
     */
    public exposure(stops: number): ImgstryEditor {
        return this._recordOperation('exposure', stops);
    }

    /**
     * Shift the temperature toward cool (negative) or warm (positive).
     * @param value temperature shift, [-100, 100]
     * @returns the current editor instance
     */
    public temperature(value: number): ImgstryEditor {
        return this._recordOperation('temperature', value);
    }

    /**
     * Shift the green/magenta tint axis.
     * @param value tint shift, [-100, 100]
     * @returns the current editor instance
     */
    public tintShift(value: number): ImgstryEditor {
        return this._recordOperation('tintShift', value);
    }

    /**
     * Lift the shadow region of the tone range.
     * @param value adjustment, [-100, 100]
     * @returns the current editor instance
     */
    public shadows(value: number): ImgstryEditor {
        return this._recordOperation('shadows', value);
    }

    /**
     * Lift the highlight region of the tone range.
     * @param value adjustment, [-100, 100]
     * @returns the current editor instance
     */
    public highlights(value: number): ImgstryEditor {
        return this._recordOperation('highlights', value);
    }

    /**
     * Lift the extreme white region of the tone range.
     * @param value adjustment, [-100, 100]
     * @returns the current editor instance
     */
    public whites(value: number): ImgstryEditor {
        return this._recordOperation('whites', value);
    }

    /**
     * Lift the extreme black region of the tone range.
     * @param value adjustment, [-100, 100]
     * @returns the current editor instance
     */
    public blacks(value: number): ImgstryEditor {
        return this._recordOperation('blacks', value);
    }

    /**
     * Apply a levels remap (input range -> output range with gamma).
     * @param options levels parameters
     * @param options.inLow source range floor
     * @param options.inHigh source range ceiling
     * @param options.gamma midtone exponent
     * @param options.outLow destination range floor
     * @param options.outHigh destination range ceiling
     * @returns the current editor instance
     */
    public levels(options: {
        inLow?: number
        inHigh?: number
        gamma?: number
        outLow?: number
        outHigh?: number
    }): ImgstryEditor {
        return this._recordOperation('levels', options);
    }

    /**
     * Apply a precomputed tone curve as a per-channel mapping.
     * @param mapping per-channel or shared 256-entry mapping
     * @param mapping.r red channel mapping
     * @param mapping.g green channel mapping
     * @param mapping.b blue channel mapping
     * @param mapping.rgb shared mapping for all channels
     * @returns the current editor instance
     */
    public curve(mapping: { r?: number[]; g?: number[]; b?: number[]; rgb?: number[] }): ImgstryEditor {
        return this._recordOperation('curve', mapping);
    }

    /**
     * Apply a luminance-based local contrast boost.
     * @param value clarity amount, [-100, 100]
     * @returns the current editor instance
     */
    public clarity(value: number): ImgstryEditor {
        return this._recordOperation('clarity', value);
    }

    /**
     * Apply a radial vignette.
     * @param options vignette parameters
     * @returns the current editor instance
     */
    public vignette(options: VignetteOptions): ImgstryEditor {
        return this._recordOperation('vignette', options);
    }

    /**
     * Apply a 3x3 channel mixer matrix.
     * @param matrix the mixer matrix
     * @returns the current editor instance
     */
    public channelMixer(matrix: ChannelMixerMatrix): ImgstryEditor {
        return this._recordOperation('channelMixer', matrix);
    }

    /**
     * Tone the shadow and highlight regions with two different hues.
     * @param options split tone parameters
     * @returns the current editor instance
     */
    public splitTone(options: SplitToneOptions): ImgstryEditor {
        return this._recordOperation('splitTone', options);
    }

    /**
     * Clears the operation list.
     * @returns the current editor instance
     */
    public clear() {
        this._operations = [];
        return this;
    }

    /**
     * Apply the requested operations to the image.
     * @param target the processing target
     * @returns the current editor instance
     */
    public renderSync(target: RenderTarget = 'current'): ImgstryEditor {
        this.batch(this._operations, target === 'original');
        return this.clear();
    }

    private _recordOperation = (name: OperationMethod, value: OperationValue) => {
        this._operations.push({
            name,
            value,
            priority: this._operations.length,
        });
        return this;
    };

    /**
     * Apply the requested operations to the image using a worker thread.
     * @param {RenderTarget} target the processing target
     * @returns {Promise<T>} a promise that resolves in the current editor instance
     */
    public abstract render(target: RenderTarget): Promise<ImgstryEditor>;
}
