[imgstry](../README.md) > [SplineProcessor](../classes/splineprocessor.md)

# Class: SplineProcessor

## Hierarchy

**SplineProcessor**

↳  [ImgstrySpline](imgstryspline.md)

↳  [ImgstrySpline](imgstryspline.md)

## Index

### Constructors

* [constructor](splineprocessor.md#constructor)

### Methods

* [add](splineprocessor.md#add)
* [interpolate](splineprocessor.md#interpolate)
* [interpolateOne](splineprocessor.md#interpolateone)
* [lookup](splineprocessor.md#lookup)
* [remove](splineprocessor.md#remove)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new SplineProcessor**(width?: *`number`*): [SplineProcessor](splineprocessor.md)

*Defined in [core/spline/spline.processor.ts:12](https://github.com/visual-cortex/imgstry/blob/master/source/core/spline/spline.processor.ts#L12)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| `Default value` width | `number` | 256 |

**Returns:** [SplineProcessor](splineprocessor.md)

___

## Methods

<a id="add"></a>

###  add

▸ **add**(point: *[IPoint](../interfaces/ipoint.md)*): `void`

*Defined in [core/spline/spline.processor.ts:21](https://github.com/visual-cortex/imgstry/blob/master/source/core/spline/spline.processor.ts#L21)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| point | [IPoint](../interfaces/ipoint.md) |

**Returns:** `void`

___
<a id="interpolate"></a>

###  interpolate

▸ **interpolate**(predicate: *`function`*): `void`

*Defined in [core/spline/spline.processor.ts:44](https://github.com/visual-cortex/imgstry/blob/master/source/core/spline/spline.processor.ts#L44)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| predicate | `function` |

**Returns:** `void`

___
<a id="interpolateone"></a>

###  interpolateOne

▸ **interpolateOne**(x: *`number`*): `number`

*Defined in [core/spline/spline.processor.ts:53](https://github.com/visual-cortex/imgstry/blob/master/source/core/spline/spline.processor.ts#L53)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| x | `number` |

**Returns:** `number`

___
<a id="lookup"></a>

###  lookup

▸ **lookup**(): `number`[]

*Defined in [core/spline/spline.processor.ts:33](https://github.com/visual-cortex/imgstry/blob/master/source/core/spline/spline.processor.ts#L33)*

**Returns:** `number`[]

___
<a id="remove"></a>

###  remove

▸ **remove**(point: *[IPoint](../interfaces/ipoint.md)*): `void`

*Defined in [core/spline/spline.processor.ts:25](https://github.com/visual-cortex/imgstry/blob/master/source/core/spline/spline.processor.ts#L25)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| point | [IPoint](../interfaces/ipoint.md) |

**Returns:** `void`

___

