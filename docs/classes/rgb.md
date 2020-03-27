[imgstry](../README.md) › [Globals](../globals.md) › [Rgb](rgb.md)

# Class: Rgb

Rgb colorspace.

**`export`** 

**`implements`** {IColor}

## Hierarchy

* **Rgb**

## Implements

* [IRgb](../interfaces/irgb.md)
* [IColor](../interfaces/icolor.md)

## Index

### Constructors

* [constructor](rgb.md#constructor)

### Properties

* [b](rgb.md#b)
* [g](rgb.md#g)
* [r](rgb.md#r)

### Accessors

* [kind](rgb.md#kind)

### Methods

* [clamp](rgb.md#clamp)
* [toCmyk](rgb.md#tocmyk)
* [toHex](rgb.md#tohex)
* [toHsv](rgb.md#tohsv)
* [toRgb](rgb.md#torgb)

## Constructors

###  constructor

\+ **new Rgb**(`__namedParameters`: object): *[Rgb](rgb.md)*

*Defined in [pixel/color/spaces/rgb.ts:35](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/rgb.ts#L35)*

**Parameters:**

▪`Default value`  **__namedParameters**: *object*= DEFAULT

Name | Type |
------ | ------ |
`b` | number |
`g` | number |
`r` | number |

**Returns:** *[Rgb](rgb.md)*

## Properties

###  b

• **b**: *number*

*Implementation of [IRgb](../interfaces/irgb.md).[b](../interfaces/irgb.md#b)*

*Defined in [pixel/color/spaces/rgb.ts:31](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/rgb.ts#L31)*

___

###  g

• **g**: *number*

*Implementation of [IRgb](../interfaces/irgb.md).[g](../interfaces/irgb.md#g)*

*Defined in [pixel/color/spaces/rgb.ts:30](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/rgb.ts#L30)*

___

###  r

• **r**: *number*

*Implementation of [IRgb](../interfaces/irgb.md).[r](../interfaces/irgb.md#r)*

*Defined in [pixel/color/spaces/rgb.ts:29](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/rgb.ts#L29)*

## Accessors

###  kind

• **get kind**(): *[ColorSpace](../enums/colorspace.md)*

*Defined in [pixel/color/spaces/rgb.ts:33](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/rgb.ts#L33)*

**Returns:** *[ColorSpace](../enums/colorspace.md)*

## Methods

###  clamp

▸ **clamp**(): *[Rgb](rgb.md)*

*Implementation of [IColor](../interfaces/icolor.md)*

*Defined in [pixel/color/spaces/rgb.ts:101](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/rgb.ts#L101)*

**Returns:** *[Rgb](rgb.md)*

___

###  toCmyk

▸ **toCmyk**(): *[Cmyk](cmyk.md)*

*Implementation of [IColor](../interfaces/icolor.md)*

*Defined in [pixel/color/spaces/rgb.ts:71](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/rgb.ts#L71)*

**Returns:** *[Cmyk](cmyk.md)*

___

###  toHex

▸ **toHex**(): *[Hex](hex.md)*

*Implementation of [IColor](../interfaces/icolor.md)*

*Defined in [pixel/color/spaces/rgb.ts:88](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/rgb.ts#L88)*

**Returns:** *[Hex](hex.md)*

___

###  toHsv

▸ **toHsv**(): *[Hsv](hsv.md)*

*Implementation of [IColor](../interfaces/icolor.md)*

*Defined in [pixel/color/spaces/rgb.ts:43](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/rgb.ts#L43)*

**Returns:** *[Hsv](hsv.md)*

___

###  toRgb

▸ **toRgb**(): *[Rgb](rgb.md)*

*Implementation of [IColor](../interfaces/icolor.md)*

*Defined in [pixel/color/spaces/rgb.ts:67](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/rgb.ts#L67)*

**Returns:** *[Rgb](rgb.md)*
