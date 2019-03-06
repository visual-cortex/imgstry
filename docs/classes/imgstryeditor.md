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
* [createImageData](imgstryeditor.md#createimagedata)
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

*Defined in [core/imgstry.processor.ts:34](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.processor.ts#L34)*

Height of the image.
*__type__*: {number}

*__memberof__*: ImgstryProcessor

___
<a id="width"></a>

### `<Abstract>` width

**● width**: *`number`*

*Inherited from ImgstryProcessor.width*

*Defined in [core/imgstry.processor.ts:27](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.processor.ts#L27)*

Width of the image.
*__type__*: {number}

*__memberof__*: ImgstryProcessor

___

## Accessors

<a id="histogram"></a>

###  histogram

gethistogram(): `HistogramData`

*Inherited from ImgstryProcessor.histogram*

*Defined in [core/imgstry.processor.ts:104](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.processor.ts#L104)*

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

*Defined in [core/imgstry.processor.ts:87](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.processor.ts#L87)*

Gets the image data.
*__abstract__*: 

*__type__*: {ImageData}

*__memberof__*: ImgstryProcessor

**Returns:** `ImageData`

*Inherited from ImgstryProcessor.imageData*

*Defined in [core/imgstry.processor.ts:95](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.processor.ts#L95)*

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

*Defined in [core/imgstry.processor.ts:135](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.processor.ts#L135)*

Applies a series of filters to the image.
*__memberof__*: ImgstryProcessor

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| options | `OperationOption`[] |  The set of operations. |
| `Optional` reset | `boolean` |

**Returns:** `ImgstryProcessor`
The current processor instance

___
<a id="blackandwhite"></a>

###  blackAndWhite

▸ **blackAndWhite**(ratio?: *[`number`, `number`, `number`]*): [ImgstryEditor](imgstryeditor.md)

*Defined in [core/imgstry.editor.ts:22](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.editor.ts#L22)*

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

*Defined in [core/imgstry.editor.ts:54](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.editor.ts#L54)*

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

*Defined in [core/imgstry.editor.ts:228](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.editor.ts#L228)*

Clears the operation list.
*__memberof__*: ImgstryEditor

**Returns:** `this`
the current editor instance

___
<a id="clone"></a>

### `<Abstract>` clone

▸ **clone**(source: *`ImageData`*): `ImageData`

*Inherited from ImgstryProcessor.clone*

*Defined in [core/imgstry.processor.ts:70](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.processor.ts#L70)*

Clone image data
*__abstract__*: 

*__memberof__*: ImgstryProcessor

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| source | `ImageData` |  The source image data. |

**Returns:** `ImageData`
The cloned canvas image data.

___
<a id="contrast"></a>

###  contrast

▸ **contrast**(value: *`number`*): [ImgstryEditor](imgstryeditor.md)

*Defined in [core/imgstry.editor.ts:38](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.editor.ts#L38)*

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

*Defined in [core/imgstry.editor.ts:213](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.editor.ts#L213)*

Apply a kernel to the active image
*__memberof__*: ImgstryEditor

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| kernel | [Kernel](kernel.md) \| `number`[][] |  a square matrice that will be applied to the image |

**Returns:** [ImgstryEditor](imgstryeditor.md)
the current editor instance

___
<a id="createimagedata"></a>

### `<Abstract>` createImageData

▸ **createImageData**(source: *`ImageData`*): `ImageData`

*Inherited from ImgstryProcessor.createImageData*

*Defined in [core/imgstry.processor.ts:79](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.processor.ts#L79)*

Create image data based on a source
*__abstract__*: 

*__memberof__*: ImgstryProcessor

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| source | `ImageData` |  The source image data. |

**Returns:** `ImageData`
The new image data.

___
<a id="fill"></a>

###  fill

▸ **fill**(color: *`string`*): [ImgstryEditor](imgstryeditor.md)

*Defined in [core/imgstry.editor.ts:197](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.editor.ts#L197)*

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

*Defined in [core/imgstry.editor.ts:118](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.editor.ts#L118)*

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

*Defined in [core/imgstry.editor.ts:86](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.editor.ts#L86)*

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

*Defined in [core/imgstry.editor.ts:165](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.editor.ts#L165)*

Invert the image colors.
*__memberof__*: ImgstryEditor

**Returns:** [ImgstryEditor](imgstryeditor.md)
the current editor instance

___
<a id="noise"></a>

###  noise

▸ **noise**(value: *`number`*): [ImgstryEditor](imgstryeditor.md)

*Defined in [core/imgstry.editor.ts:134](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.editor.ts#L134)*

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

*Defined in [core/imgstry.editor.ts:250](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.editor.ts#L250)*

Apply the requested operations to the image using a worker thread.
*__memberof__*: ImgstryEditor

**Returns:** `Promise`<[ImgstryEditor](imgstryeditor.md)>
a promise that resolves in the current editor instance

___
<a id="rendersync"></a>

###  renderSync

▸ **renderSync**(): [ImgstryEditor](imgstryeditor.md)

*Defined in [core/imgstry.editor.ts:239](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.editor.ts#L239)*

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
The current processor instance.

___
<a id="saturation"></a>

###  saturation

▸ **saturation**(value: *`number`*): [ImgstryEditor](imgstryeditor.md)

*Defined in [core/imgstry.editor.ts:70](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.editor.ts#L70)*

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

*Defined in [core/imgstry.editor.ts:102](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.editor.ts#L102)*

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

*Defined in [core/imgstry.editor.ts:181](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.editor.ts#L181)*

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
| type | `string` |  The standard MIME type for the image format to return. If you do not specify this parameter, the default value is a PNG format image. |

**Returns:** `string`
The image encoded as a data url.

___
<a id="vibrance"></a>

###  vibrance

▸ **vibrance**(value: *`number`*): [ImgstryEditor](imgstryeditor.md)

*Defined in [core/imgstry.editor.ts:150](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.editor.ts#L150)*

Increase / decrease image vibrance.
*__memberof__*: ImgstryEditor

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| value | `number` |  vibrance intensity |

**Returns:** [ImgstryEditor](imgstryeditor.md)
the current editor instance

___

