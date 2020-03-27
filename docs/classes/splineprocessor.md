[imgstry](../README.md) › [Globals](../globals.md) › [SplineProcessor](splineprocessor.md)

# Class: SplineProcessor

## Hierarchy

* **SplineProcessor**

  ↳ [ImgstrySpline](imgstryspline.md)

  ↳ [ImgstrySpline](imgstryspline.md)

## Index

### Constructors

* [constructor](splineprocessor.md#constructor)

### Methods

* [add](splineprocessor.md#add)
* [interpolate](splineprocessor.md#interpolate)
* [interpolateOne](splineprocessor.md#interpolateone)
* [lookup](splineprocessor.md#lookup)
* [remove](splineprocessor.md#remove)

## Constructors

###  constructor

\+ **new SplineProcessor**(`width`: number): *[SplineProcessor](splineprocessor.md)*

*Defined in [core/spline/spline.processor.ts:11](https://github.com/visual-cortex/imgstry/blob/master/source/core/spline/spline.processor.ts#L11)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`width` | number | 256 |

**Returns:** *[SplineProcessor](splineprocessor.md)*

## Methods

###  add

▸ **add**(`point`: [IPoint](../interfaces/ipoint.md)): *void*

*Defined in [core/spline/spline.processor.ts:20](https://github.com/visual-cortex/imgstry/blob/master/source/core/spline/spline.processor.ts#L20)*

**Parameters:**

Name | Type |
------ | ------ |
`point` | [IPoint](../interfaces/ipoint.md) |

**Returns:** *void*

___

###  interpolate

▸ **interpolate**(`predicate`: function): *void*

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

*Defined in [core/spline/spline.processor.ts:52](https://github.com/visual-cortex/imgstry/blob/master/source/core/spline/spline.processor.ts#L52)*

**Parameters:**

Name | Type |
------ | ------ |
`x` | number |

**Returns:** *number*

___

###  lookup

▸ **lookup**(): *number[]*

*Defined in [core/spline/spline.processor.ts:32](https://github.com/visual-cortex/imgstry/blob/master/source/core/spline/spline.processor.ts#L32)*

**Returns:** *number[]*

___

###  remove

▸ **remove**(`point`: [IPoint](../interfaces/ipoint.md)): *void*

*Defined in [core/spline/spline.processor.ts:24](https://github.com/visual-cortex/imgstry/blob/master/source/core/spline/spline.processor.ts#L24)*

**Parameters:**

Name | Type |
------ | ------ |
`point` | [IPoint](../interfaces/ipoint.md) |

**Returns:** *void*
