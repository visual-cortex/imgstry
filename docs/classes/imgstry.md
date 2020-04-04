[imgstry](../README.md) › [Globals](../globals.md) › [Imgstry](imgstry.md)

# Class: Imgstry

(Exposes image processing methods for html canvas)
Processor implementation for the web worker
(Exposes image processing methods for html canvas)

**`export`** 

**`implements`** {IDisposable}

**`export`** 

## Hierarchy

  ↳ [ImgstryEditor](imgstryeditor.md)

* ImgstryProcessor

  ↳ [ImgstryEditor](imgstryeditor.md)

  ↳ **Imgstry**

## Implements

* [IDisposable](../interfaces/idisposable.md)

## Index

### Constructors

* [constructor](imgstry.md#constructor)

### Properties

* [canvas](imgstry.md#canvas)
* [context](imgstry.md#context)
* [draw$](imgstry.md#draw)
* [histogram$](imgstry.md#histogram)
* [getCanvas](imgstry.md#static-getcanvas)

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
* [loadImage](imgstry.md#static-loadimage)

## Constructors

###  constructor

\+ **new Imgstry**(`canvas`: HTMLCanvasElement, `_options?`: Partial‹[ImgstryBrowserOptions](../interfaces/imgstrybrowseroptions.md)›): *[Imgstry](imgstry.md)*

*Defined in [platform/browser/imgstry/imgstry.browser.ts:89](https://github.com/visual-cortex/imgstry/blob/master/source/platform/browser/imgstry/imgstry.browser.ts#L89)*

Creates an instance of Imgstry.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`canvas` | HTMLCanvasElement | (specifies the canvas base for imgstry) |
`_options?` | Partial‹[ImgstryBrowserOptions](../interfaces/imgstrybrowseroptions.md)› | (specifies the canvas base for imgstry) |

**Returns:** *[Imgstry](imgstry.md)*

## Properties

###  canvas

• **canvas**: *HTMLCanvasElement*

*Defined in [platform/browser/imgstry/imgstry.browser.ts:99](https://github.com/visual-cortex/imgstry/blob/master/source/platform/browser/imgstry/imgstry.browser.ts#L99)*

*Defined in [platform/node/imgstry/imgstry.node.ts:29](https://github.com/visual-cortex/imgstry/blob/master/source/platform/node/imgstry/imgstry.node.ts#L29)*

(specifies the canvas base for imgstry)

___

###  context

• **context**: *CanvasRenderingContext2D*

*Defined in [platform/browser/imgstry/imgstry.browser.ts:72](https://github.com/visual-cortex/imgstry/blob/master/source/platform/browser/imgstry/imgstry.browser.ts#L72)*

*Defined in [platform/node/imgstry/imgstry.node.ts:28](https://github.com/visual-cortex/imgstry/blob/master/source/platform/node/imgstry/imgstry.node.ts#L28)*

___

###  draw$

• **draw$**: *Subject‹unknown›* = new Subject()

*Defined in [platform/browser/imgstry/imgstry.browser.ts:74](https://github.com/visual-cortex/imgstry/blob/master/source/platform/browser/imgstry/imgstry.browser.ts#L74)*

___

###  histogram$

• **histogram$**: *Observable‹HistogramData›* = this.draw$.pipe(
    startWith(void 0),
    map(() => this.histogram),
    shareReplay(1),
  )

*Defined in [platform/browser/imgstry/imgstry.browser.ts:75](https://github.com/visual-cortex/imgstry/blob/master/source/platform/browser/imgstry/imgstry.browser.ts#L75)*

___

### `Static` getCanvas

▪ **getCanvas**: *getCanvas* = getCanvas

*Defined in [platform/browser/imgstry/imgstry.browser.ts:69](https://github.com/visual-cortex/imgstry/blob/master/source/platform/browser/imgstry/imgstry.browser.ts#L69)*

## Accessors

###  height

• **get height**(): *number*

*Defined in [platform/node/imgstry/imgstry.node.ts:35](https://github.com/visual-cortex/imgstry/blob/master/source/platform/node/imgstry/imgstry.node.ts#L35)*

**Returns:** *number*

___

###  histogram

• **get histogram**(): *HistogramData*

*Inherited from void*

*Overrides void*

*Defined in [core/imgstry.processor.ts:106](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.processor.ts#L106)*

Returns the channel histogram of the image.

**`readonly`** 

**`memberof`** ImgstryProcessor

**Returns:** *HistogramData*

___

###  imageData

• **get imageData**(): *ImageData*

*Defined in [platform/node/imgstry/imgstry.node.ts:88](https://github.com/visual-cortex/imgstry/blob/master/source/platform/node/imgstry/imgstry.node.ts#L88)*

**Returns:** *ImageData*

• **set imageData**(`image`: ImageData): *void*

*Defined in [platform/node/imgstry/imgstry.node.ts:92](https://github.com/visual-cortex/imgstry/blob/master/source/platform/node/imgstry/imgstry.node.ts#L92)*

**Parameters:**

Name | Type |
------ | ------ |
`image` | ImageData |

**Returns:** *void*

___

###  width

• **get width**(): *number*

*Defined in [platform/node/imgstry/imgstry.node.ts:31](https://github.com/visual-cortex/imgstry/blob/master/source/platform/node/imgstry/imgstry.node.ts#L31)*

**Returns:** *number*

## Methods

###  batch

▸ **batch**(`options`: OperationOption[], `reset?`: undefined | false | true): *ImgstryProcessor*

*Inherited from void*

*Overrides void*

*Defined in [core/imgstry.processor.ts:136](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.processor.ts#L136)*

Applies a series of filters to the image.

**`memberof`** ImgstryProcessor

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`options` | OperationOption[] | The set of operations. |
`reset?` | undefined &#124; false &#124; true | - |

**Returns:** *ImgstryProcessor*

The current processor instance

___

###  blackAndWhite

▸ **blackAndWhite**(`ratio?`: [number, number, number]): *[ImgstryEditor](imgstryeditor.md)*

*Inherited from [ImgstryEditor](imgstryeditor.md).[blackAndWhite](imgstryeditor.md#blackandwhite)*

*Overrides [ImgstryEditor](imgstryeditor.md).[blackAndWhite](imgstryeditor.md#blackandwhite)*

*Defined in [core/imgstry.editor.ts:28](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.editor.ts#L28)*

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

*Inherited from [ImgstryEditor](imgstryeditor.md).[brightness](imgstryeditor.md#brightness)*

*Overrides [ImgstryEditor](imgstryeditor.md).[brightness](imgstryeditor.md#brightness)*

*Defined in [core/imgstry.editor.ts:50](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.editor.ts#L50)*

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

*Inherited from [ImgstryEditor](imgstryeditor.md).[clear](imgstryeditor.md#clear)*

*Overrides [ImgstryEditor](imgstryeditor.md).[clear](imgstryeditor.md#clear)*

*Defined in [core/imgstry.editor.ts:169](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.editor.ts#L169)*

Clears the operation list.

**`memberof`** ImgstryEditor

**Returns:** *this*

the current editor instance

___

###  clone

▸ **clone**(`source`: ImageData): *ImageData*

*Overrides void*

*Defined in [platform/browser/imgstry/imgstry.browser.ts:142](https://github.com/visual-cortex/imgstry/blob/master/source/platform/browser/imgstry/imgstry.browser.ts#L142)*

**Parameters:**

Name | Type |
------ | ------ |
`source` | ImageData |

**Returns:** *ImageData*

___

###  contrast

▸ **contrast**(`value`: number): *[ImgstryEditor](imgstryeditor.md)*

*Inherited from [ImgstryEditor](imgstryeditor.md).[contrast](imgstryeditor.md#contrast)*

*Overrides [ImgstryEditor](imgstryeditor.md).[contrast](imgstryeditor.md#contrast)*

*Defined in [core/imgstry.editor.ts:39](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.editor.ts#L39)*

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

*Inherited from [ImgstryEditor](imgstryeditor.md).[convolve](imgstryeditor.md#convolve)*

*Overrides [ImgstryEditor](imgstryeditor.md).[convolve](imgstryeditor.md#convolve)*

*Defined in [core/imgstry.editor.ts:159](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.editor.ts#L159)*

Apply a kernel to the active image

**`memberof`** ImgstryEditor

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`kernel` | [Kernel](kernel.md) &#124; number[][] | a square matrice that will be applied to the image |

**Returns:** *[ImgstryEditor](imgstryeditor.md)*

the current editor instance

___

###  createImageData

▸ **createImageData**(`source`: ImageData): *ImageData*

*Overrides void*

*Defined in [platform/browser/imgstry/imgstry.browser.ts:150](https://github.com/visual-cortex/imgstry/blob/master/source/platform/browser/imgstry/imgstry.browser.ts#L150)*

**Parameters:**

Name | Type |
------ | ------ |
`source` | ImageData |

**Returns:** *ImageData*

___

###  dispose

▸ **dispose**(): *void*

*Implementation of [IDisposable](../interfaces/idisposable.md)*

*Defined in [platform/browser/imgstry/imgstry.browser.ts:190](https://github.com/visual-cortex/imgstry/blob/master/source/platform/browser/imgstry/imgstry.browser.ts#L190)*

Destroys the thread and clears the canvas of data.

**`memberof`** Imgstry

**Returns:** *void*

___

###  drawImage

▸ **drawImage**(`image`: HTMLImageElement): *void*

*Defined in [platform/browser/imgstry/imgstry.browser.ts:117](https://github.com/visual-cortex/imgstry/blob/master/source/platform/browser/imgstry/imgstry.browser.ts#L117)*

Draws an image on the canvas.

**`memberof`** Imgstry

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`image` | HTMLImageElement | the image to draw on the canvas |

**Returns:** *void*

___

###  fill

▸ **fill**(`color`: string): *[ImgstryEditor](imgstryeditor.md)*

*Inherited from [ImgstryEditor](imgstryeditor.md).[fill](imgstryeditor.md#fill)*

*Overrides [ImgstryEditor](imgstryeditor.md).[fill](imgstryeditor.md#fill)*

*Defined in [core/imgstry.editor.ts:148](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.editor.ts#L148)*

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

*Inherited from [ImgstryEditor](imgstryeditor.md).[gamma](imgstryeditor.md#gamma)*

*Overrides [ImgstryEditor](imgstryeditor.md).[gamma](imgstryeditor.md#gamma)*

*Defined in [core/imgstry.editor.ts:94](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.editor.ts#L94)*

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

*Inherited from [ImgstryEditor](imgstryeditor.md).[hue](imgstryeditor.md#hue)*

*Overrides [ImgstryEditor](imgstryeditor.md).[hue](imgstryeditor.md#hue)*

*Defined in [core/imgstry.editor.ts:72](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.editor.ts#L72)*

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

*Inherited from [ImgstryEditor](imgstryeditor.md).[invert](imgstryeditor.md#invert)*

*Overrides [ImgstryEditor](imgstryeditor.md).[invert](imgstryeditor.md#invert)*

*Defined in [core/imgstry.editor.ts:126](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.editor.ts#L126)*

Invert the image colors.

**`memberof`** ImgstryEditor

**Returns:** *[ImgstryEditor](imgstryeditor.md)*

the current editor instance

___

###  noise

▸ **noise**(`value`: number): *[ImgstryEditor](imgstryeditor.md)*

*Inherited from [ImgstryEditor](imgstryeditor.md).[noise](imgstryeditor.md#noise)*

*Overrides [ImgstryEditor](imgstryeditor.md).[noise](imgstryeditor.md#noise)*

*Defined in [core/imgstry.editor.ts:105](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.editor.ts#L105)*

Add a provided amount of noise to the image.

**`memberof`** ImgstryEditor

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | number | noise amount |

**Returns:** *[ImgstryEditor](imgstryeditor.md)*

the current editor instance

___

###  render

▸ **render**(`target`: RenderTarget): *Promise‹[Imgstry](imgstry.md)›*

*Overrides [ImgstryEditor](imgstryeditor.md).[render](imgstryeditor.md#abstract-render)*

*Defined in [platform/browser/imgstry/imgstry.browser.ts:168](https://github.com/visual-cortex/imgstry/blob/master/source/platform/browser/imgstry/imgstry.browser.ts#L168)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`target` | RenderTarget | "current" |

**Returns:** *Promise‹[Imgstry](imgstry.md)›*

___

###  renderSync

▸ **renderSync**(`target`: RenderTarget): *[Imgstry](imgstry.md)*

*Overrides [ImgstryEditor](imgstryeditor.md).[renderSync](imgstryeditor.md#rendersync)*

*Defined in [platform/browser/imgstry/imgstry.browser.ts:162](https://github.com/visual-cortex/imgstry/blob/master/source/platform/browser/imgstry/imgstry.browser.ts#L162)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`target` | RenderTarget | "current" |

**Returns:** *[Imgstry](imgstry.md)*

___

###  reset

▸ **reset**(): *ImgstryProcessor*

*Overrides void*

*Defined in [platform/browser/imgstry/imgstry.browser.ts:136](https://github.com/visual-cortex/imgstry/blob/master/source/platform/browser/imgstry/imgstry.browser.ts#L136)*

**Returns:** *ImgstryProcessor*

___

###  saturation

▸ **saturation**(`value`: number): *[ImgstryEditor](imgstryeditor.md)*

*Inherited from [ImgstryEditor](imgstryeditor.md).[saturation](imgstryeditor.md#saturation)*

*Overrides [ImgstryEditor](imgstryeditor.md).[saturation](imgstryeditor.md#saturation)*

*Defined in [core/imgstry.editor.ts:61](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.editor.ts#L61)*

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

*Inherited from [ImgstryEditor](imgstryeditor.md).[sepia](imgstryeditor.md#sepia)*

*Overrides [ImgstryEditor](imgstryeditor.md).[sepia](imgstryeditor.md#sepia)*

*Defined in [core/imgstry.editor.ts:83](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.editor.ts#L83)*

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

*Inherited from [ImgstryEditor](imgstryeditor.md).[tint](imgstryeditor.md#tint)*

*Overrides [ImgstryEditor](imgstryeditor.md).[tint](imgstryeditor.md#tint)*

*Defined in [core/imgstry.editor.ts:137](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.editor.ts#L137)*

Apply a color tint to the image.

**`memberof`** ImgstryEditor

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`color` | string | the hex color code of the desired tint |

**Returns:** *[ImgstryEditor](imgstryeditor.md)*

the current editor instance

___

###  toDataUrl

▸ **toDataUrl**(`type`: string): *string*

*Overrides void*

*Defined in [platform/browser/imgstry/imgstry.browser.ts:132](https://github.com/visual-cortex/imgstry/blob/master/source/platform/browser/imgstry/imgstry.browser.ts#L132)*

Returns the content of the current canvas as an image that you can use as a source for another canvas or an HTML element.

**`memberof`** Imgstry

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`type` | string | "image/png" |

**Returns:** *string*

The image encoded as a data url.

___

###  vibrance

▸ **vibrance**(`value`: number): *[ImgstryEditor](imgstryeditor.md)*

*Inherited from [ImgstryEditor](imgstryeditor.md).[vibrance](imgstryeditor.md#vibrance)*

*Overrides [ImgstryEditor](imgstryeditor.md).[vibrance](imgstryeditor.md#vibrance)*

*Defined in [core/imgstry.editor.ts:116](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.editor.ts#L116)*

Increase / decrease image vibrance.

**`memberof`** ImgstryEditor

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | number | vibrance intensity |

**Returns:** *[ImgstryEditor](imgstryeditor.md)*

the current editor instance

___

### `Static` loadImage

▸ **loadImage**(`src`: string): *Promise‹HTMLImageElement›*

*Defined in [platform/browser/imgstry/imgstry.browser.ts:70](https://github.com/visual-cortex/imgstry/blob/master/source/platform/browser/imgstry/imgstry.browser.ts#L70)*

**Parameters:**

Name | Type |
------ | ------ |
`src` | string |

**Returns:** *Promise‹HTMLImageElement›*

▸ **loadImage**(`src`: string): *Promise‹HTMLImageElement›*

*Defined in [platform/node/imgstry/imgstry.node.ts:26](https://github.com/visual-cortex/imgstry/blob/master/source/platform/node/imgstry/imgstry.node.ts#L26)*

**Parameters:**

Name | Type |
------ | ------ |
`src` | string |

**Returns:** *Promise‹HTMLImageElement›*
