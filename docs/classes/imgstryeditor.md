[imgstry](../README.md) > [ImgstryEditor](../classes/imgstryeditor.md)

# Class: ImgstryEditor

Defines the imgstry editor schema.
*__export__*: 

*__interface__*: ImgstryEditor

*__template__*: T

## Hierarchy

 `ImgstryProcessor`

**↳ ImgstryEditor**

↳  [Imgstry](imgstry.md)

↳  [Imgstry](imgstry.md)

## Index

### Properties

* [height](imgstryeditor.md#height)
* [width](imgstryeditor.md#width)

### Accessors

* [histogram](imgstryeditor.md#histogram)
* [imageData](imgstryeditor.md#imagedata)

### Methods

* [batch](imgstryeditor.md#batch)
* [blackAndWhite](imgstryeditor.md#blackandwhite)
* [brightness](imgstryeditor.md#brightness)
* [clear](imgstryeditor.md#clear)
* [clone](imgstryeditor.md#clone)
* [contrast](imgstryeditor.md#contrast)
* [convolve](imgstryeditor.md#convolve)
* [fill](imgstryeditor.md#fill)
* [gamma](imgstryeditor.md#gamma)
* [hue](imgstryeditor.md#hue)
* [invert](imgstryeditor.md#invert)
* [noise](imgstryeditor.md#noise)
* [render](imgstryeditor.md#render)
* [renderSync](imgstryeditor.md#rendersync)
* [reset](imgstryeditor.md#reset)
* [saturation](imgstryeditor.md#saturation)
* [sepia](imgstryeditor.md#sepia)
* [tint](imgstryeditor.md#tint)
* [toDataUrl](imgstryeditor.md#todataurl)
* [vibrance](imgstryeditor.md#vibrance)

---

## Properties

<a id="height"></a>

### `<Abstract>` height

**● height**: *`number`*

*Inherited from ImgstryProcessor.height*

*Defined in [core/imgstry.processor.ts:35](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.processor.ts#L35)*

Height of the image.
*__type__*: {number}

*__memberof__*: ImgstryProcessor

___
<a id="width"></a>

### `<Abstract>` width

**● width**: *`number`*

*Inherited from ImgstryProcessor.width*

*Defined in [core/imgstry.processor.ts:28](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.processor.ts#L28)*

Width of the image.
*__type__*: {number}

*__memberof__*: ImgstryProcessor

___

## Accessors

<a id="histogram"></a>

###  histogram

gethistogram(): `HistogramData`

*Inherited from ImgstryProcessor.histogram*

*Defined in [core/imgstry.processor.ts:95](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.processor.ts#L95)*

Returns the channel histogram of the image.
*__readonly__*: 

*__type__*: {HistogramData}

*__memberof__*: ImgstryProcessor

**Returns:** `HistogramData`

___
<a id="imagedata"></a>

###  imageData

getimageData(): `ImageData`setimageData(imgData: *`ImageData`*): `any`

*Inherited from ImgstryProcessor.imageData*

*Defined in [core/imgstry.processor.ts:78](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.processor.ts#L78)*

Gets the image data.
*__abstract__*: 

*__type__*: {ImageData}

*__memberof__*: ImgstryProcessor

**Returns:** `ImageData`

*Inherited from ImgstryProcessor.imageData*

*Defined in [core/imgstry.processor.ts:86](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.processor.ts#L86)*

Sets the image data.
*__abstract__*: 

*__memberof__*: ImgstryProcessor

**Parameters:**

| Name | Type |
| ------ | ------ |
| imgData | `ImageData` |

**Returns:** `any`

___

## Methods

<a id="batch"></a>

###  batch

▸ **batch**(options: *`OperationOption`[]*, reset?: *`boolean`*): `ImgstryProcessor`

*Inherited from ImgstryProcessor.batch*

*Defined in [core/imgstry.processor.ts:126](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.processor.ts#L126)*

Applies a series of filters to the image.
*__memberof__*: ImgstryProcessor

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| options | `OperationOption`[] |  the set of operations |
| `Optional` reset | `boolean` |

**Returns:** `ImgstryProcessor`
the current processor instance

___
<a id="blackandwhite"></a>

###  blackAndWhite

▸ **blackAndWhite**(ratio?: *[`number`, `number`, `number`]*): [ImgstryEditor](imgstryeditor.md)

*Defined in [core/imgstry.editor.ts:23](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.editor.ts#L23)*

Turn the image black and white with the provided ratio.
*__memberof__*: ImgstryEditor

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` ratio | [`number`, `number`, `number`] |

**Returns:** [ImgstryEditor](imgstryeditor.md)
the current editor instance

___
<a id="brightness"></a>

###  brightness

▸ **brightness**(value: *`number`*): [ImgstryEditor](imgstryeditor.md)

*Defined in [core/imgstry.editor.ts:55](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.editor.ts#L55)*

Increase / decrease image brightness.
*__memberof__*: ImgstryEditor

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| value | `number` |  brightness intensity |

**Returns:** [ImgstryEditor](imgstryeditor.md)
the current editor instance

___
<a id="clear"></a>

###  clear

▸ **clear**(): `this`

*Defined in [core/imgstry.editor.ts:229](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.editor.ts#L229)*

Clears the operation list.
*__memberof__*: ImgstryEditor

**Returns:** `this`
the current editor instance

___
<a id="clone"></a>

### `<Abstract>` clone

▸ **clone**(original: *`ImageData`*): `ImageData`

*Inherited from ImgstryProcessor.clone*

*Defined in [core/imgstry.processor.ts:70](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.processor.ts#L70)*

Clone image data
*__abstract__*: 

*__memberof__*: ImgstryProcessor

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| original | `ImageData` |  source image data |

**Returns:** `ImageData`
the cloned canvas image data

___
<a id="contrast"></a>

###  contrast

▸ **contrast**(value: *`number`*): [ImgstryEditor](imgstryeditor.md)

*Defined in [core/imgstry.editor.ts:39](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.editor.ts#L39)*

Increase / decrease image constrast.
*__memberof__*: ImgstryEditor

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| value | `number` |  contrast intensity |

**Returns:** [ImgstryEditor](imgstryeditor.md)
the current editor instance

___
<a id="convolve"></a>

###  convolve

▸ **convolve**(kernel: *[Kernel](kernel.md) \| `number`[][]*): [ImgstryEditor](imgstryeditor.md)

*Defined in [core/imgstry.editor.ts:214](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.editor.ts#L214)*

Apply a kernel to the active image
*__memberof__*: ImgstryEditor

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| kernel | [Kernel](kernel.md) \| `number`[][] |  a square matrice that will be applied to the image |

**Returns:** [ImgstryEditor](imgstryeditor.md)
the current editor instance

___
<a id="fill"></a>

###  fill

▸ **fill**(color: *`string`*): [ImgstryEditor](imgstryeditor.md)

*Defined in [core/imgstry.editor.ts:198](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.editor.ts#L198)*

Fill the canvas with a color.
*__memberof__*: ImgstryEditor

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| color | `string` |  the hex color code of the desired tint |

**Returns:** [ImgstryEditor](imgstryeditor.md)
the current editor instance

___
<a id="gamma"></a>

###  gamma

▸ **gamma**(value: *`number`*): [ImgstryEditor](imgstryeditor.md)

*Defined in [core/imgstry.editor.ts:119](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.editor.ts#L119)*

Increase / decrease image gamma.
*__memberof__*: ImgstryEditor

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| value | `number` |  gamma intensity |

**Returns:** [ImgstryEditor](imgstryeditor.md)
the current editor instance

___
<a id="hue"></a>

###  hue

▸ **hue**(value: *`number`*): [ImgstryEditor](imgstryeditor.md)

*Defined in [core/imgstry.editor.ts:87](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.editor.ts#L87)*

Shift the image hue.
*__memberof__*: ImgstryEditor

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| value | `number` |  hue shift value (-180, 180) |

**Returns:** [ImgstryEditor](imgstryeditor.md)
the current editor instance

___
<a id="invert"></a>

###  invert

▸ **invert**(): [ImgstryEditor](imgstryeditor.md)

*Defined in [core/imgstry.editor.ts:166](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.editor.ts#L166)*

Invert the image colors.
*__memberof__*: ImgstryEditor

**Returns:** [ImgstryEditor](imgstryeditor.md)
the current editor instance

___
<a id="noise"></a>

###  noise

▸ **noise**(value: *`number`*): [ImgstryEditor](imgstryeditor.md)

*Defined in [core/imgstry.editor.ts:135](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.editor.ts#L135)*

Add a provided amount of noise to the image.
*__memberof__*: ImgstryEditor

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| value | `number` |  noise amount |

**Returns:** [ImgstryEditor](imgstryeditor.md)
the current editor instance

___
<a id="render"></a>

### `<Abstract>` render

▸ **render**(): `Promise`<[ImgstryEditor](imgstryeditor.md)>

*Defined in [core/imgstry.editor.ts:251](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.editor.ts#L251)*

Apply the requested operations to the image using a worker thread.
*__memberof__*: ImgstryEditor

**Returns:** `Promise`<[ImgstryEditor](imgstryeditor.md)>
a promise that resolves in the current editor instance

___
<a id="rendersync"></a>

###  renderSync

▸ **renderSync**(): [ImgstryEditor](imgstryeditor.md)

*Defined in [core/imgstry.editor.ts:240](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.editor.ts#L240)*

Apply the requested operations to the image.
*__memberof__*: ImgstryEditor

**Returns:** [ImgstryEditor](imgstryeditor.md)
the current editor instance

___
<a id="reset"></a>

### `<Abstract>` reset

▸ **reset**(): `ImgstryProcessor`

*Inherited from ImgstryProcessor.reset*

*Defined in [core/imgstry.processor.ts:61](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.processor.ts#L61)*

Resets the image to the original state.
*__abstract__*: 

*__memberof__*: ImgstryProcessor

**Returns:** `ImgstryProcessor`
the current processor instance

___
<a id="saturation"></a>

###  saturation

▸ **saturation**(value: *`number`*): [ImgstryEditor](imgstryeditor.md)

*Defined in [core/imgstry.editor.ts:71](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.editor.ts#L71)*

Increase / decrease image saturation.
*__memberof__*: ImgstryEditor

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| value | `number` |  saturation intensity |

**Returns:** [ImgstryEditor](imgstryeditor.md)
the current editor instance

___
<a id="sepia"></a>

###  sepia

▸ **sepia**(value: *`number`*): [ImgstryEditor](imgstryeditor.md)

*Defined in [core/imgstry.editor.ts:103](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.editor.ts#L103)*

Apply sepia with the specified intensity.
*__memberof__*: ImgstryEditor

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| value | `number` |  desired intensity of the sepia effect |

**Returns:** [ImgstryEditor](imgstryeditor.md)
the current editor instance

___
<a id="tint"></a>

###  tint

▸ **tint**(color: *`string`*): [ImgstryEditor](imgstryeditor.md)

*Defined in [core/imgstry.editor.ts:182](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.editor.ts#L182)*

Apply a color tint to the image.
*__memberof__*: ImgstryEditor

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| color | `string` |  the hex color code of the desired tint |

**Returns:** [ImgstryEditor](imgstryeditor.md)
the current editor instance

___
<a id="todataurl"></a>

### `<Abstract>` toDataUrl

▸ **toDataUrl**(type: *`string`*): `string`

*Inherited from ImgstryProcessor.toDataUrl*

*Defined in [core/imgstry.processor.ts:51](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.processor.ts#L51)*

Encodes the canvas data to a data URI.
*__memberof__*: Imgstry

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| type | `string` |  data url type (eg: 'image/png') |

**Returns:** `string`
url with the encoded image

___
<a id="vibrance"></a>

###  vibrance

▸ **vibrance**(value: *`number`*): [ImgstryEditor](imgstryeditor.md)

*Defined in [core/imgstry.editor.ts:151](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.editor.ts#L151)*

Increase / decrease image vibrance.
*__memberof__*: ImgstryEditor

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| value | `number` |  vibrance intensity |

**Returns:** [ImgstryEditor](imgstryeditor.md)
the current editor instance

___

