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
* [xBoundary](splinepointset.md#xboundary)
* [yBoundary](splinepointset.md#yboundary)
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

*Defined in [core/point/splinePointSet.ts:52](https://github.com/visual-cortex/imgstry/blob/master/source/core/point/splinePointSet.ts#L52)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| `Default value` points | [IPoint](../interfaces/ipoint.md)[] |  [] |

**Returns:** [SplinePointSet](splinepointset.md)

___

## Accessors

<a id="first"></a>

###  first

getfirst(): [Point](point.md)

*Defined in [core/point/splinePointSet.ts:19](https://github.com/visual-cortex/imgstry/blob/master/source/core/point/splinePointSet.ts#L19)*

**Returns:** [Point](point.md)

___
<a id="length"></a>

###  length

getlength(): `number`

*Defined in [core/point/splinePointSet.ts:37](https://github.com/visual-cortex/imgstry/blob/master/source/core/point/splinePointSet.ts#L37)*

**Returns:** `number`

___
<a id="xboundary"></a>

###  xBoundary

setxBoundary(__namedParameters: *`object`*): `void`

*Defined in [core/point/splinePointSet.ts:23](https://github.com/visual-cortex/imgstry/blob/master/source/core/point/splinePointSet.ts#L23)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| __namedParameters | `object` |

**Returns:** `void`

___
<a id="yboundary"></a>

###  yBoundary

setyBoundary(__namedParameters: *`object`*): `void`

*Defined in [core/point/splinePointSet.ts:30](https://github.com/visual-cortex/imgstry/blob/master/source/core/point/splinePointSet.ts#L30)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| __namedParameters | `object` |

**Returns:** `void`

___
<a id="notfound"></a>

### `<Static>` NotFound

getNotFound(): [IPointResult](../interfaces/ipointresult.md)

*Defined in [core/point/splinePointSet.ts:17](https://github.com/visual-cortex/imgstry/blob/master/source/core/point/splinePointSet.ts#L17)*

**Returns:** [IPointResult](../interfaces/ipointresult.md)

___

## Methods

<a id="___iterator"></a>

###  __@iterator

▸ **__@iterator**(): `object`

*Defined in [core/point/splinePointSet.ts:61](https://github.com/visual-cortex/imgstry/blob/master/source/core/point/splinePointSet.ts#L61)*

**Returns:** `object`

___
<a id="closest"></a>

###  closest

▸ **closest**(coordinate: *[IPoint](../interfaces/ipoint.md)*, maxRange: *`number`*, transform: *`function`*): [IPointResult](../interfaces/ipointresult.md)

*Defined in [core/point/splinePointSet.ts:156](https://github.com/visual-cortex/imgstry/blob/master/source/core/point/splinePointSet.ts#L156)*

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

*Defined in [core/point/splinePointSet.ts:113](https://github.com/visual-cortex/imgstry/blob/master/source/core/point/splinePointSet.ts#L113)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| point | [IPoint](../interfaces/ipoint.md) |

**Returns:** [IPointResult](../interfaces/ipointresult.md)

___
<a id="foreach"></a>

###  forEach

▸ **forEach**(predicateFn: *`function`*): `void`

*Defined in [core/point/splinePointSet.ts:122](https://github.com/visual-cortex/imgstry/blob/master/source/core/point/splinePointSet.ts#L122)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| predicateFn | `function` |

**Returns:** `void`

___
<a id="indexofclosest"></a>

###  indexOfClosest

▸ **indexOfClosest**(coordinate: *[IPoint](../interfaces/ipoint.md)*, maxRange: *`number`*, transform: *`function`*): `number`

*Defined in [core/point/splinePointSet.ts:136](https://github.com/visual-cortex/imgstry/blob/master/source/core/point/splinePointSet.ts#L136)*

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

*Defined in [core/point/splinePointSet.ts:81](https://github.com/visual-cortex/imgstry/blob/master/source/core/point/splinePointSet.ts#L81)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Rest` points | [IPoint](../interfaces/ipoint.md)[] |

**Returns:** `number`

___
<a id="remove"></a>

###  remove

▸ **remove**(index: *`number`*): [Point](point.md)

*Defined in [core/point/splinePointSet.ts:125](https://github.com/visual-cortex/imgstry/blob/master/source/core/point/splinePointSet.ts#L125)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| index | `number` |

**Returns:** [Point](point.md)

___
<a id="update"></a>

###  update

▸ **update**(index: *`number`*, __namedParameters: *`object`*): [IPointResult](../interfaces/ipointresult.md)

*Defined in [core/point/splinePointSet.ts:96](https://github.com/visual-cortex/imgstry/blob/master/source/core/point/splinePointSet.ts#L96)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| index | `number` |
| __namedParameters | `object` |

**Returns:** [IPointResult](../interfaces/ipointresult.md)

___

