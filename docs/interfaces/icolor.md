[imgstry](../README.md) › [Globals](../globals.md) › [IColor](icolor.md)

# Interface: IColor

Color interface, describes a colorspace.

**`export`** 

**`interface`** IColor

## Hierarchy

* **IColor**

## Implemented by

* [Cmyk](../classes/cmyk.md)
* [Hex](../classes/hex.md)
* [Hsv](../classes/hsv.md)
* [Rgb](../classes/rgb.md)

## Index

### Properties

* [kind](icolor.md#kind)

### Methods

* [clamp](icolor.md#clamp)
* [toCmyk](icolor.md#tocmyk)
* [toHex](icolor.md#tohex)
* [toHsv](icolor.md#tohsv)
* [toRgb](icolor.md#torgb)

## Properties

###  kind

• **kind**: *[ColorSpace](../enums/colorspace.md)*

*Defined in [pixel/color/color.ts:22](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/color.ts#L22)*

Returns the colorspace value associated to this color.

**`memberof`** IColor

## Methods

###  clamp

▸ **clamp**(): *[IColor](icolor.md)*

*Defined in [pixel/color/color.ts:58](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/color.ts#L58)*

Clamps the color values to prevent bleeding.

**`memberof`** IColor

**Returns:** *[IColor](icolor.md)*

___

###  toCmyk

▸ **toCmyk**(): *[IColor](icolor.md)*

*Defined in [pixel/color/color.ts:44](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/color.ts#L44)*

Converts the color to CMYK.

**`memberof`** IColor

**Returns:** *[IColor](icolor.md)*

___

###  toHex

▸ **toHex**(): *[IColor](icolor.md)*

*Defined in [pixel/color/color.ts:51](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/color.ts#L51)*

Converts the color to HEX.

**`memberof`** IColor

**Returns:** *[IColor](icolor.md)*

___

###  toHsv

▸ **toHsv**(): *[IColor](icolor.md)*

*Defined in [pixel/color/color.ts:30](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/color.ts#L30)*

Converts the color to HSV.

**`memberof`** IColor

**Returns:** *[IColor](icolor.md)*

___

###  toRgb

▸ **toRgb**(): *[IColor](icolor.md)*

*Defined in [pixel/color/color.ts:37](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/color.ts#L37)*

Converts the color to RGB.

**`memberof`** IColor

**Returns:** *[IColor](icolor.md)*
