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

* [_selectorRegex](globals.md#const-_selectorregex)
* [worker](globals.md#const-worker)

### Functions

* [EdgeDetection](globals.md#const-edgedetection)
* [GaussianBlur](globals.md#const-gaussianblur)
* [assignDefault](globals.md#const-assigndefault)
* [clearCanvas](globals.md#const-clearcanvas)
* [drawCircle](globals.md#const-drawcircle)
* [drawGrid](globals.md#const-drawgrid)
* [drawImage](globals.md#const-drawimage)
* [fillCanvas](globals.md#const-fillcanvas)
* [fillWith](globals.md#fillwith)
* [findLastIndex](globals.md#findlastindex)
* [getCanvas](globals.md#const-getcanvas)
* [imageData](globals.md#const-imagedata)
* [loadImage](globals.md#const-loadimage)
* [splineTheme](globals.md#const-splinetheme)
* [uuid](globals.md#const-uuid)

### Object literals

* [DEFAULT](globals.md#const-default)
* [DEFAULT_OPTIONS](globals.md#const-default_options)

## Namespaces

###  Operation

• **Operation**:

*Defined in [core/imgstry.operation.ts:12](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.operation.ts#L12)*

### `Const` blackAndWhite

▸ **blackAndWhite**(`__namedParameters`: [number, number, number]): *(Anonymous function)*

*Defined in [core/imgstry.operation.ts:169](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.operation.ts#L169)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`__namedParameters` | [number, number, number] | Default.blackAndWhite.ratio |

**Returns:** *(Anonymous function)*

### `Const` brightness

▸ **brightness**(`value`: number): *(Anonymous function)*

*Defined in [core/imgstry.operation.ts:205](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.operation.ts#L205)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *(Anonymous function)*

### `Const` contrast

▸ **contrast**(`value`: number): *(Anonymous function)*

*Defined in [core/imgstry.operation.ts:185](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.operation.ts#L185)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *(Anonymous function)*

### `Const` fill

▸ **fill**(`color`: string): *(Anonymous function)*

*Defined in [core/imgstry.operation.ts:161](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.operation.ts#L161)*

**Parameters:**

Name | Type |
------ | ------ |
`color` | string |

**Returns:** *(Anonymous function)*

### `Const` gamma

▸ **gamma**(`value`: number): *(Anonymous function)*

*Defined in [core/imgstry.operation.ts:88](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.operation.ts#L88)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *(Anonymous function)*

### `Const` hue

▸ **hue**(`value`: number): *(Anonymous function)*

*Defined in [core/imgstry.operation.ts:40](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.operation.ts#L40)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *(Anonymous function)*

### `Const` invert

▸ **invert**(): *(Anonymous function)*

*Defined in [core/imgstry.operation.ts:135](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.operation.ts#L135)*

**Returns:** *(Anonymous function)*

### `Const` lookup

▸ **lookup**(`lut`: Record‹number, number›): *(Anonymous function)*

*Defined in [core/imgstry.operation.ts:31](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.operation.ts#L31)*

**Parameters:**

Name | Type |
------ | ------ |
`lut` | Record‹number, number› |

**Returns:** *(Anonymous function)*

### `Const` noise

▸ **noise**(`value`: number): *(Anonymous function)*

*Defined in [core/imgstry.operation.ts:102](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.operation.ts#L102)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *(Anonymous function)*

### `Const` saturation

▸ **saturation**(`value`: number): *(Anonymous function)*

*Defined in [core/imgstry.operation.ts:217](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.operation.ts#L217)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *(Anonymous function)*

### `Const` sepia

▸ **sepia**(`value`: number): *(Anonymous function)*

*Defined in [core/imgstry.operation.ts:74](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.operation.ts#L74)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *(Anonymous function)*

### `Const` tint

▸ **tint**(`color`: string): *(Anonymous function)*

*Defined in [core/imgstry.operation.ts:149](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.operation.ts#L149)*

**Parameters:**

Name | Type |
------ | ------ |
`color` | string |

**Returns:** *(Anonymous function)*

### `Const` vibrance

▸ **vibrance**(`value`: number): *(Anonymous function)*

*Defined in [core/imgstry.operation.ts:115](https://github.com/visual-cortex/imgstry/blob/master/source/core/imgstry.operation.ts#L115)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *(Anonymous function)*

## Type aliases

###  FillPredicate

Ƭ **FillPredicate**: *number | function*

*Defined in [utils/array/fillWith.ts:2](https://github.com/visual-cortex/imgstry/blob/master/source/utils/array/fillWith.ts#L2)*

## Variables

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

*Defined in [platform/browser/imgstry/imgstry.browser.ts:31](https://github.com/visual-cortex/imgstry/blob/master/source/platform/browser/imgstry/imgstry.browser.ts#L31)*

**Parameters:**

Name | Type |
------ | ------ |
`source` | Partial‹[ImgstryBrowserOptions](interfaces/imgstrybrowseroptions.md)› |

**Returns:** *[ImgstryBrowserOptions](interfaces/imgstrybrowseroptions.md)*

___

### `Const` clearCanvas

▸ **clearCanvas**(`canvas`: HTMLCanvasElement): *void*

*Defined in [utils/canvas/clearCanvas.ts:7](https://github.com/visual-cortex/imgstry/blob/master/source/utils/canvas/clearCanvas.ts#L7)*

**Parameters:**

Name | Type |
------ | ------ |
`canvas` | HTMLCanvasElement |

**Returns:** *void*

___

### `Const` drawCircle

▸ **drawCircle**(`canvas`: HTMLCanvasElement, `options`: [ICircleOptions](interfaces/icircleoptions.md)): *void*

*Defined in [utils/canvas/drawCircle.ts:16](https://github.com/visual-cortex/imgstry/blob/master/source/utils/canvas/drawCircle.ts#L16)*

**Parameters:**

Name | Type |
------ | ------ |
`canvas` | HTMLCanvasElement |
`options` | [ICircleOptions](interfaces/icircleoptions.md) |

**Returns:** *void*

___

### `Const` drawGrid

▸ **drawGrid**(`canvas`: HTMLCanvasElement, `__namedParameters`: object): *void*

*Defined in [utils/canvas/drawGrid.ts:14](https://github.com/visual-cortex/imgstry/blob/master/source/utils/canvas/drawGrid.ts#L14)*

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

### `Const` drawImage

▸ **drawImage**(`canvas`: HTMLCanvasElement, `image`: CanvasImageSource): *void*

*Defined in [utils/canvas/drawImage.ts:8](https://github.com/visual-cortex/imgstry/blob/master/source/utils/canvas/drawImage.ts#L8)*

**Parameters:**

Name | Type |
------ | ------ |
`canvas` | HTMLCanvasElement |
`image` | CanvasImageSource |

**Returns:** *void*

___

### `Const` fillCanvas

▸ **fillCanvas**(`canvas`: HTMLCanvasElement, `color`: string): *void*

*Defined in [utils/canvas/fillCanvas.ts:8](https://github.com/visual-cortex/imgstry/blob/master/source/utils/canvas/fillCanvas.ts#L8)*

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

### `Const` imageData

▸ **imageData**(`canvas`: HTMLCanvasElement): *ImageData*

*Defined in [utils/canvas/imageData.ts:8](https://github.com/visual-cortex/imgstry/blob/master/source/utils/canvas/imageData.ts#L8)*

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

*Defined in [platform/browser/imgstry/imgstry.browser.ts:25](https://github.com/visual-cortex/imgstry/blob/master/source/platform/browser/imgstry/imgstry.browser.ts#L25)*

▪ **thread**: *object*

*Defined in [platform/browser/imgstry/imgstry.browser.ts:26](https://github.com/visual-cortex/imgstry/blob/master/source/platform/browser/imgstry/imgstry.browser.ts#L26)*

* **isDebugEnabled**: *false* = false
