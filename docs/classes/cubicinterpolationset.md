[imgstry](../README.md) › [Globals](../globals.md) › [CubicInterpolationSet](cubicinterpolationset.md)

# Class: CubicInterpolationSet

## Hierarchy

* **CubicInterpolationSet**

## Index

### Constructors

* [constructor](cubicinterpolationset.md#constructor)

### Properties

* [a](cubicinterpolationset.md#a)
* [b](cubicinterpolationset.md#b)
* [c](cubicinterpolationset.md#c)
* [d](cubicinterpolationset.md#d)

### Methods

* [at](cubicinterpolationset.md#at)

## Constructors

###  constructor

\+ **new CubicInterpolationSet**(`_points`: [Point](point.md)[]): *[CubicInterpolationSet](cubicinterpolationset.md)*

*Defined in [core/spline/interpolation/cubic/interpolationSet.ts:8](https://github.com/visual-cortex/imgstry/blob/master/source/core/spline/interpolation/cubic/interpolationSet.ts#L8)*

**Parameters:**

Name | Type |
------ | ------ |
`_points` | [Point](point.md)[] |

**Returns:** *[CubicInterpolationSet](cubicinterpolationset.md)*

## Properties

###  a

• **a**: *number[]*

*Defined in [core/spline/interpolation/cubic/interpolationSet.ts:5](https://github.com/visual-cortex/imgstry/blob/master/source/core/spline/interpolation/cubic/interpolationSet.ts#L5)*

___

###  b

• **b**: *number[]*

*Defined in [core/spline/interpolation/cubic/interpolationSet.ts:6](https://github.com/visual-cortex/imgstry/blob/master/source/core/spline/interpolation/cubic/interpolationSet.ts#L6)*

___

###  c

• **c**: *number[]*

*Defined in [core/spline/interpolation/cubic/interpolationSet.ts:7](https://github.com/visual-cortex/imgstry/blob/master/source/core/spline/interpolation/cubic/interpolationSet.ts#L7)*

___

###  d

• **d**: *number[]*

*Defined in [core/spline/interpolation/cubic/interpolationSet.ts:8](https://github.com/visual-cortex/imgstry/blob/master/source/core/spline/interpolation/cubic/interpolationSet.ts#L8)*

## Methods

###  at

▸ **at**(`idx`: number): *object*

*Defined in [core/spline/interpolation/cubic/interpolationSet.ts:19](https://github.com/visual-cortex/imgstry/blob/master/source/core/spline/interpolation/cubic/interpolationSet.ts#L19)*

**Parameters:**

Name | Type |
------ | ------ |
`idx` | number |

**Returns:** *object*

* **a**: *number* = this.a[idx]

* **b**: *number* = this.b[idx]

* **c**: *number* = this.c[idx]

* **d**: *number* = this.d[idx]
