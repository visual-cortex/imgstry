[imgstry](README.md) › [Globals](globals.md)

# imgstry

## Index

### Namespaces

* [Operation](globals.md#operation)

### Enumerations

* [ColorSpace](enums/colorspace.md)

### Classes

* [Cmyk](classes/cmyk.md)
* [CubicInterpolationSet](classes/cubicinterpolationset.md)
* [CubicSpline](classes/cubicspline.md)
* [Hex](classes/hex.md)
* [Hsv](classes/hsv.md)
* [Imgstry](classes/imgstry.md)
* [ImgstryEditor](classes/imgstryeditor.md)
* [ImgstrySpline](classes/imgstryspline.md)
* [Kernel](classes/kernel.md)
* [Pixel](classes/pixel.md)
* [Point](classes/point.md)
* [Rgb](classes/rgb.md)
* [SplinePointSet](classes/splinepointset.md)
* [SplineProcessor](classes/splineprocessor.md)

### Interfaces

* [ICircleOptions](interfaces/icircleoptions.md)
* [ICmyk](interfaces/icmyk.md)
* [IColor](interfaces/icolor.md)
* [IDisposable](interfaces/idisposable.md)
* [IGridOptions](interfaces/igridoptions.md)
* [IHsv](interfaces/ihsv.md)
* [IPoint](interfaces/ipoint.md)
* [IPointResult](interfaces/ipointresult.md)
* [IRgb](interfaces/irgb.md)
* [ISplineOptions](interfaces/isplineoptions.md)
* [ImageConstructor](interfaces/imageconstructor.md)
* [ImgstryBrowserOptions](interfaces/imgstrybrowseroptions.md)
* [KernelIndex](interfaces/kernelindex.md)

### Type aliases

* [FillPredicate](globals.md#fillpredicate)

### Variables

* [HISTO_FILLER](globals.md#const-histo_filler)
* [_selectorRegex](globals.md#const-_selectorregex)
* [worker](globals.md#const-worker)

### Functions

* [EdgeDetection](globals.md#const-edgedetection)
* [GaussianBlur](globals.md#const-gaussianblur)
* [assignDefault](globals.md#const-assigndefault)
* [clearCanvas](globals.md#const-clearcanvas)
* [drawCircle](globals.md#const-drawcircle)
* [drawGrid](globals.md#const-drawgrid)
* [drawHistogram](globals.md#const-drawhistogram)
* [drawImage](globals.md#const-drawimage)
* [emptyImageData](globals.md#const-emptyimagedata)
* [fillCanvas](globals.md#const-fillcanvas)
* [fillWith](globals.md#fillwith)
* [findLastIndex](globals.md#findlastindex)
* [getCanvas](globals.md#const-getcanvas)
* [getContext2D](globals.md#const-getcontext2d)
* [imageData](globals.md#const-imagedata)
* [loadImage](globals.md#const-loadimage)
* [setSize](globals.md#const-setsize)
* [splineTheme](globals.md#const-splinetheme)
* [uuid](globals.md#const-uuid)

### Object literals

* [DEFAULT](globals.md#const-default)
* [DEFAULT_OPTIONS](globals.md#const-default_options)

## Namespaces

###  Operation

• **Operation**:

*Defined in [core/imgstry.operation.ts:13](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.operation.ts#L13)*

### `Const` blackAndWhite

▸ **blackAndWhite**(`__namedParameters`: [number, number, number]): *(Anonymous function)*

*Defined in [core/imgstry.operation.ts:177](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.operation.ts#L177)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`__namedParameters` | [number, number, number] | DEFAULT.blackAndWhite.ratio |

**Returns:** *(Anonymous function)*

### `Const` brightness

▸ **brightness**(`value`: number): *(Anonymous function)*

*Defined in [core/imgstry.operation.ts:220](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.operation.ts#L220)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *(Anonymous function)*

### `Const` contrast

▸ **contrast**(`value`: number): *(Anonymous function)*

*Defined in [core/imgstry.operation.ts:200](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.operation.ts#L200)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *(Anonymous function)*

### `Const` fill

▸ **fill**(`color`: string): *(Anonymous function)*

*Defined in [core/imgstry.operation.ts:169](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.operation.ts#L169)*

**Parameters:**

Name | Type |
------ | ------ |
`color` | string |

**Returns:** *(Anonymous function)*

### `Const` gamma

▸ **gamma**(`value`: number): *(Anonymous function)*

*Defined in [core/imgstry.operation.ts:92](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.operation.ts#L92)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *(Anonymous function)*

### `Const` hue

▸ **hue**(`value`: number): *(Anonymous function)*

*Defined in [core/imgstry.operation.ts:42](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.operation.ts#L42)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *(Anonymous function)*

### `Const` invert

▸ **invert**(): *(Anonymous function)*

*Defined in [core/imgstry.operation.ts:141](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.operation.ts#L141)*

**Returns:** *(Anonymous function)*

### `Const` lookup

▸ **lookup**(`lut`: Record‹number, number›): *(Anonymous function)*

*Defined in [core/imgstry.operation.ts:32](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.operation.ts#L32)*

**Parameters:**

Name | Type |
------ | ------ |
`lut` | Record‹number, number› |

**Returns:** *(Anonymous function)*

### `Const` noise

▸ **noise**(`value`: number): *(Anonymous function)*

*Defined in [core/imgstry.operation.ts:106](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.operation.ts#L106)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *(Anonymous function)*

### `Const` saturation

▸ **saturation**(`value`: number): *(Anonymous function)*

*Defined in [core/imgstry.operation.ts:228](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.operation.ts#L228)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *(Anonymous function)*

### `Const` sepia

▸ **sepia**(`value`: number): *(Anonymous function)*

*Defined in [core/imgstry.operation.ts:76](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.operation.ts#L76)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *(Anonymous function)*

### `Const` tint

▸ **tint**(`color`: string): *(Anonymous function)*

*Defined in [core/imgstry.operation.ts:156](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.operation.ts#L156)*

**Parameters:**

Name | Type |
------ | ------ |
`color` | string |

**Returns:** *(Anonymous function)*

### `Const` vibrance

▸ **vibrance**(`value`: number): *(Anonymous function)*

*Defined in [core/imgstry.operation.ts:120](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.operation.ts#L120)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *(Anonymous function)*

### ▪ **DEFAULT**: *object*

*Defined in [core/imgstry.operation.ts:14](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.operation.ts#L14)*

* **blackAndWhite**: *object*

  * **ratio**: *[number, number, number]* = [.3, .59, .11] as [number, number, number]

* **rgb**: *object*

  * **max**: *number* = 255

  * **min**: *number* = 0

## Type aliases

###  FillPredicate

Ƭ **FillPredicate**: *number | function*

*Defined in [utils/array/fillWith.ts:2](https://github.com/visual-cortex/imgstry/blob/master/source/utils/array/fillWith.ts#L2)*

## Variables

### `Const` HISTO_FILLER

• **HISTO_FILLER**: *any[]* = Array(256).fill(0)

*Defined in [core/imgstry.processor.ts:11](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.processor.ts#L11)*

___

### `Const` _selectorRegex

• **_selectorRegex**: *RegExp* = /#[a-zA-Z]+[a-zA-Z0-9\-\_]+/

*Defined in [utils/dom/getCanvas.ts:1](https://github.com/visual-cortex/imgstry/blob/master/source/utils/dom/getCanvas.ts#L1)*

___

### `Const` worker

• **worker**: *Worker* = self as any as Worker

*Defined in [platform/browser/worker/imgstry.worker.ts:4](https://github.com/visual-cortex/imgstry/blob/master/source/platform/browser/worker/imgstry.worker.ts#L4)*

## Functions

### `Const` EdgeDetection

▸ **EdgeDetection**(): *number[][]*

*Defined in [kernel/collection/edge-detect.kernel.ts:5](https://github.com/visual-cortex/imgstry/blob/master/source/kernel/collection/edge-detect.kernel.ts#L5)*

**Returns:** *number[][]*

___

### `Const` GaussianBlur

▸ **GaussianBlur**(`radius`: number, `sigma`: number): *number[][]*

*Defined in [kernel/collection/gaussion.kernel.ts:8](https://github.com/visual-cortex/imgstry/blob/master/source/kernel/collection/gaussion.kernel.ts#L8)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`radius` | number | 3 |
`sigma` | number | 1 |

**Returns:** *number[][]*

___

### `Const` assignDefault

▸ **assignDefault**(`source`: Partial‹[ImgstryBrowserOptions](interfaces/imgstrybrowseroptions.md)›): *[ImgstryBrowserOptions](interfaces/imgstrybrowseroptions.md)*

*Defined in [platform/browser/imgstry/imgstry.browser.ts:45](https://github.com/visual-cortex/imgstry/blob/master/source/platform/browser/imgstry/imgstry.browser.ts#L45)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`source` | Partial‹[ImgstryBrowserOptions](interfaces/imgstrybrowseroptions.md)› | {} |

**Returns:** *[ImgstryBrowserOptions](interfaces/imgstrybrowseroptions.md)*

___

### `Const` clearCanvas

▸ **clearCanvas**(`canvas`: HTMLCanvasElement): *void*

*Defined in [utils/canvas/clearCanvas.ts:9](https://github.com/visual-cortex/imgstry/blob/master/source/utils/canvas/clearCanvas.ts#L9)*

**Parameters:**

Name | Type |
------ | ------ |
`canvas` | HTMLCanvasElement |

**Returns:** *void*

___

### `Const` drawCircle

▸ **drawCircle**(`canvas`: HTMLCanvasElement, `options`: [ICircleOptions](interfaces/icircleoptions.md)): *void*

*Defined in [utils/canvas/drawCircle.ts:17](https://github.com/visual-cortex/imgstry/blob/master/source/utils/canvas/drawCircle.ts#L17)*

**Parameters:**

Name | Type |
------ | ------ |
`canvas` | HTMLCanvasElement |
`options` | [ICircleOptions](interfaces/icircleoptions.md) |

**Returns:** *void*

___

### `Const` drawGrid

▸ **drawGrid**(`canvas`: HTMLCanvasElement, `__namedParameters`: object): *void*

*Defined in [utils/canvas/drawGrid.ts:16](https://github.com/visual-cortex/imgstry/blob/master/source/utils/canvas/drawGrid.ts#L16)*

**Parameters:**

▪ **canvas**: *HTMLCanvasElement*

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`color` | string |
`gridSize` | number |
`padding` | number |

**Returns:** *void*

___

### `Const` drawHistogram

▸ **drawHistogram**(`canvas`: HTMLCanvasElement, `channel`: number[], `color`: string): *void*

Defined in utils/canvas/drawHistogram.ts:3

**Parameters:**

Name | Type |
------ | ------ |
`canvas` | HTMLCanvasElement |
`channel` | number[] |
`color` | string |

**Returns:** *void*

___

### `Const` drawImage

▸ **drawImage**(`canvas`: HTMLCanvasElement, `image`: CanvasImageSource): *void*

*Defined in [utils/canvas/drawImage.ts:10](https://github.com/visual-cortex/imgstry/blob/master/source/utils/canvas/drawImage.ts#L10)*

**Parameters:**

Name | Type |
------ | ------ |
`canvas` | HTMLCanvasElement |
`image` | CanvasImageSource |

**Returns:** *void*

___

### `Const` emptyImageData

▸ **emptyImageData**(`canvas`: HTMLCanvasElement): *ImageData*

*Defined in [utils/canvas/emptyImageData.ts:9](https://github.com/visual-cortex/imgstry/blob/master/source/utils/canvas/emptyImageData.ts#L9)*

**Parameters:**

Name | Type |
------ | ------ |
`canvas` | HTMLCanvasElement |

**Returns:** *ImageData*

___

### `Const` fillCanvas

▸ **fillCanvas**(`canvas`: HTMLCanvasElement, `color`: string): *void*

*Defined in [utils/canvas/fillCanvas.ts:10](https://github.com/visual-cortex/imgstry/blob/master/source/utils/canvas/fillCanvas.ts#L10)*

**Parameters:**

Name | Type |
------ | ------ |
`canvas` | HTMLCanvasElement |
`color` | string |

**Returns:** *void*

___

###  fillWith

▸ **fillWith**(`count`: number, `predicateOrValue`: [FillPredicate](globals.md#fillpredicate)): *any[]*

*Defined in [utils/array/fillWith.ts:12](https://github.com/visual-cortex/imgstry/blob/master/source/utils/array/fillWith.ts#L12)*

Creates an array and fills it with the specified value

**`export`** 

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`count` | number | the number of elements the array should contain |
`predicateOrValue` | [FillPredicate](globals.md#fillpredicate) | the fill predicate |

**Returns:** *any[]*

the array with the requested value

___

###  findLastIndex

▸ **findLastIndex**<**T**>(`arr`: T[], `predicate`: function): *number*

*Defined in [utils/array/findLastIndex.ts:10](https://github.com/visual-cortex/imgstry/blob/master/source/utils/array/findLastIndex.ts#L10)*

Retrieves the last index that resolves the predicate

**`export`** 

**Type parameters:**

▪ **T**

**Parameters:**

▪ **arr**: *T[]*

the source array

▪ **predicate**: *function*

the predicate with the logic

▸ (`val`: T): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`val` | T |

**Returns:** *number*

the position of the found element, -1 if not found

___

### `Const` getCanvas

▸ **getCanvas**(`selector`: string | HTMLCanvasElement): *HTMLCanvasElement*

*Defined in [utils/dom/getCanvas.ts:9](https://github.com/visual-cortex/imgstry/blob/master/source/utils/dom/getCanvas.ts#L9)*

Retrieves the canvas elemented for a specified 'id'.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`selector` | string &#124; HTMLCanvasElement | canvas id selector or the canvas element |

**Returns:** *HTMLCanvasElement*

the canvas element

___

### `Const` getContext2D

▸ **getContext2D**(`canvas`: HTMLCanvasElement): *CanvasRenderingContext2D*

*Defined in [utils/canvas/getContext2D.ts:7](https://github.com/visual-cortex/imgstry/blob/master/source/utils/canvas/getContext2D.ts#L7)*

**Parameters:**

Name | Type |
------ | ------ |
`canvas` | HTMLCanvasElement |

**Returns:** *CanvasRenderingContext2D*

___

### `Const` imageData

▸ **imageData**(`canvas`: HTMLCanvasElement): *ImageData*

*Defined in [utils/canvas/imageData.ts:9](https://github.com/visual-cortex/imgstry/blob/master/source/utils/canvas/imageData.ts#L9)*

**Parameters:**

Name | Type |
------ | ------ |
`canvas` | HTMLCanvasElement |

**Returns:** *ImageData*

___

### `Const` loadImage

▸ **loadImage**(`ImageCtor`: [ImageConstructor](interfaces/imageconstructor.md), `src`: string): *Promise‹HTMLImageElement›*

*Defined in [utils/dom/loadImage.ts:12](https://github.com/visual-cortex/imgstry/blob/master/source/utils/dom/loadImage.ts#L12)*

**Parameters:**

Name | Type |
------ | ------ |
`ImageCtor` | [ImageConstructor](interfaces/imageconstructor.md) |
`src` | string |

**Returns:** *Promise‹HTMLImageElement›*

___

### `Const` setSize

▸ **setSize**(`canvas`: HTMLCanvasElement, `width`: number, `height`: number): *void*

*Defined in [utils/canvas/setSize.ts:9](https://github.com/visual-cortex/imgstry/blob/master/source/utils/canvas/setSize.ts#L9)*

**Parameters:**

Name | Type |
------ | ------ |
`canvas` | HTMLCanvasElement |
`width` | number |
`height` | number |

**Returns:** *void*

___

### `Const` splineTheme

▸ **splineTheme**(`theme`: Theme): *object*

*Defined in [platform/browser/spline/spline.theme.ts:3](https://github.com/visual-cortex/imgstry/blob/master/source/platform/browser/spline/spline.theme.ts#L3)*

**Parameters:**

Name | Type |
------ | ------ |
`theme` | Theme |

**Returns:** *object*

* **gridLine**: *string* = "#485460"

* **spline**: *string* = "#d2dae2"

* ### **anchor**: *object*

  * **hovered**: *string* = "#4bcffa"

  * **idle**: *string* = "#05c46b"

___

### `Const` uuid

▸ **uuid**(): *string*

*Defined in [utils/random/uuid.ts:7](https://github.com/visual-cortex/imgstry/blob/master/source/utils/random/uuid.ts#L7)*

**Returns:** *string*

## Object literals

### `Const` DEFAULT

### ▪ **DEFAULT**: *object*

*Defined in [pixel/color/spaces/rgb.ts:15](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/rgb.ts#L15)*

*Defined in [pixel/color/spaces/hsv.ts:15](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/hsv.ts#L15)*

*Defined in [pixel/color/spaces/cmyk.ts:16](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/cmyk.ts#L16)*

###  b

• **b**: *number* = 0

*Defined in [pixel/color/spaces/rgb.ts:18](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/rgb.ts#L18)*

###  c

• **c**: *number* = 0

*Defined in [pixel/color/spaces/cmyk.ts:17](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/cmyk.ts#L17)*

###  g

• **g**: *number* = 0

*Defined in [pixel/color/spaces/rgb.ts:17](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/rgb.ts#L17)*

###  h

• **h**: *number* = 0

*Defined in [pixel/color/spaces/hsv.ts:16](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/hsv.ts#L16)*

###  k

• **k**: *number* = 0

*Defined in [pixel/color/spaces/cmyk.ts:20](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/cmyk.ts#L20)*

###  m

• **m**: *number* = 0

*Defined in [pixel/color/spaces/cmyk.ts:18](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/cmyk.ts#L18)*

###  r

• **r**: *number* = 0

*Defined in [pixel/color/spaces/rgb.ts:16](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/rgb.ts#L16)*

###  s

• **s**: *number* = 0

*Defined in [pixel/color/spaces/hsv.ts:17](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/hsv.ts#L17)*

###  v

• **v**: *number* = 0

*Defined in [pixel/color/spaces/hsv.ts:18](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/hsv.ts#L18)*

###  y

• **y**: *number* = 0

*Defined in [pixel/color/spaces/cmyk.ts:19](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/cmyk.ts#L19)*

___

### `Const` DEFAULT_OPTIONS

### ▪ **DEFAULT_OPTIONS**: *object*

*Defined in [platform/browser/imgstry/imgstry.browser.ts:39](https://github.com/visual-cortex/imgstry/blob/master/source/platform/browser/imgstry/imgstry.browser.ts#L39)*

▪ **thread**: *object*

*Defined in [platform/browser/imgstry/imgstry.browser.ts:40](https://github.com/visual-cortex/imgstry/blob/master/source/platform/browser/imgstry/imgstry.browser.ts#L40)*

* **isDebugEnabled**: *false* = false
