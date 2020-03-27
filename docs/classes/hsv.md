[imgstry](../README.md) › [Globals](../globals.md) › [Hsv](hsv.md)

# Class: Hsv

HSV colorspace.

**`export`** 

**`implements`** {IColor}

## Hierarchy

* **Hsv**

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

## Constructors

###  constructor

\+ **new Hsv**(`__namedParameters`: object): *[Hsv](hsv.md)*

*Defined in [pixel/color/spaces/hsv.ts:35](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/hsv.ts#L35)*

**Parameters:**

▪`Default value`  **__namedParameters**: *object*= DEFAULT

Name | Type |
------ | ------ |
`h` | number |
`s` | number |
`v` | number |

**Returns:** *[Hsv](hsv.md)*

## Properties

###  h

• **h**: *number*

*Defined in [pixel/color/spaces/hsv.ts:29](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/hsv.ts#L29)*

___

###  s

• **s**: *number*

*Defined in [pixel/color/spaces/hsv.ts:30](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/hsv.ts#L30)*

___

###  v

• **v**: *number*

*Defined in [pixel/color/spaces/hsv.ts:31](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/hsv.ts#L31)*

## Accessors

###  kind

• **get kind**(): *[ColorSpace](../enums/colorspace.md)*

*Defined in [pixel/color/spaces/hsv.ts:33](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/hsv.ts#L33)*

**Returns:** *[ColorSpace](../enums/colorspace.md)*

## Methods

###  clamp

▸ **clamp**(): *[Hsv](hsv.md)*

*Implementation of [IColor](../interfaces/icolor.md)*

*Defined in [pixel/color/spaces/hsv.ts:90](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/hsv.ts#L90)*

**Returns:** *[Hsv](hsv.md)*

___

###  toCmyk

▸ **toCmyk**(): *[Cmyk](cmyk.md)*

*Implementation of [IColor](../interfaces/icolor.md)*

*Defined in [pixel/color/spaces/hsv.ts:82](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/hsv.ts#L82)*

**Returns:** *[Cmyk](cmyk.md)*

___

###  toHex

▸ **toHex**(): *[Hex](hex.md)*

*Implementation of [IColor](../interfaces/icolor.md)*

*Defined in [pixel/color/spaces/hsv.ts:86](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/hsv.ts#L86)*

**Returns:** *[Hex](hex.md)*

___

###  toHsv

▸ **toHsv**(): *[Hsv](hsv.md)*

*Implementation of [IColor](../interfaces/icolor.md)*

*Defined in [pixel/color/spaces/hsv.ts:78](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/hsv.ts#L78)*

**Returns:** *[Hsv](hsv.md)*

___

###  toRgb

▸ **toRgb**(): *[Rgb](rgb.md)*

*Implementation of [IColor](../interfaces/icolor.md)*

*Defined in [pixel/color/spaces/hsv.ts:43](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/hsv.ts#L43)*

**Returns:** *[Rgb](rgb.md)*
