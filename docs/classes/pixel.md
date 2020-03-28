[imgstry](../README.md) › [Globals](../globals.md) › [Pixel](pixel.md)

# Class: Pixel <**T**>

**`export`** 

**`template`** 

## Type parameters

▪ **T**: *[IColor](../interfaces/icolor.md)*

## Hierarchy

* **Pixel**

## Implements

* [IPoint](../interfaces/ipoint.md)

## Index

### Constructors

* [constructor](pixel.md#constructor)

### Properties

* [color](pixel.md#optional-color)

### Accessors

* [colorSpace](pixel.md#colorspace)
* [x](pixel.md#x)
* [y](pixel.md#y)

## Constructors

###  constructor

\+ **new Pixel**(`_x`: number, `_y`: number, `color?`: T): *[Pixel](pixel.md)*

*Defined in [pixel/pixel.ts:31](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/pixel.ts#L31)*

**Parameters:**

Name | Type |
------ | ------ |
`_x` | number |
`_y` | number |
`color?` | T |

**Returns:** *[Pixel](pixel.md)*

## Properties

### `Optional` color

• **color**? : *T*

*Defined in [pixel/pixel.ts:36](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/pixel.ts#L36)*

## Accessors

###  colorSpace

• **get colorSpace**(): *[ColorSpace](../enums/colorspace.md)*

*Defined in [pixel/pixel.ts:29](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/pixel.ts#L29)*

**Returns:** *[ColorSpace](../enums/colorspace.md)*

___

###  x

• **get x**(): *number*

*Defined in [pixel/pixel.ts:15](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/pixel.ts#L15)*

**Returns:** *number*

• **set x**(`value`: number): *void*

*Defined in [pixel/pixel.ts:18](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/pixel.ts#L18)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *void*

___

###  y

• **get y**(): *number*

*Defined in [pixel/pixel.ts:22](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/pixel.ts#L22)*

**Returns:** *number*

• **set y**(`value`: number): *void*

*Defined in [pixel/pixel.ts:25](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/pixel.ts#L25)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *void*
