[imgstry](../README.md) > [Hsv](../classes/hsv.md)

# Class: Hsv

HSV colorspace.
*__export__*: 

*__class__*: Hsv

*__implements__*: {IColor}

## Hierarchy

**Hsv**

## Implements

* [IColor](../interfaces/icolor.md)

## Index

### Constructors

* [constructor](hsv.md#constructor)

### Properties

* [h](hsv.md#h)
* [s](hsv.md#s)
* [v](hsv.md#v)

### Accessors

* [kind](hsv.md#kind)

### Methods

* [clamp](hsv.md#clamp)
* [toCmyk](hsv.md#tocmyk)
* [toHex](hsv.md#tohex)
* [toHsv](hsv.md#tohsv)
* [toRgb](hsv.md#torgb)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new Hsv**(__namedParameters?: *`object`*): [Hsv](hsv.md)

*Defined in [pixel/color/spaces/hsv.ts:36](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/hsv.ts#L36)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| `Default value` __namedParameters | `object` |  DEFAULT |

**Returns:** [Hsv](hsv.md)

___

## Properties

<a id="h"></a>

###  h

**● h**: *`number`*

*Defined in [pixel/color/spaces/hsv.ts:30](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/hsv.ts#L30)*

___
<a id="s"></a>

###  s

**● s**: *`number`*

*Defined in [pixel/color/spaces/hsv.ts:31](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/hsv.ts#L31)*

___
<a id="v"></a>

###  v

**● v**: *`number`*

*Defined in [pixel/color/spaces/hsv.ts:32](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/hsv.ts#L32)*

___

## Accessors

<a id="kind"></a>

###  kind

getkind(): [ColorSpace](../enums/colorspace.md)

*Defined in [pixel/color/spaces/hsv.ts:34](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/hsv.ts#L34)*

**Returns:** [ColorSpace](../enums/colorspace.md)

___

## Methods

<a id="clamp"></a>

###  clamp

▸ **clamp**(): [Hsv](hsv.md)

*Implementation of [IColor](../interfaces/icolor.md).[clamp](../interfaces/icolor.md#clamp)*

*Defined in [pixel/color/spaces/hsv.ts:91](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/hsv.ts#L91)*

**Returns:** [Hsv](hsv.md)

___
<a id="tocmyk"></a>

###  toCmyk

▸ **toCmyk**(): [Cmyk](cmyk.md)

*Implementation of [IColor](../interfaces/icolor.md).[toCmyk](../interfaces/icolor.md#tocmyk)*

*Defined in [pixel/color/spaces/hsv.ts:83](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/hsv.ts#L83)*

**Returns:** [Cmyk](cmyk.md)

___
<a id="tohex"></a>

###  toHex

▸ **toHex**(): [Hex](hex.md)

*Implementation of [IColor](../interfaces/icolor.md).[toHex](../interfaces/icolor.md#tohex)*

*Defined in [pixel/color/spaces/hsv.ts:87](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/hsv.ts#L87)*

**Returns:** [Hex](hex.md)

___
<a id="tohsv"></a>

###  toHsv

▸ **toHsv**(): [Hsv](hsv.md)

*Implementation of [IColor](../interfaces/icolor.md).[toHsv](../interfaces/icolor.md#tohsv)*

*Defined in [pixel/color/spaces/hsv.ts:79](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/hsv.ts#L79)*

**Returns:** [Hsv](hsv.md)

___
<a id="torgb"></a>

###  toRgb

▸ **toRgb**(): [Rgb](rgb.md)

*Implementation of [IColor](../interfaces/icolor.md).[toRgb](../interfaces/icolor.md#torgb)*

*Defined in [pixel/color/spaces/hsv.ts:44](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/hsv.ts#L44)*

**Returns:** [Rgb](rgb.md)

___

