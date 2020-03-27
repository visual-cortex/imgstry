[imgstry](../README.md) › [Globals](../globals.md) › [ImgstrySpline](imgstryspline.md)

# Class: ImgstrySpline

## Hierarchy

* [SplineProcessor](splineprocessor.md)

* [SplineProcessor](splineprocessor.md)

  ↳ **ImgstrySpline**

## Implements

* [IDisposable](../interfaces/idisposable.md)

## Index

### Constructors

* [constructor](imgstryspline.md#constructor)

### Properties

* [getCanvas](imgstryspline.md#static-getcanvas)

### Methods

* [add](imgstryspline.md#add)
* [dispose](imgstryspline.md#dispose)
* [interpolate](imgstryspline.md#interpolate)
* [interpolateOne](imgstryspline.md#interpolateone)
* [lookup](imgstryspline.md#lookup)
* [remove](imgstryspline.md#remove)

## Constructors

###  constructor

\+ **new ImgstrySpline**(`_canvas`: HTMLCanvasElement, `_options`: [ISplineOptions](../interfaces/isplineoptions.md)): *[ImgstrySpline](imgstryspline.md)*

*Overrides [SplineProcessor](splineprocessor.md).[constructor](splineprocessor.md#constructor)*

*Defined in [platform/browser/spline/spline.browser.ts:74](https://github.com/visual-cortex/imgstry/blob/master/source/platform/browser/spline/spline.browser.ts#L74)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`_canvas` | HTMLCanvasElement | - |
`_options` | [ISplineOptions](../interfaces/isplineoptions.md) | {} as ISplineOptions |

**Returns:** *[ImgstrySpline](imgstryspline.md)*

## Properties

### `Static` getCanvas

▪ **getCanvas**: *getCanvas* = getCanvas

*Defined in [platform/browser/spline/spline.browser.ts:42](https://github.com/visual-cortex/imgstry/blob/master/source/platform/browser/spline/spline.browser.ts#L42)*

## Methods

###  add

▸ **add**(`point`: [IPoint](../interfaces/ipoint.md)): *void*

*Overrides [SplineProcessor](splineprocessor.md).[add](splineprocessor.md#add)*

*Defined in [platform/browser/spline/spline.browser.ts:119](https://github.com/visual-cortex/imgstry/blob/master/source/platform/browser/spline/spline.browser.ts#L119)*

**Parameters:**

Name | Type |
------ | ------ |
`point` | [IPoint](../interfaces/ipoint.md) |

**Returns:** *void*

___

###  dispose

▸ **dispose**(): *void*

*Implementation of [IDisposable](../interfaces/idisposable.md)*

*Defined in [platform/browser/spline/spline.browser.ts:133](https://github.com/visual-cortex/imgstry/blob/master/source/platform/browser/spline/spline.browser.ts#L133)*

**Returns:** *void*

___

###  interpolate

▸ **interpolate**(`predicate`: function): *void*

*Inherited from [SplineProcessor](splineprocessor.md).[interpolate](splineprocessor.md#interpolate)*

*Overrides [SplineProcessor](splineprocessor.md).[interpolate](splineprocessor.md#interpolate)*

*Defined in [core/spline/spline.processor.ts:43](https://github.com/visual-cortex/imgstry/blob/master/source/core/spline/spline.processor.ts#L43)*

**Parameters:**

▪ **predicate**: *function*

▸ (`point`: [IPoint](../interfaces/ipoint.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`point` | [IPoint](../interfaces/ipoint.md) |

**Returns:** *void*

___

###  interpolateOne

▸ **interpolateOne**(`x`: number): *number*

*Inherited from [SplineProcessor](splineprocessor.md).[interpolateOne](splineprocessor.md#interpolateone)*

*Overrides [SplineProcessor](splineprocessor.md).[interpolateOne](splineprocessor.md#interpolateone)*

*Defined in [core/spline/spline.processor.ts:52](https://github.com/visual-cortex/imgstry/blob/master/source/core/spline/spline.processor.ts#L52)*

**Parameters:**

Name | Type |
------ | ------ |
`x` | number |

**Returns:** *number*

___

###  lookup

▸ **lookup**(): *number[]*

*Inherited from [SplineProcessor](splineprocessor.md).[lookup](splineprocessor.md#lookup)*

*Overrides [SplineProcessor](splineprocessor.md).[lookup](splineprocessor.md#lookup)*

*Defined in [core/spline/spline.processor.ts:32](https://github.com/visual-cortex/imgstry/blob/master/source/core/spline/spline.processor.ts#L32)*

**Returns:** *number[]*

___

###  remove

▸ **remove**(`point`: [IPoint](../interfaces/ipoint.md)): *void*

*Overrides [SplineProcessor](splineprocessor.md).[remove](splineprocessor.md#remove)*

*Defined in [platform/browser/spline/spline.browser.ts:126](https://github.com/visual-cortex/imgstry/blob/master/source/platform/browser/spline/spline.browser.ts#L126)*

**Parameters:**

Name | Type |
------ | ------ |
`point` | [IPoint](../interfaces/ipoint.md) |

**Returns:** *void*
