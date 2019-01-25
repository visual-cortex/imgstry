[imgstry](../README.md) > [Hex](../classes/hex.md)

# Class: Hex

HEX colorspace.
*__export__*: 

*__class__*: Hex

*__implements__*: {IColor}

## Hierarchy

**Hex**

## Implements

* [IColor](../interfaces/icolor.md)

## Index

### Constructors

* [constructor](hex.md#constructor)

### Properties

* [value](hex.md#value)

### Accessors

* [kind](hex.md#kind)

### Methods

* [clamp](hex.md#clamp)
* [toCmyk](hex.md#tocmyk)
* [toHex](hex.md#tohex)
* [toHsv](hex.md#tohsv)
* [toRgb](hex.md#torgb)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new Hex**(color?: *`string`*): [Hex](hex.md)

*Defined in [pixel/color/spaces/hex.ts:22](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/hex.ts#L22)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| `Default value` color | `string` | &quot;#000000&quot; |

**Returns:** [Hex](hex.md)

___

## Properties

<a id="value"></a>

###  value

**● value**: *`string`*

*Defined in [pixel/color/spaces/hex.ts:18](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/hex.ts#L18)*

___

## Accessors

<a id="kind"></a>

###  kind

getkind(): [ColorSpace](../enums/colorspace.md)

*Defined in [pixel/color/spaces/hex.ts:20](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/hex.ts#L20)*

**Returns:** [ColorSpace](../enums/colorspace.md)

___

## Methods

<a id="clamp"></a>

###  clamp

▸ **clamp**(): [Hex](hex.md)

*Implementation of [IColor](../interfaces/icolor.md).[clamp](../interfaces/icolor.md#clamp)*

*Defined in [pixel/color/spaces/hex.ts:52](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/hex.ts#L52)*

**Returns:** [Hex](hex.md)

___
<a id="tocmyk"></a>

###  toCmyk

▸ **toCmyk**(): [Cmyk](cmyk.md)

*Implementation of [IColor](../interfaces/icolor.md).[toCmyk](../interfaces/icolor.md#tocmyk)*

*Defined in [pixel/color/spaces/hex.ts:44](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/hex.ts#L44)*

**Returns:** [Cmyk](cmyk.md)

___
<a id="tohex"></a>

###  toHex

▸ **toHex**(): [Hex](hex.md)

*Implementation of [IColor](../interfaces/icolor.md).[toHex](../interfaces/icolor.md#tohex)*

*Defined in [pixel/color/spaces/hex.ts:48](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/hex.ts#L48)*

**Returns:** [Hex](hex.md)

___
<a id="tohsv"></a>

###  toHsv

▸ **toHsv**(): [Hsv](hsv.md)

*Implementation of [IColor](../interfaces/icolor.md).[toHsv](../interfaces/icolor.md#tohsv)*

*Defined in [pixel/color/spaces/hex.ts:40](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/hex.ts#L40)*

**Returns:** [Hsv](hsv.md)

___
<a id="torgb"></a>

###  toRgb

▸ **toRgb**(): [Rgb](rgb.md)

*Implementation of [IColor](../interfaces/icolor.md).[toRgb](../interfaces/icolor.md#torgb)*

*Defined in [pixel/color/spaces/hex.ts:28](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/hex.ts#L28)*

**Returns:** [Rgb](rgb.md)

___

