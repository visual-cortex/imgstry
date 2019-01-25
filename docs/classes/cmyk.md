[imgstry](../README.md) > [Cmyk](../classes/cmyk.md)

# Class: Cmyk

CMYK colorspace.
*__export__*: 

*__class__*: Cmyk

*__implements__*: {IColor}

## Hierarchy

**Cmyk**

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

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new Cmyk**(__namedParameters?: *`object`*): [Cmyk](cmyk.md)

*Defined in [pixel/color/spaces/cmyk.ts:39](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/cmyk.ts#L39)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| `Default value` __namedParameters | `object` |  DEFAULT |

**Returns:** [Cmyk](cmyk.md)

___

## Properties

<a id="c"></a>

###  c

**● c**: *`number`*

*Defined in [pixel/color/spaces/cmyk.ts:32](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/cmyk.ts#L32)*

___
<a id="k"></a>

###  k

**● k**: *`number`*

*Defined in [pixel/color/spaces/cmyk.ts:35](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/cmyk.ts#L35)*

___
<a id="m"></a>

###  m

**● m**: *`number`*

*Defined in [pixel/color/spaces/cmyk.ts:33](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/cmyk.ts#L33)*

___
<a id="y"></a>

###  y

**● y**: *`number`*

*Defined in [pixel/color/spaces/cmyk.ts:34](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/cmyk.ts#L34)*

___

## Accessors

<a id="kind"></a>

###  kind

getkind(): [ColorSpace](../enums/colorspace.md)

*Defined in [pixel/color/spaces/cmyk.ts:37](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/cmyk.ts#L37)*

**Returns:** [ColorSpace](../enums/colorspace.md)

___

## Methods

<a id="clamp"></a>

###  clamp

▸ **clamp**(): [Cmyk](cmyk.md)

*Implementation of [IColor](../interfaces/icolor.md).[clamp](../interfaces/icolor.md#clamp)*

*Defined in [pixel/color/spaces/cmyk.ts:68](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/cmyk.ts#L68)*

**Returns:** [Cmyk](cmyk.md)

___
<a id="tocmyk"></a>

###  toCmyk

▸ **toCmyk**(): [Cmyk](cmyk.md)

*Implementation of [IColor](../interfaces/icolor.md).[toCmyk](../interfaces/icolor.md#tocmyk)*

*Defined in [pixel/color/spaces/cmyk.ts:60](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/cmyk.ts#L60)*

**Returns:** [Cmyk](cmyk.md)

___
<a id="tohex"></a>

###  toHex

▸ **toHex**(): [Hex](hex.md)

*Implementation of [IColor](../interfaces/icolor.md).[toHex](../interfaces/icolor.md#tohex)*

*Defined in [pixel/color/spaces/cmyk.ts:64](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/cmyk.ts#L64)*

**Returns:** [Hex](hex.md)

___
<a id="tohsv"></a>

###  toHsv

▸ **toHsv**(): [Hsv](hsv.md)

*Implementation of [IColor](../interfaces/icolor.md).[toHsv](../interfaces/icolor.md#tohsv)*

*Defined in [pixel/color/spaces/cmyk.ts:56](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/cmyk.ts#L56)*

**Returns:** [Hsv](hsv.md)

___
<a id="torgb"></a>

###  toRgb

▸ **toRgb**(): [Rgb](rgb.md)

*Implementation of [IColor](../interfaces/icolor.md).[toRgb](../interfaces/icolor.md#torgb)*

*Defined in [pixel/color/spaces/cmyk.ts:48](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/color/spaces/cmyk.ts#L48)*

**Returns:** [Rgb](rgb.md)

___

