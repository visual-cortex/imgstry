[imgstry](../README.md) > [Pixel](../classes/pixel.md)

# Class: Pixel

*__export__*: 

*__class__*: Pixel

*__template__*: IColor

## Type parameters
#### T :  [IColor](../interfaces/icolor.md)
## Hierarchy

**Pixel**

## Implements

* [IPoint](../interfaces/ipoint.md)

## Index

### Constructors

* [constructor](pixel.md#constructor)

### Properties

* [color](pixel.md#color)

### Accessors

* [colorSpace](pixel.md#colorspace)
* [x](pixel.md#x)
* [y](pixel.md#y)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new Pixel**(_x: *`number`*, _y: *`number`*, color?: *`T`*): [Pixel](pixel.md)

*Defined in [pixel/pixel.ts:34](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/pixel.ts#L34)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| _x | `number` |
| _y | `number` |
| `Optional` color | `T` |

**Returns:** [Pixel](pixel.md)

___

## Properties

<a id="color"></a>

### `<Optional>` color

**● color**: *`T`*

*Defined in [pixel/pixel.ts:39](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/pixel.ts#L39)*

___

## Accessors

<a id="colorspace"></a>

###  colorSpace

getcolorSpace(): [ColorSpace](../enums/colorspace.md)

*Defined in [pixel/pixel.ts:30](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/pixel.ts#L30)*

**Returns:** [ColorSpace](../enums/colorspace.md)

___
<a id="x"></a>

###  x

getx(): `number`setx(value: *`number`*): `void`

*Defined in [pixel/pixel.ts:16](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/pixel.ts#L16)*

**Returns:** `number`

*Defined in [pixel/pixel.ts:19](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/pixel.ts#L19)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| value | `number` |

**Returns:** `void`

___
<a id="y"></a>

###  y

gety(): `number`sety(value: *`number`*): `void`

*Defined in [pixel/pixel.ts:23](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/pixel.ts#L23)*

**Returns:** `number`

*Defined in [pixel/pixel.ts:26](https://github.com/visual-cortex/imgstry/blob/master/source/pixel/pixel.ts#L26)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| value | `number` |

**Returns:** `void`

___

