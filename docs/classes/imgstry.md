[imgstry](../README.md) > [Imgstry](../classes/imgstry.md)

# Class: Imgstry

(Exposes image processing methods for html canvas) Processor implementation for the web worker (Exposes image processing methods for html canvas)
*__export__*: 

*__class__*: Imgstry

*__extends__*: {ImgstryEditor}

*__implements__*: {IDisposable}

*__export__*: 

*__class__*: Imgstry

*__extends__*: {ImgstryProcessor}

*__class__*: Imgstry

## Hierarchy

↳  [ImgstryEditor](imgstryeditor.md)

 `ImgstryProcessor`

↳  [ImgstryEditor](imgstryeditor.md)

**↳ Imgstry**

## Implements

* [IDisposable](../interfaces/idisposable.md)

## Index

### Constructors

* [constructor](imgstry.md#constructor)

### Properties

* [canvas](imgstry.md#canvas)
* [context](imgstry.md#context)
* [getCanvas](imgstry.md#getcanvas)

### Accessors

* [height](imgstry.md#height)
* [histogram](imgstry.md#histogram)
* [imageData](imgstry.md#imagedata)
* [width](imgstry.md#width)

### Methods

* [batch](imgstry.md#batch)
* [blackAndWhite](imgstry.md#blackandwhite)
* [brightness](imgstry.md#brightness)
* [clear](imgstry.md#clear)
* [clone](imgstry.md#clone)
* [contrast](imgstry.md#contrast)
* [convolve](imgstry.md#convolve)
* [createImageData](imgstry.md#createimagedata)
* [dispose](imgstry.md#dispose)
* [drawImage](imgstry.md#drawimage)
* [fill](imgstry.md#fill)
* [gamma](imgstry.md#gamma)
* [hue](imgstry.md#hue)
* [invert](imgstry.md#invert)
* [noise](imgstry.md#noise)
* [render](imgstry.md#render)
* [renderSync](imgstry.md#rendersync)
* [reset](imgstry.md#reset)
* [saturation](imgstry.md#saturation)
* [sepia](imgstry.md#sepia)
* [tint](imgstry.md#tint)
* [toDataUrl](imgstry.md#todataurl)
* [vibrance](imgstry.md#vibrance)
* [loadImage](imgstry.md#loadimage)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new Imgstry**(canvas: *`HTMLCanvasElement`*, _options?: *`Partial`<[ImgstryBrowserOptions](../interfaces/imgstrybrowseroptions.md)>*): [Imgstry](imgstry.md)

*Defined in [platform/browser/imgstry/imgstry.browser.ts:68](https://github.com/visual-cortex/imgstry/blob/master/source/platform/browser/imgstry/imgstry.browser.ts#L68)*

Creates an instance of Imgstry.
*__constructor__*: 

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| canvas | `HTMLCanvasElement` |  (specifies the canvas base for imgstry) |
| `Optional` _options | `Partial`<[ImgstryBrowserOptions](../interfaces/imgstrybrowseroptions.md)> |  (specifies the canvas base for imgstry) |

**Returns:** [Imgstry](imgstry.md)

___

## Properties

<a id="canvas"></a>

###  canvas

**● canvas**: *`HTMLCanvasElement`*

*Defined in [platform/browser/imgstry/imgstry.browser.ts:78](https://github.com/visual-cortex/imgstry/blob/master/source/platform/browser/imgstry/imgstry.browser.ts#L78)*
*Defined in [platform/node/imgstry/imgstry.node.ts:26](https://github.com/visual-cortex/imgstry/blob/master/source/platform/node/imgstry/imgstry.node.ts#L26)*

(specifies the canvas base for imgstry)

___
<a id="context"></a>

###  context

**● context**: *`CanvasRenderingContext2D`*

*Defined in [platform/browser/imgstry/imgstry.browser.ts:58](https://github.com/visual-cortex/imgstry/blob/master/source/platform/browser/imgstry/imgstry.browser.ts#L58)*
*Defined in [platform/node/imgstry/imgstry.node.ts:25](https://github.com/visual-cortex/imgstry/blob/master/source/platform/node/imgstry/imgstry.node.ts#L25)*

___
<a id="getcanvas"></a>

### `<Static>` getCanvas

**● getCanvas**: *[getCanvas]()* =  getCanvas

*Defined in [platform/browser/imgstry/imgstry.browser.ts:55](https://github.com/visual-cortex/imgstry/blob/master/source/platform/browser/imgstry/imgstry.browser.ts#L55)*

___

## Accessors

<a id="height"></a>

###  height

getheight(): `number`

*Defined in [platform/node/imgstry/imgstry.node.ts:32](https://github.com/visual-cortex/imgstry/blob/master/source/platform/node/imgstry/imgstry.node.ts#L32)*

**Returns:** `number`

___
<a id="histogram"></a>

###  histogram

gethistogram(): `HistogramData`

*Inherited from ImgstryProcessor.histogram*

*Overrides ImgstryProcessor.histogram*

*Defined in [core/imgstry.processor.ts:104](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.processor.ts#L104)*

Returns the channel histogram of the image.
*__readonly__*: 

*__type__*: {HistogramData}

*__memberof__*: ImgstryProcessor

**Returns:** `HistogramData`

___
<a id="imagedata"></a>

###  imageData

getimageData(): `ImageData`setimageData(image: *`ImageData`*): `void`

*Defined in [platform/node/imgstry/imgstry.node.ts:84](https://github.com/visual-cortex/imgstry/blob/master/source/platform/node/imgstry/imgstry.node.ts#L84)*

**Returns:** `ImageData`

*Defined in [platform/node/imgstry/imgstry.node.ts:88](https://github.com/visual-cortex/imgstry/blob/master/source/platform/node/imgstry/imgstry.node.ts#L88)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| image | `ImageData` |

**Returns:** `void`

___
<a id="width"></a>

###  width

getwidth(): `number`

*Defined in [platform/node/imgstry/imgstry.node.ts:28](https://github.com/visual-cortex/imgstry/blob/master/source/platform/node/imgstry/imgstry.node.ts#L28)*

**Returns:** `number`

___

## Methods

<a id="batch"></a>

###  batch

▸ **batch**(options: *`OperationOption`[]*, reset?: *`boolean`*): `ImgstryProcessor`

*Inherited from ImgstryProcessor.batch*

*Overrides ImgstryProcessor.batch*

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

*Inherited from [ImgstryEditor](imgstryeditor.md).[blackAndWhite](imgstryeditor.md#blackandwhite)*

*Overrides [ImgstryEditor](imgstryeditor.md).[blackAndWhite](imgstryeditor.md#blackandwhite)*

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

*Inherited from [ImgstryEditor](imgstryeditor.md).[brightness](imgstryeditor.md#brightness)*

*Overrides [ImgstryEditor](imgstryeditor.md).[brightness](imgstryeditor.md#brightness)*

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

*Inherited from [ImgstryEditor](imgstryeditor.md).[clear](imgstryeditor.md#clear)*

*Overrides [ImgstryEditor](imgstryeditor.md).[clear](imgstryeditor.md#clear)*

*Defined in [core/imgstry.editor.ts:228](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.editor.ts#L228)*

Clears the operation list.
*__memberof__*: ImgstryEditor

**Returns:** `this`
the current editor instance

___
<a id="clone"></a>

###  clone

▸ **clone**(source: *`ImageData`*): `ImageData`

*Overrides ImgstryProcessor.clone*

*Defined in [platform/browser/imgstry/imgstry.browser.ts:118](https://github.com/visual-cortex/imgstry/blob/master/source/platform/browser/imgstry/imgstry.browser.ts#L118)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| source | `ImageData` |

**Returns:** `ImageData`

___
<a id="contrast"></a>

###  contrast

▸ **contrast**(value: *`number`*): [ImgstryEditor](imgstryeditor.md)

*Inherited from [ImgstryEditor](imgstryeditor.md).[contrast](imgstryeditor.md#contrast)*

*Overrides [ImgstryEditor](imgstryeditor.md).[contrast](imgstryeditor.md#contrast)*

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

*Inherited from [ImgstryEditor](imgstryeditor.md).[convolve](imgstryeditor.md#convolve)*

*Overrides [ImgstryEditor](imgstryeditor.md).[convolve](imgstryeditor.md#convolve)*

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

###  createImageData

▸ **createImageData**(source: *`ImageData`*): `ImageData`

*Overrides ImgstryProcessor.createImageData*

*Defined in [platform/browser/imgstry/imgstry.browser.ts:126](https://github.com/visual-cortex/imgstry/blob/master/source/platform/browser/imgstry/imgstry.browser.ts#L126)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| source | `ImageData` |

**Returns:** `ImageData`

___
<a id="dispose"></a>

###  dispose

▸ **dispose**(): `void`

*Implementation of [IDisposable](../interfaces/idisposable.md).[dispose](../interfaces/idisposable.md#dispose)*

*Defined in [platform/browser/imgstry/imgstry.browser.ts:155](https://github.com/visual-cortex/imgstry/blob/master/source/platform/browser/imgstry/imgstry.browser.ts#L155)*

Destroys the thread and clears the canvas of data.
*__memberof__*: Imgstry

**Returns:** `void`

___
<a id="drawimage"></a>

###  drawImage

▸ **drawImage**(image: *`HTMLImageElement`*): `void`

*Defined in [platform/browser/imgstry/imgstry.browser.ts:96](https://github.com/visual-cortex/imgstry/blob/master/source/platform/browser/imgstry/imgstry.browser.ts#L96)*

Draws an image on the canvas.
*__memberof__*: Imgstry

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| image | `HTMLImageElement` |  the image to draw on the canvas |

**Returns:** `void`

___
<a id="fill"></a>

###  fill

▸ **fill**(color: *`string`*): [ImgstryEditor](imgstryeditor.md)

*Inherited from [ImgstryEditor](imgstryeditor.md).[fill](imgstryeditor.md#fill)*

*Overrides [ImgstryEditor](imgstryeditor.md).[fill](imgstryeditor.md#fill)*

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

*Inherited from [ImgstryEditor](imgstryeditor.md).[gamma](imgstryeditor.md#gamma)*

*Overrides [ImgstryEditor](imgstryeditor.md).[gamma](imgstryeditor.md#gamma)*

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

*Inherited from [ImgstryEditor](imgstryeditor.md).[hue](imgstryeditor.md#hue)*

*Overrides [ImgstryEditor](imgstryeditor.md).[hue](imgstryeditor.md#hue)*

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

*Inherited from [ImgstryEditor](imgstryeditor.md).[invert](imgstryeditor.md#invert)*

*Overrides [ImgstryEditor](imgstryeditor.md).[invert](imgstryeditor.md#invert)*

*Defined in [core/imgstry.editor.ts:165](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.editor.ts#L165)*

Invert the image colors.
*__memberof__*: ImgstryEditor

**Returns:** [ImgstryEditor](imgstryeditor.md)
the current editor instance

___
<a id="noise"></a>

###  noise

▸ **noise**(value: *`number`*): [ImgstryEditor](imgstryeditor.md)

*Inherited from [ImgstryEditor](imgstryeditor.md).[noise](imgstryeditor.md#noise)*

*Overrides [ImgstryEditor](imgstryeditor.md).[noise](imgstryeditor.md#noise)*

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

###  render

▸ **render**(): `Promise`<[Imgstry](imgstry.md)>

*Overrides [ImgstryEditor](imgstryeditor.md).[render](imgstryeditor.md#render)*

*Defined in [platform/browser/imgstry/imgstry.browser.ts:138](https://github.com/visual-cortex/imgstry/blob/master/source/platform/browser/imgstry/imgstry.browser.ts#L138)*

**Returns:** `Promise`<[Imgstry](imgstry.md)>

___
<a id="rendersync"></a>

###  renderSync

▸ **renderSync**(): [ImgstryEditor](imgstryeditor.md)

*Inherited from [ImgstryEditor](imgstryeditor.md).[renderSync](imgstryeditor.md#rendersync)*

*Overrides [ImgstryEditor](imgstryeditor.md).[renderSync](imgstryeditor.md#rendersync)*

*Defined in [core/imgstry.editor.ts:239](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.editor.ts#L239)*

Apply the requested operations to the image.
*__memberof__*: ImgstryEditor

**Returns:** [ImgstryEditor](imgstryeditor.md)
the current editor instance

___
<a id="reset"></a>

###  reset

▸ **reset**(): `ImgstryProcessor`

*Overrides ImgstryProcessor.reset*

*Defined in [platform/browser/imgstry/imgstry.browser.ts:113](https://github.com/visual-cortex/imgstry/blob/master/source/platform/browser/imgstry/imgstry.browser.ts#L113)*

**Returns:** `ImgstryProcessor`

___
<a id="saturation"></a>

###  saturation

▸ **saturation**(value: *`number`*): [ImgstryEditor](imgstryeditor.md)

*Inherited from [ImgstryEditor](imgstryeditor.md).[saturation](imgstryeditor.md#saturation)*

*Overrides [ImgstryEditor](imgstryeditor.md).[saturation](imgstryeditor.md#saturation)*

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

*Inherited from [ImgstryEditor](imgstryeditor.md).[sepia](imgstryeditor.md#sepia)*

*Overrides [ImgstryEditor](imgstryeditor.md).[sepia](imgstryeditor.md#sepia)*

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

*Inherited from [ImgstryEditor](imgstryeditor.md).[tint](imgstryeditor.md#tint)*

*Overrides [ImgstryEditor](imgstryeditor.md).[tint](imgstryeditor.md#tint)*

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

###  toDataUrl

▸ **toDataUrl**(type?: *`string`*): `string`

*Overrides ImgstryProcessor.toDataUrl*

*Defined in [platform/browser/imgstry/imgstry.browser.ts:109](https://github.com/visual-cortex/imgstry/blob/master/source/platform/browser/imgstry/imgstry.browser.ts#L109)*

Returns the content of the current canvas as an image that you can use as a source for another canvas or an HTML element.
*__memberof__*: Imgstry

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| `Default value` type | `string` | &quot;image/png&quot; |

**Returns:** `string`
The image encoded as a data url.

___
<a id="vibrance"></a>

###  vibrance

▸ **vibrance**(value: *`number`*): [ImgstryEditor](imgstryeditor.md)

*Inherited from [ImgstryEditor](imgstryeditor.md).[vibrance](imgstryeditor.md#vibrance)*

*Overrides [ImgstryEditor](imgstryeditor.md).[vibrance](imgstryeditor.md#vibrance)*

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
<a id="loadimage"></a>

### `<Static>` loadImage

▸ **loadImage**(src: *`string`*): `Promise`<`HTMLImageElement`>

▸ **loadImage**(src: *`string`*): `Promise`<`HTMLImageElement`>

*Defined in [platform/browser/imgstry/imgstry.browser.ts:56](https://github.com/visual-cortex/imgstry/blob/master/source/platform/browser/imgstry/imgstry.browser.ts#L56)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| src | `string` |

**Returns:** `Promise`<`HTMLImageElement`>

*Defined in [platform/node/imgstry/imgstry.node.ts:23](https://github.com/visual-cortex/imgstry/blob/master/source/platform/node/imgstry/imgstry.node.ts#L23)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| src | `string` |

**Returns:** `Promise`<`HTMLImageElement`>

___

