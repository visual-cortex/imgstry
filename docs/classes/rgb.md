[imgstry](../README.md) > [Rgb](../classes/rgb.md)

# Class: Rgb

Rgb colorspace.
*__export__*: 

*__class__*: Rgb

*__implements__*: {IColor}

## Hierarchy

**Rgb**

## Implements

* `IRgb`
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

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new Rgb**(__namedParameters?: *`object`*): [Rgb](rgb.md)

*Defined in [pixel/color/spaces/rgb.ts:35](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/rgb.ts#L35)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| `Default value` __namedParameters | `object` |  DEFAULT |

**Returns:** [Rgb](rgb.md)

___

## Properties

<a id="b"></a>

###  b

**● b**: *`number`*

*Defined in [pixel/color/spaces/rgb.ts:31](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/rgb.ts#L31)*

___
<a id="g"></a>

###  g

**● g**: *`number`*

*Defined in [pixel/color/spaces/rgb.ts:30](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/rgb.ts#L30)*

___
<a id="r"></a>

###  r

**● r**: *`number`*

*Defined in [pixel/color/spaces/rgb.ts:29](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/rgb.ts#L29)*

___

## Accessors

<a id="kind"></a>

###  kind

getkind(): [ColorSpace](../enums/colorspace.md)

*Defined in [pixel/color/spaces/rgb.ts:33](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/rgb.ts#L33)*

**Returns:** [ColorSpace](../enums/colorspace.md)

___

## Methods

<a id="clamp"></a>

###  clamp

▸ **clamp**(): [Rgb](rgb.md)

*Implementation of [IColor](../interfaces/icolor.md).[clamp](../interfaces/icolor.md#clamp)*

*Defined in [pixel/color/spaces/rgb.ts:110](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/rgb.ts#L110)*

**Returns:** [Rgb](rgb.md)

___
<a id="tocmyk"></a>

###  toCmyk

▸ **toCmyk**(): [Cmyk](cmyk.md)

*Implementation of [IColor](../interfaces/icolor.md).[toCmyk](../interfaces/icolor.md#tocmyk)*

*Defined in [pixel/color/spaces/rgb.ts:80](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/rgb.ts#L80)*

**Returns:** [Cmyk](cmyk.md)

___
<a id="tohex"></a>

###  toHex

▸ **toHex**(): [Hex](hex.md)

*Implementation of [IColor](../interfaces/icolor.md).[toHex](../interfaces/icolor.md#tohex)*

*Defined in [pixel/color/spaces/rgb.ts:97](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/rgb.ts#L97)*

**Returns:** [Hex](hex.md)

___
<a id="tohsv"></a>

###  toHsv

▸ **toHsv**(): [Hsv](hsv.md)

*Implementation of [IColor](../interfaces/icolor.md).[toHsv](../interfaces/icolor.md#tohsv)*

*Defined in [pixel/color/spaces/rgb.ts:43](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/rgb.ts#L43)*

**Returns:** [Hsv](hsv.md)

___
<a id="torgb"></a>

###  toRgb

▸ **toRgb**(): [Rgb](rgb.md)

*Implementation of [IColor](../interfaces/icolor.md).[toRgb](../interfaces/icolor.md#torgb)*

*Defined in [pixel/color/spaces/rgb.ts:76](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/rgb.ts#L76)*

**Returns:** [Rgb](rgb.md)

___

