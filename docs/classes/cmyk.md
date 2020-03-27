[imgstry](../README.md) › [Globals](../globals.md) › [Cmyk](cmyk.md)

# Class: Cmyk

CMYK colorspace.

**`export`** 

**`implements`** {IColor}

## Hierarchy

* **Cmyk**

## Implements

* [IColor](../interfaces/icolor.md)

## Index

### Constructors

* [constructor](cmyk.md#constructor)

### Properties

* [c](cmyk.md#c)
* [k](cmyk.md#k)
* [m](cmyk.md#m)
* [y](cmyk.md#y)

### Accessors

* [kind](cmyk.md#kind)

### Methods

* [clamp](cmyk.md#clamp)
* [toCmyk](cmyk.md#tocmyk)
* [toHex](cmyk.md#tohex)
* [toHsv](cmyk.md#tohsv)
* [toRgb](cmyk.md#torgb)

## Constructors

###  constructor

\+ **new Cmyk**(`__namedParameters`: object): *[Cmyk](cmyk.md)*

*Defined in [pixel/color/spaces/cmyk.ts:38](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/cmyk.ts#L38)*

**Parameters:**

▪`Default value`  **__namedParameters**: *object*= DEFAULT

Name | Type |
------ | ------ |
`c` | number |
`k` | number |
`m` | number |
`y` | number |

**Returns:** *[Cmyk](cmyk.md)*

## Properties

###  c

• **c**: *number*

*Defined in [pixel/color/spaces/cmyk.ts:31](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/cmyk.ts#L31)*

___

###  k

• **k**: *number*

*Defined in [pixel/color/spaces/cmyk.ts:34](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/cmyk.ts#L34)*

___

###  m

• **m**: *number*

*Defined in [pixel/color/spaces/cmyk.ts:32](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/cmyk.ts#L32)*

___

###  y

• **y**: *number*

*Defined in [pixel/color/spaces/cmyk.ts:33](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/cmyk.ts#L33)*

## Accessors

###  kind

• **get kind**(): *[ColorSpace](../enums/colorspace.md)*

*Defined in [pixel/color/spaces/cmyk.ts:36](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/cmyk.ts#L36)*

**Returns:** *[ColorSpace](../enums/colorspace.md)*

## Methods

###  clamp

▸ **clamp**(): *[Cmyk](cmyk.md)*

*Implementation of [IColor](../interfaces/icolor.md)*

*Defined in [pixel/color/spaces/cmyk.ts:67](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/cmyk.ts#L67)*

**Returns:** *[Cmyk](cmyk.md)*

___

###  toCmyk

▸ **toCmyk**(): *[Cmyk](cmyk.md)*

*Implementation of [IColor](../interfaces/icolor.md)*

*Defined in [pixel/color/spaces/cmyk.ts:59](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/cmyk.ts#L59)*

**Returns:** *[Cmyk](cmyk.md)*

___

###  toHex

▸ **toHex**(): *[Hex](hex.md)*

*Implementation of [IColor](../interfaces/icolor.md)*

*Defined in [pixel/color/spaces/cmyk.ts:63](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/cmyk.ts#L63)*

**Returns:** *[Hex](hex.md)*

___

###  toHsv

▸ **toHsv**(): *[Hsv](hsv.md)*

*Implementation of [IColor](../interfaces/icolor.md)*

*Defined in [pixel/color/spaces/cmyk.ts:55](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/cmyk.ts#L55)*

**Returns:** *[Hsv](hsv.md)*

___

###  toRgb

▸ **toRgb**(): *[Rgb](rgb.md)*

*Implementation of [IColor](../interfaces/icolor.md)*

*Defined in [pixel/color/spaces/cmyk.ts:47](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/cmyk.ts#L47)*

**Returns:** *[Rgb](rgb.md)*
