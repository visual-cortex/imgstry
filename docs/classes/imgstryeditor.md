[imgstry](../README.md) › [Globals](../globals.md) › [ImgstryEditor](imgstryeditor.md)

# Class: ImgstryEditor

Defines the imgstry editor schema.

**`export`** 

**`interface`** ImgstryEditor

**`template`** 

## Hierarchy

* ImgstryProcessor

  ↳ **ImgstryEditor**

  ↳ [Imgstry](imgstry.md)

  ↳ [Imgstry](imgstry.md)

## Index

### Properties

* [height](imgstryeditor.md#abstract-height)
* [width](imgstryeditor.md#abstract-width)

### Accessors

* [histogram](imgstryeditor.md#histogram)
* [imageData](imgstryeditor.md#imagedata)

### Methods

* [batch](imgstryeditor.md#batch)
* [blackAndWhite](imgstryeditor.md#blackandwhite)
* [brightness](imgstryeditor.md#brightness)
* [clear](imgstryeditor.md#clear)
* [clone](imgstryeditor.md#abstract-clone)
* [contrast](imgstryeditor.md#contrast)
* [convolve](imgstryeditor.md#convolve)
* [createImageData](imgstryeditor.md#abstract-createimagedata)
* [fill](imgstryeditor.md#fill)
* [gamma](imgstryeditor.md#gamma)
* [hue](imgstryeditor.md#hue)
* [invert](imgstryeditor.md#invert)
* [noise](imgstryeditor.md#noise)
* [render](imgstryeditor.md#abstract-render)
* [renderSync](imgstryeditor.md#rendersync)
* [reset](imgstryeditor.md#abstract-reset)
* [saturation](imgstryeditor.md#saturation)
* [sepia](imgstryeditor.md#sepia)
* [tint](imgstryeditor.md#tint)
* [toDataUrl](imgstryeditor.md#abstract-todataurl)
* [vibrance](imgstryeditor.md#vibrance)

## Properties

### `Abstract` height

• **height**: *number*

*Inherited from void*

*Defined in [core/imgstry.processor.ts:34](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.processor.ts#L34)*

Height of the image.

**`memberof`** ImgstryProcessor

___

### `Abstract` width

• **width**: *number*

*Inherited from void*

*Defined in [core/imgstry.processor.ts:27](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.processor.ts#L27)*

Width of the image.

**`memberof`** ImgstryProcessor

## Accessors

###  histogram

• **get histogram**(): *HistogramData*

*Inherited from void*

*Defined in [core/imgstry.processor.ts:104](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.processor.ts#L104)*

Returns the channel histogram of the image.

**`readonly`** 

**`memberof`** ImgstryProcessor

**Returns:** *HistogramData*

___

###  imageData

• **get imageData**(): *ImageData*

*Inherited from void*

*Defined in [core/imgstry.processor.ts:87](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.processor.ts#L87)*

Gets the image data.

**`abstract`** 

**`memberof`** ImgstryProcessor

**Returns:** *ImageData*

• **set imageData**(`imgData`: ImageData): *any*

*Inherited from void*

*Defined in [core/imgstry.processor.ts:95](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.processor.ts#L95)*

Sets the image data.

**`abstract`** 

**`memberof`** ImgstryProcessor

**Parameters:**

Name | Type |
------ | ------ |
`imgData` | ImageData |

**Returns:** *any*

## Methods

###  batch

▸ **batch**(`options`: OperationOption[], `reset?`: boolean): *ImgstryProcessor*

*Inherited from void*

*Defined in [core/imgstry.processor.ts:135](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.processor.ts#L135)*

Applies a series of filters to the image.

**`memberof`** ImgstryProcessor

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`options` | OperationOption[] | The set of operations. |
`reset?` | boolean | - |

**Returns:** *ImgstryProcessor*

The current processor instance

___

###  blackAndWhite

▸ **blackAndWhite**(`ratio?`: [number, number, number]): *[ImgstryEditor](imgstryeditor.md)*

*Defined in [core/imgstry.editor.ts:26](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.editor.ts#L26)*

Turn the image black and white with the provided ratio.

**`memberof`** ImgstryEditor

**Parameters:**

Name | Type |
------ | ------ |
`ratio?` | [number, number, number] |

**Returns:** *[ImgstryEditor](imgstryeditor.md)*

the current editor instance

___

###  brightness

▸ **brightness**(`value`: number): *[ImgstryEditor](imgstryeditor.md)*

*Defined in [core/imgstry.editor.ts:48](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.editor.ts#L48)*

Increase / decrease image brightness.

**`memberof`** ImgstryEditor

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | number | brightness intensity |

**Returns:** *[ImgstryEditor](imgstryeditor.md)*

the current editor instance

___

###  clear

▸ **clear**(): *this*

*Defined in [core/imgstry.editor.ts:167](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.editor.ts#L167)*

Clears the operation list.

**`memberof`** ImgstryEditor

**Returns:** *this*

the current editor instance

___

### `Abstract` clone

▸ **clone**(`source`: ImageData): *ImageData*

*Inherited from void*

*Defined in [core/imgstry.processor.ts:70](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.processor.ts#L70)*

Clone image data

**`abstract`** 

**`memberof`** ImgstryProcessor

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`source` | ImageData | The source image data. |

**Returns:** *ImageData*

The cloned canvas image data.

___

###  contrast

▸ **contrast**(`value`: number): *[ImgstryEditor](imgstryeditor.md)*

*Defined in [core/imgstry.editor.ts:37](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.editor.ts#L37)*

Increase / decrease image constrast.

**`memberof`** ImgstryEditor

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | number | contrast intensity |

**Returns:** *[ImgstryEditor](imgstryeditor.md)*

the current editor instance

___

###  convolve

▸ **convolve**(`kernel`: [Kernel](kernel.md) | number[][]): *[ImgstryEditor](imgstryeditor.md)*

*Defined in [core/imgstry.editor.ts:157](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.editor.ts#L157)*

Apply a kernel to the active image

**`memberof`** ImgstryEditor

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`kernel` | [Kernel](kernel.md) &#124; number[][] | a square matrice that will be applied to the image |

**Returns:** *[ImgstryEditor](imgstryeditor.md)*

the current editor instance

___

### `Abstract` createImageData

▸ **createImageData**(`source`: ImageData): *ImageData*

*Inherited from void*

*Defined in [core/imgstry.processor.ts:79](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.processor.ts#L79)*

Create image data based on a source

**`abstract`** 

**`memberof`** ImgstryProcessor

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`source` | ImageData | The source image data. |

**Returns:** *ImageData*

The new image data.

___

###  fill

▸ **fill**(`color`: string): *[ImgstryEditor](imgstryeditor.md)*

*Defined in [core/imgstry.editor.ts:146](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.editor.ts#L146)*

Fill the canvas with a color.

**`memberof`** ImgstryEditor

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`color` | string | the hex color code of the desired tint |

**Returns:** *[ImgstryEditor](imgstryeditor.md)*

the current editor instance

___

###  gamma

▸ **gamma**(`value`: number): *[ImgstryEditor](imgstryeditor.md)*

*Defined in [core/imgstry.editor.ts:92](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.editor.ts#L92)*

Increase / decrease image gamma.

**`memberof`** ImgstryEditor

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | number | gamma intensity |

**Returns:** *[ImgstryEditor](imgstryeditor.md)*

the current editor instance

___

###  hue

▸ **hue**(`value`: number): *[ImgstryEditor](imgstryeditor.md)*

*Defined in [core/imgstry.editor.ts:70](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.editor.ts#L70)*

Shift the image hue.

**`memberof`** ImgstryEditor

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | number | hue shift value (-180, 180) |

**Returns:** *[ImgstryEditor](imgstryeditor.md)*

the current editor instance

___

###  invert

▸ **invert**(): *[ImgstryEditor](imgstryeditor.md)*

*Defined in [core/imgstry.editor.ts:124](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.editor.ts#L124)*

Invert the image colors.

**`memberof`** ImgstryEditor

**Returns:** *[ImgstryEditor](imgstryeditor.md)*

the current editor instance

___

###  noise

▸ **noise**(`value`: number): *[ImgstryEditor](imgstryeditor.md)*

*Defined in [core/imgstry.editor.ts:103](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.editor.ts#L103)*

Add a provided amount of noise to the image.

**`memberof`** ImgstryEditor

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | number | noise amount |

**Returns:** *[ImgstryEditor](imgstryeditor.md)*

the current editor instance

___

### `Abstract` render

▸ **render**(): *Promise‹[ImgstryEditor](imgstryeditor.md)›*

*Defined in [core/imgstry.editor.ts:189](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.editor.ts#L189)*

Apply the requested operations to the image using a worker thread.

**`memberof`** ImgstryEditor

**Returns:** *Promise‹[ImgstryEditor](imgstryeditor.md)›*

a promise that resolves in the current editor instance

___

###  renderSync

▸ **renderSync**(): *[ImgstryEditor](imgstryeditor.md)*

*Defined in [core/imgstry.editor.ts:178](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.editor.ts#L178)*

Apply the requested operations to the image.

**`memberof`** ImgstryEditor

**Returns:** *[ImgstryEditor](imgstryeditor.md)*

the current editor instance

___

### `Abstract` reset

▸ **reset**(): *ImgstryProcessor*

*Inherited from void*

*Defined in [core/imgstry.processor.ts:61](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.processor.ts#L61)*

Resets the image to the original state.

**`abstract`** 

**`memberof`** ImgstryProcessor

**Returns:** *ImgstryProcessor*

The current processor instance.

___

###  saturation

▸ **saturation**(`value`: number): *[ImgstryEditor](imgstryeditor.md)*

*Defined in [core/imgstry.editor.ts:59](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.editor.ts#L59)*

Increase / decrease image saturation.

**`memberof`** ImgstryEditor

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | number | saturation intensity |

**Returns:** *[ImgstryEditor](imgstryeditor.md)*

the current editor instance

___

###  sepia

▸ **sepia**(`value`: number): *[ImgstryEditor](imgstryeditor.md)*

*Defined in [core/imgstry.editor.ts:81](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.editor.ts#L81)*

Apply sepia with the specified intensity.

**`memberof`** ImgstryEditor

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | number | desired intensity of the sepia effect |

**Returns:** *[ImgstryEditor](imgstryeditor.md)*

the current editor instance

___

###  tint

▸ **tint**(`color`: string): *[ImgstryEditor](imgstryeditor.md)*

*Defined in [core/imgstry.editor.ts:135](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.editor.ts#L135)*

Apply a color tint to the image.

**`memberof`** ImgstryEditor

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`color` | string | the hex color code of the desired tint |

**Returns:** *[ImgstryEditor](imgstryeditor.md)*

the current editor instance

___

### `Abstract` toDataUrl

▸ **toDataUrl**(`type`: string): *string*

*Inherited from void*

*Defined in [core/imgstry.processor.ts:51](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.processor.ts#L51)*

Encodes the canvas data to a data URI.

**`memberof`** Imgstry

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`type` | string | The standard MIME type for the image format to return. If you do not specify this parameter, the default value is a PNG format image. |

**Returns:** *string*

The image encoded as a data url.

___

###  vibrance

▸ **vibrance**(`value`: number): *[ImgstryEditor](imgstryeditor.md)*

*Defined in [core/imgstry.editor.ts:114](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.editor.ts#L114)*

Increase / decrease image vibrance.

**`memberof`** ImgstryEditor

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | number | vibrance intensity |

**Returns:** *[ImgstryEditor](imgstryeditor.md)*

the current editor instance
