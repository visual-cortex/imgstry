export interface IPoint {
    x: number
    y: number
}

export class Point implements IPoint {
    public x: number;
    public y: number;

    public constructor({ x, y }: IPoint = { x: 0, y: 0 }) {
        this.x = x;
        this.y = y;
    }

    public distanceTo = (point: IPoint) => Math.pow(point.x - this.x, 2) + Math.pow(point.y - this.y, 2);
}
