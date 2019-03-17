
Imgstry
=======

[![npm version](https://badge.fury.io/js/imgstry.svg)](https://badge.fury.io/js/imgstry) [![Build Status](https://travis-ci.org/visual-cortex/imgstry.svg?branch=master)](https://travis-ci.org/visual-cortex/imgstry) [![codecov](https://codecov.io/gh/visual-cortex/imgstry/branch/master/graph/badge.svg)](https://codecov.io/gh/visual-cortex/imgstry)

Development Notes
-----------------

If you get this error `Pre-built binaries not installable for canvas@X.X.X and node@Y.Y.Y` when running `npm i`, that means that the `canvas` package cannot find a prebuilt version compatible with the current `node` version. The required dependencies must be installed manually in order to install all packages:

```
    choco install -y python2 gtk-runtime microsoft-build-tools libjpeg-turbo
```

Documentation
-------------

## Index

### Modules

* [Operation](docs/modules/operation.md)

### Enumerations

* [ColorSpace](docs/enums/colorspace.md)

### Classes

* [Cmyk](docs/classes/cmyk.md)
* [CubicInterpolationSet](docs/classes/cubicinterpolationset.md)
* [CubicSpline](docs/classes/cubicspline.md)
* [Hex](docs/classes/hex.md)
* [Hsv](docs/classes/hsv.md)
* [Imgstry](docs/classes/imgstry.md)
* [ImgstryEditor](docs/classes/imgstryeditor.md)
* [ImgstrySpline](docs/classes/imgstryspline.md)
* [Kernel](docs/classes/kernel.md)
* [Pixel](docs/classes/pixel.md)
* [Point](docs/classes/point.md)
* [Rgb](docs/classes/rgb.md)
* [SplinePointSet](docs/classes/splinepointset.md)
* [SplineProcessor](docs/classes/splineprocessor.md)

### Interfaces

* [IColor](docs/interfaces/icolor.md)
* [IDisposable](docs/interfaces/idisposable.md)
* [IPoint](docs/interfaces/ipoint.md)
* [IPointResult](docs/interfaces/ipointresult.md)
* [ImgstryBrowserOptions](docs/interfaces/imgstrybrowseroptions.md)
* [KernelIndex](docs/interfaces/kernelindex.md)

### Functions

* [EdgeDetection](#edgedetection)
* [GaussianBlur](#gaussianblur)
* [clearCanvas](#clearcanvas)
* [drawCircle](#drawcircle)
* [drawGrid](#drawgrid)
* [drawImage](#drawimage)
* [fillCanvas](#fillcanvas)
* [fillWith](#fillwith)
* [findLastIndex](#findlastindex)
* [getCanvas](#getcanvas)
* [imageData](#imagedata)
* [loadImage](#loadimage)
* [splineTheme](#splinetheme)
* [uuid](#uuid)

---

## Functions

<a id="edgedetection"></a>

### `<Const>` EdgeDetection

▸ **EdgeDetection**(): `number`[][]

*Defined in [kernel/collection/edge-detect.kernel.ts:5](https://github.com/visual-cortex/imgstry/blob/master/source/kernel/collection/edge-detect.kernel.ts#L5)*

**Returns:** `number`[][]

___
<a id="gaussianblur"></a>

### `<Const>` GaussianBlur

▸ **GaussianBlur**(radius?: *`number`*, sigma?: *`number`*): `number`[][]

*Defined in [kernel/collection/gaussion.kernel.ts:8](https://github.com/visual-cortex/imgstry/blob/master/source/kernel/collection/gaussion.kernel.ts#L8)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| `Default value` radius | `number` | 3 |
| `Default value` sigma | `number` | 1 |

**Returns:** `number`[][]

___
<a id="clearcanvas"></a>

### `<Const>` clearCanvas

▸ **clearCanvas**(canvas: *`HTMLCanvasElement`*): `void`

*Defined in [utils/canvas/clearCanvas.ts:7](https://github.com/visual-cortex/imgstry/blob/master/source/utils/canvas/clearCanvas.ts#L7)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| canvas | `HTMLCanvasElement` |

**Returns:** `void`

___
<a id="drawcircle"></a>

### `<Const>` drawCircle

▸ **drawCircle**(canvas: *`HTMLCanvasElement`*, options: *`ICircleOptions`*): `void`

*Defined in [utils/canvas/drawCircle.ts:16](https://github.com/visual-cortex/imgstry/blob/master/source/utils/canvas/drawCircle.ts#L16)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| canvas | `HTMLCanvasElement` |
| options | `ICircleOptions` |

**Returns:** `void`

___
<a id="drawgrid"></a>

### `<Const>` drawGrid

▸ **drawGrid**(canvas: *`HTMLCanvasElement`*, __namedParameters: *`object`*): `void`

*Defined in [utils/canvas/drawGrid.ts:14](https://github.com/visual-cortex/imgstry/blob/master/source/utils/canvas/drawGrid.ts#L14)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| canvas | `HTMLCanvasElement` |
| __namedParameters | `object` |

**Returns:** `void`

___
<a id="drawimage"></a>

### `<Const>` drawImage

▸ **drawImage**(canvas: *`HTMLCanvasElement`*, image: *`CanvasImageSource`*): `void`

*Defined in [utils/canvas/drawImage.ts:8](https://github.com/visual-cortex/imgstry/blob/master/source/utils/canvas/drawImage.ts#L8)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| canvas | `HTMLCanvasElement` |
| image | `CanvasImageSource` |

**Returns:** `void`

___
<a id="fillcanvas"></a>

### `<Const>` fillCanvas

▸ **fillCanvas**(canvas: *`HTMLCanvasElement`*, color: *`string`*): `void`

*Defined in [utils/canvas/fillCanvas.ts:8](https://github.com/visual-cortex/imgstry/blob/master/source/utils/canvas/fillCanvas.ts#L8)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| canvas | `HTMLCanvasElement` |
| color | `string` |

**Returns:** `void`

___
<a id="fillwith"></a>

###  fillWith

▸ **fillWith**(count: *`number`*, predicateOrValue: *`FillPredicate`*): `any`[]

*Defined in [utils/array/fillWith.ts:12](https://github.com/visual-cortex/imgstry/blob/master/source/utils/array/fillWith.ts#L12)*

Creates an array and fills it with the specified value

*__export__*: 

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| count | `number` |  the number of elements the array should contain |
| predicateOrValue | `FillPredicate` |  the fill predicate |

**Returns:** `any`[]
the array with the requested value

___
<a id="findlastindex"></a>

###  findLastIndex

▸ **findLastIndex**<`T`>(arr: *`T`[]*, predicate: *`function`*): `number`

*Defined in [utils/array/findLastIndex.ts:10](https://github.com/visual-cortex/imgstry/blob/master/source/utils/array/findLastIndex.ts#L10)*

Retrieves the last index that resolves the predicate

*__export__*: 

*__template__*: T

**Type parameters:**

#### T 
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| arr | `T`[] |  the source array |
| predicate | `function` |  the predicate with the logic |

**Returns:** `number`
the position of the found element, -1 if not found

___
<a id="getcanvas"></a>

### `<Const>` getCanvas

▸ **getCanvas**(selector: *`string` \| `HTMLCanvasElement`*): `HTMLCanvasElement`

*Defined in [utils/dom/getCanvas.ts:9](https://github.com/visual-cortex/imgstry/blob/master/source/utils/dom/getCanvas.ts#L9)*

Retrieves the canvas elemented for a specified 'id'.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| selector | `string` \| `HTMLCanvasElement` |  canvas id selector or the canvas element |

**Returns:** `HTMLCanvasElement`
the canvas element

___
<a id="imagedata"></a>

### `<Const>` imageData

▸ **imageData**(canvas: *`HTMLCanvasElement`*): `ImageData`

*Defined in [utils/canvas/imageData.ts:8](https://github.com/visual-cortex/imgstry/blob/master/source/utils/canvas/imageData.ts#L8)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| canvas | `HTMLCanvasElement` |

**Returns:** `ImageData`

___
<a id="loadimage"></a>

### `<Const>` loadImage

▸ **loadImage**(ImageCtor: *`ImageConstructor`*, src: *`string`*): `Promise`<`HTMLImageElement`>

*Defined in [utils/dom/loadImage.ts:12](https://github.com/visual-cortex/imgstry/blob/master/source/utils/dom/loadImage.ts#L12)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| ImageCtor | `ImageConstructor` |
| src | `string` |

**Returns:** `Promise`<`HTMLImageElement`>

___
<a id="splinetheme"></a>

### `<Const>` splineTheme

▸ **splineTheme**(theme: *`Theme`*): `object`

*Defined in [platform/browser/spline/spline.theme.ts:3](https://github.com/visual-cortex/imgstry/blob/master/source/platform/browser/spline/spline.theme.ts#L3)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| theme | `Theme` |

**Returns:** `object`

___
<a id="uuid"></a>

### `<Const>` uuid

▸ **uuid**(): `string`

*Defined in [utils/random/uuid.ts:7](https://github.com/visual-cortex/imgstry/blob/master/source/utils/random/uuid.ts#L7)*

**Returns:** `string`

___

