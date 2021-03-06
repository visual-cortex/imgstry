[imgstry](../README.md) › [Globals](../globals.md) › [Hex](hex.md)

# Class: Hex

HEX colorspace.

**`export`** 

**`implements`** {IColor}

## Hierarchy

* **Hex**

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

## Constructors

###  constructor

\+ **new Hex**(`color`: string): *[Hex](hex.md)*

*Defined in [pixel/color/spaces/hex.ts:21](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/hex.ts#L21)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`color` | string | "#000000" |

**Returns:** *[Hex](hex.md)*

## Properties

###  value

• **value**: *string*

*Defined in [pixel/color/spaces/hex.ts:17](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/hex.ts#L17)*

## Accessors

###  kind

• **get kind**(): *[ColorSpace](../enums/colorspace.md)*

*Defined in [pixel/color/spaces/hex.ts:19](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/hex.ts#L19)*

**Returns:** *[ColorSpace](../enums/colorspace.md)*

## Methods

###  clamp

▸ **clamp**(): *[Hex](hex.md)*

*Implementation of [IColor](../interfaces/icolor.md)*

*Defined in [pixel/color/spaces/hex.ts:51](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/hex.ts#L51)*

**Returns:** *[Hex](hex.md)*

___

###  toCmyk

▸ **toCmyk**(): *[Cmyk](cmyk.md)*

*Implementation of [IColor](../interfaces/icolor.md)*

*Defined in [pixel/color/spaces/hex.ts:43](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/hex.ts#L43)*

**Returns:** *[Cmyk](cmyk.md)*

___

###  toHex

▸ **toHex**(): *[Hex](hex.md)*

*Implementation of [IColor](../interfaces/icolor.md)*

*Defined in [pixel/color/spaces/hex.ts:47](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/hex.ts#L47)*

**Returns:** *[Hex](hex.md)*

___

###  toHsv

▸ **toHsv**(): *[Hsv](hsv.md)*

*Implementation of [IColor](../interfaces/icolor.md)*

*Defined in [pixel/color/spaces/hex.ts:39](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/hex.ts#L39)*

**Returns:** *[Hsv](hsv.md)*

___

###  toRgb

▸ **toRgb**(): *[Rgb](rgb.md)*

*Implementation of [IColor](../interfaces/icolor.md)*

*Defined in [pixel/color/spaces/hex.ts:27](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/hex.ts#L27)*

**Returns:** *[Rgb](rgb.md)*
