[imgstry](../README.md) > [IColor](../interfaces/icolor.md)

# Interface: IColor

Color interface, describes a colorspace.

*__export__*: 

*__interface__*: IColor

## Hierarchy

**IColor**

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

---

## Properties

<a id="kind"></a>

###  kind

**● kind**: *[ColorSpace](../enums/colorspace.md)*

*Defined in [pixel/color/color.ts:22](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/color.ts#L22)*

Returns the colorspace value associated to this color.

*__type__*: {ColorSpace}

*__memberof__*: IColor

___

## Methods

<a id="clamp"></a>

###  clamp

▸ **clamp**(): [IColor](icolor.md)

*Defined in [pixel/color/color.ts:58](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/color.ts#L58)*

Clamps the color values to prevent bleeding.

*__memberof__*: IColor

**Returns:** [IColor](icolor.md)

___
<a id="tocmyk"></a>

###  toCmyk

▸ **toCmyk**(): [IColor](icolor.md)

*Defined in [pixel/color/color.ts:44](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/color.ts#L44)*

Converts the color to CMYK.

*__memberof__*: IColor

**Returns:** [IColor](icolor.md)

___
<a id="tohex"></a>

###  toHex

▸ **toHex**(): [IColor](icolor.md)

*Defined in [pixel/color/color.ts:51](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/color.ts#L51)*

Converts the color to HEX.

*__memberof__*: IColor

**Returns:** [IColor](icolor.md)

___
<a id="tohsv"></a>

###  toHsv

▸ **toHsv**(): [IColor](icolor.md)

*Defined in [pixel/color/color.ts:30](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/color.ts#L30)*

Converts the color to HSV.

*__memberof__*: IColor

**Returns:** [IColor](icolor.md)

___
<a id="torgb"></a>

###  toRgb

▸ **toRgb**(): [IColor](icolor.md)

*Defined in [pixel/color/color.ts:37](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/color.ts#L37)*

Converts the color to RGB.

*__memberof__*: IColor

**Returns:** [IColor](icolor.md)

___

