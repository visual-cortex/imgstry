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
* [NotFound](splinepointset.md#notfound)

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

*Defined in [core/point/splinePointSet.ts:38](https://github.com/visual-cortex/imgstry/blob/master/source/core/point/splinePointSet.ts#L38)*

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

*Defined in [core/point/splinePointSet.ts:19](https://github.com/visual-cortex/imgstry/blob/master/source/core/point/splinePointSet.ts#L19)*

**Returns:** [Point](point.md)

___
<a id="length"></a>

###  length

**get length**(): `number`

*Defined in [core/point/splinePointSet.ts:23](https://github.com/visual-cortex/imgstry/blob/master/source/core/point/splinePointSet.ts#L23)*

**Returns:** `number`

___
<a id="notfound"></a>

### `<Static>` NotFound

**get NotFound**(): [IPointResult](../interfaces/ipointresult.md)

*Defined in [core/point/splinePointSet.ts:17](https://github.com/visual-cortex/imgstry/blob/master/source/core/point/splinePointSet.ts#L17)*

**Returns:** [IPointResult](../interfaces/ipointresult.md)

___

## Methods

<a id="___iterator"></a>

###  __@iterator

▸ **__@iterator**(): `object`

*Defined in [core/point/splinePointSet.ts:47](https://github.com/visual-cortex/imgstry/blob/master/source/core/point/splinePointSet.ts#L47)*

**Returns:** `object`

___
<a id="closest"></a>

###  closest

▸ **closest**(coordinate: *[IPoint](../interfaces/ipoint.md)*, maxRange: *`number`*, transform: *`function`*): [IPointResult](../interfaces/ipointresult.md)

*Defined in [core/point/splinePointSet.ts:142](https://github.com/visual-cortex/imgstry/blob/master/source/core/point/splinePointSet.ts#L142)*

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

*Defined in [core/point/splinePointSet.ts:99](https://github.com/visual-cortex/imgstry/blob/master/source/core/point/splinePointSet.ts#L99)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| point | [IPoint](../interfaces/ipoint.md) |

**Returns:** [IPointResult](../interfaces/ipointresult.md)

___
<a id="foreach"></a>

###  forEach

▸ **forEach**(predicateFn: *`function`*): `void`

*Defined in [core/point/splinePointSet.ts:108](https://github.com/visual-cortex/imgstry/blob/master/source/core/point/splinePointSet.ts#L108)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| predicateFn | `function` |

**Returns:** `void`

___
<a id="indexofclosest"></a>

###  indexOfClosest

▸ **indexOfClosest**(coordinate: *[IPoint](../interfaces/ipoint.md)*, maxRange: *`number`*, transform: *`function`*): `number`

*Defined in [core/point/splinePointSet.ts:122](https://github.com/visual-cortex/imgstry/blob/master/source/core/point/splinePointSet.ts#L122)*

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

*Defined in [core/point/splinePointSet.ts:67](https://github.com/visual-cortex/imgstry/blob/master/source/core/point/splinePointSet.ts#L67)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Rest` points | [IPoint](../interfaces/ipoint.md)[] |

**Returns:** `number`

___
<a id="remove"></a>

###  remove

▸ **remove**(index: *`number`*): [Point](point.md)

*Defined in [core/point/splinePointSet.ts:111](https://github.com/visual-cortex/imgstry/blob/master/source/core/point/splinePointSet.ts#L111)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| index | `number` |

**Returns:** [Point](point.md)

___
<a id="update"></a>

###  update

▸ **update**(index: *`number`*, __namedParameters: *`object`*): [IPointResult](../interfaces/ipointresult.md)

*Defined in [core/point/splinePointSet.ts:82](https://github.com/visual-cortex/imgstry/blob/master/source/core/point/splinePointSet.ts#L82)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| index | `number` |
| __namedParameters | `object` |

**Returns:** [IPointResult](../interfaces/ipointresult.md)

___

