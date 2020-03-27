[imgstry](../README.md) › [Globals](../globals.md) › [SplinePointSet](splinepointset.md)

# Class: SplinePointSet

## Hierarchy

* **SplinePointSet**

## Implements

* Iterable‹[Point](point.md)›

## Index

### Constructors

* [constructor](splinepointset.md#constructor)

### Accessors

* [first](splinepointset.md#first)
* [length](splinepointset.md#length)
* [notFound](splinepointset.md#static-notfound)

### Methods

* [[Symbol.iterator]](splinepointset.md#[symbol.iterator])
* [closest](splinepointset.md#closest)
* [find](splinepointset.md#find)
* [forEach](splinepointset.md#foreach)
* [indexOfClosest](splinepointset.md#indexofclosest)
* [push](splinepointset.md#push)
* [remove](splinepointset.md#remove)
* [update](splinepointset.md#update)

## Constructors

###  constructor

\+ **new SplinePointSet**(`points`: [IPoint](../interfaces/ipoint.md)[]): *[SplinePointSet](splinepointset.md)*

*Defined in [core/point/splinePointSet.ts:33](https://github.com/visual-cortex/imgstry/blob/master/source/core/point/splinePointSet.ts#L33)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`points` | [IPoint](../interfaces/ipoint.md)[] | [] |

**Returns:** *[SplinePointSet](splinepointset.md)*

## Accessors

###  first

• **get first**(): *[Point](point.md)‹›*

*Defined in [core/point/splinePointSet.ts:14](https://github.com/visual-cortex/imgstry/blob/master/source/core/point/splinePointSet.ts#L14)*

**Returns:** *[Point](point.md)‹›*

___

###  length

• **get length**(): *number*

*Defined in [core/point/splinePointSet.ts:18](https://github.com/visual-cortex/imgstry/blob/master/source/core/point/splinePointSet.ts#L18)*

**Returns:** *number*

___

### `Static` notFound

• **get notFound**(): *[IPointResult](../interfaces/ipointresult.md)*

*Defined in [core/point/splinePointSet.ts:12](https://github.com/visual-cortex/imgstry/blob/master/source/core/point/splinePointSet.ts#L12)*

**Returns:** *[IPointResult](../interfaces/ipointresult.md)*

## Methods

###  [Symbol.iterator]

▸ **[Symbol.iterator]**(): *object*

*Defined in [core/point/splinePointSet.ts:42](https://github.com/visual-cortex/imgstry/blob/master/source/core/point/splinePointSet.ts#L42)*

**Returns:** *object*

* **next**(): *IteratorResult‹[Point](point.md)›*

___

###  closest

▸ **closest**(`coordinate`: [IPoint](../interfaces/ipoint.md), `maxRange`: number, `transform`: function): *[IPointResult](../interfaces/ipointresult.md)*

*Defined in [core/point/splinePointSet.ts:137](https://github.com/visual-cortex/imgstry/blob/master/source/core/point/splinePointSet.ts#L137)*

**Parameters:**

▪ **coordinate**: *[IPoint](../interfaces/ipoint.md)*

▪ **maxRange**: *number*

▪ **transform**: *function*

▸ (`p`: [IPoint](../interfaces/ipoint.md)): *[IPoint](../interfaces/ipoint.md)*

**Parameters:**

Name | Type |
------ | ------ |
`p` | [IPoint](../interfaces/ipoint.md) |

**Returns:** *[IPointResult](../interfaces/ipointresult.md)*

___

###  find

▸ **find**(`point`: [IPoint](../interfaces/ipoint.md)): *[IPointResult](../interfaces/ipointresult.md)*

*Defined in [core/point/splinePointSet.ts:94](https://github.com/visual-cortex/imgstry/blob/master/source/core/point/splinePointSet.ts#L94)*

**Parameters:**

Name | Type |
------ | ------ |
`point` | [IPoint](../interfaces/ipoint.md) |

**Returns:** *[IPointResult](../interfaces/ipointresult.md)*

___

###  forEach

▸ **forEach**(`predicateFn`: function): *void*

*Defined in [core/point/splinePointSet.ts:103](https://github.com/visual-cortex/imgstry/blob/master/source/core/point/splinePointSet.ts#L103)*

**Parameters:**

▪ **predicateFn**: *function*

▸ (`value`: [Point](point.md), `index`: number): *void*

**Parameters:**

Name | Type |
------ | ------ |
`value` | [Point](point.md) |
`index` | number |

**Returns:** *void*

___

###  indexOfClosest

▸ **indexOfClosest**(`coordinate`: [IPoint](../interfaces/ipoint.md), `maxRange`: number, `transform`: function): *number*

*Defined in [core/point/splinePointSet.ts:117](https://github.com/visual-cortex/imgstry/blob/master/source/core/point/splinePointSet.ts#L117)*

**Parameters:**

▪ **coordinate**: *[IPoint](../interfaces/ipoint.md)*

▪ **maxRange**: *number*

▪ **transform**: *function*

▸ (`p`: [IPoint](../interfaces/ipoint.md)): *[IPoint](../interfaces/ipoint.md)*

**Parameters:**

Name | Type |
------ | ------ |
`p` | [IPoint](../interfaces/ipoint.md) |

**Returns:** *number*

___

###  push

▸ **push**(...`points`: [IPoint](../interfaces/ipoint.md)[]): *number*

*Defined in [core/point/splinePointSet.ts:62](https://github.com/visual-cortex/imgstry/blob/master/source/core/point/splinePointSet.ts#L62)*

**Parameters:**

Name | Type |
------ | ------ |
`...points` | [IPoint](../interfaces/ipoint.md)[] |

**Returns:** *number*

___

###  remove

▸ **remove**(`index`: number): *[Point](point.md)*

*Defined in [core/point/splinePointSet.ts:106](https://github.com/visual-cortex/imgstry/blob/master/source/core/point/splinePointSet.ts#L106)*

**Parameters:**

Name | Type |
------ | ------ |
`index` | number |

**Returns:** *[Point](point.md)*

___

###  update

▸ **update**(`index`: number, `__namedParameters`: object): *[IPointResult](../interfaces/ipointresult.md)*

*Defined in [core/point/splinePointSet.ts:77](https://github.com/visual-cortex/imgstry/blob/master/source/core/point/splinePointSet.ts#L77)*

**Parameters:**

▪ **index**: *number*

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`x` | number |
`y` | number |

**Returns:** *[IPointResult](../interfaces/ipointresult.md)*
