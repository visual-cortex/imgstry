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

*Defined in [pixel/color/spaces/hex.ts:21](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/hex.ts#L21)*

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

*Defined in [pixel/color/spaces/hex.ts:17](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/hex.ts#L17)*

___

## Accessors

<a id="kind"></a>

###  kind

**get kind**(): [ColorSpace](../enums/colorspace.md)

*Defined in [pixel/color/spaces/hex.ts:19](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/hex.ts#L19)*

**Returns:** [ColorSpace](../enums/colorspace.md)

___

## Methods

<a id="clamp"></a>

###  clamp

▸ **clamp**(): [Hex](hex.md)

*Implementation of [IColor](../interfaces/icolor.md).[clamp](../interfaces/icolor.md#clamp)*

*Defined in [pixel/color/spaces/hex.ts:51](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/hex.ts#L51)*

**Returns:** [Hex](hex.md)

___
<a id="tocmyk"></a>

###  toCmyk

▸ **toCmyk**(): [Cmyk](cmyk.md)

*Implementation of [IColor](../interfaces/icolor.md).[toCmyk](../interfaces/icolor.md#tocmyk)*

*Defined in [pixel/color/spaces/hex.ts:43](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/hex.ts#L43)*

**Returns:** [Cmyk](cmyk.md)

___
<a id="tohex"></a>

###  toHex

▸ **toHex**(): [Hex](hex.md)

*Implementation of [IColor](../interfaces/icolor.md).[toHex](../interfaces/icolor.md#tohex)*

*Defined in [pixel/color/spaces/hex.ts:47](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/hex.ts#L47)*

**Returns:** [Hex](hex.md)

___
<a id="tohsv"></a>

###  toHsv

▸ **toHsv**(): [Hsv](hsv.md)

*Implementation of [IColor](../interfaces/icolor.md).[toHsv](../interfaces/icolor.md#tohsv)*

*Defined in [pixel/color/spaces/hex.ts:39](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/hex.ts#L39)*

**Returns:** [Hsv](hsv.md)

___
<a id="torgb"></a>

###  toRgb

▸ **toRgb**(): [Rgb](rgb.md)

*Implementation of [IColor](../interfaces/icolor.md).[toRgb](../interfaces/icolor.md#torgb)*

*Defined in [pixel/color/spaces/hex.ts:27](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/hex.ts#L27)*

**Returns:** [Rgb](rgb.md)

___

