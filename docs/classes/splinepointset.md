[imgstry](../README.md) > [SplinePointSet](../classes/splinepointset.md)

# Class: SplinePointSet

## Hierarchy

**SplinePointSet**

## Implements

* `Iterable`<[Point](point.md)>

## Index

### Constructors

* [constructor](splinepointset.md#constructor)

### Accessors

* [first](splinepointset.md#first)
* [length](splinepointset.md#length)
* [notFound](splinepointset.md#notfound)

### Methods

* [__@iterator](splinepointset.md#___iterator)
* [closest](splinepointset.md#closest)
* [find](splinepointset.md#find)
* [forEach](splinepointset.md#foreach)
* [indexOfClosest](splinepointset.md#indexofclosest)
* [push](splinepointset.md#push)
* [remove](splinepointset.md#remove)
* [update](splinepointset.md#update)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new SplinePointSet**(points?: *[IPoint](../interfaces/ipoint.md)[]*): [SplinePointSet](splinepointset.md)

*Defined in [core/point/splinePointSet.ts:33](https://github.com/visual-cortex/imgstry/blob/master/source/core/point/splinePointSet.ts#L33)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| `Default value` points | [IPoint](../interfaces/ipoint.md)[] |  [] |

**Returns:** [SplinePointSet](splinepointset.md)

___

## Accessors

<a id="first"></a>

###  first

**get first**(): [Point](point.md)

*Defined in [core/point/splinePointSet.ts:14](https://github.com/visual-cortex/imgstry/blob/master/source/core/point/splinePointSet.ts#L14)*

**Returns:** [Point](point.md)

___
<a id="length"></a>

###  length

**get length**(): `number`

*Defined in [core/point/splinePointSet.ts:18](https://github.com/visual-cortex/imgstry/blob/master/source/core/point/splinePointSet.ts#L18)*

**Returns:** `number`

___
<a id="notfound"></a>

### `<Static>` notFound

**get notFound**(): [IPointResult](../interfaces/ipointresult.md)

*Defined in [core/point/splinePointSet.ts:12](https://github.com/visual-cortex/imgstry/blob/master/source/core/point/splinePointSet.ts#L12)*

**Returns:** [IPointResult](../interfaces/ipointresult.md)

___

## Methods

<a id="___iterator"></a>

###  __@iterator

▸ **__@iterator**(): `object`

*Defined in [core/point/splinePointSet.ts:42](https://github.com/visual-cortex/imgstry/blob/master/source/core/point/splinePointSet.ts#L42)*

**Returns:** `object`

___
<a id="closest"></a>

###  closest

▸ **closest**(coordinate: *[IPoint](../interfaces/ipoint.md)*, maxRange: *`number`*, transform: *`function`*): [IPointResult](../interfaces/ipointresult.md)

*Defined in [core/point/splinePointSet.ts:137](https://github.com/visual-cortex/imgstry/blob/master/source/core/point/splinePointSet.ts#L137)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| coordinate | [IPoint](../interfaces/ipoint.md) |
| maxRange | `number` |
| transform | `function` |

**Returns:** [IPointResult](../interfaces/ipointresult.md)

___
<a id="find"></a>

###  find

▸ **find**(point: *[IPoint](../interfaces/ipoint.md)*): [IPointResult](../interfaces/ipointresult.md)

*Defined in [core/point/splinePointSet.ts:94](https://github.com/visual-cortex/imgstry/blob/master/source/core/point/splinePointSet.ts#L94)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| point | [IPoint](../interfaces/ipoint.md) |

**Returns:** [IPointResult](../interfaces/ipointresult.md)

___
<a id="foreach"></a>

###  forEach

▸ **forEach**(predicateFn: *`function`*): `void`

*Defined in [core/point/splinePointSet.ts:103](https://github.com/visual-cortex/imgstry/blob/master/source/core/point/splinePointSet.ts#L103)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| predicateFn | `function` |

**Returns:** `void`

___
<a id="indexofclosest"></a>

###  indexOfClosest

▸ **indexOfClosest**(coordinate: *[IPoint](../interfaces/ipoint.md)*, maxRange: *`number`*, transform: *`function`*): `number`

*Defined in [core/point/splinePointSet.ts:117](https://github.com/visual-cortex/imgstry/blob/master/source/core/point/splinePointSet.ts#L117)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| coordinate | [IPoint](../interfaces/ipoint.md) |
| maxRange | `number` |
| transform | `function` |

**Returns:** `number`

___
<a id="push"></a>

###  push

▸ **push**(...points: *[IPoint](../interfaces/ipoint.md)[]*): `number`

*Defined in [core/point/splinePointSet.ts:62](https://github.com/visual-cortex/imgstry/blob/master/source/core/point/splinePointSet.ts#L62)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Rest` points | [IPoint](../interfaces/ipoint.md)[] |

**Returns:** `number`

___
<a id="remove"></a>

###  remove

▸ **remove**(index: *`number`*): [Point](point.md)

*Defined in [core/point/splinePointSet.ts:106](https://github.com/visual-cortex/imgstry/blob/master/source/core/point/splinePointSet.ts#L106)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| index | `number` |

**Returns:** [Point](point.md)

___
<a id="update"></a>

###  update

▸ **update**(index: *`number`*, __namedParameters: *`object`*): [IPointResult](../interfaces/ipointresult.md)

*Defined in [core/point/splinePointSet.ts:77](https://github.com/visual-cortex/imgstry/blob/master/source/core/point/splinePointSet.ts#L77)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| index | `number` |
| __namedParameters | `object` |

**Returns:** [IPointResult](../interfaces/ipointresult.md)

___

