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

    public distanceTo(point: IPoint): number {
        const dx = point.x - this.x;
        const dy = point.y - this.y;
        return dx * dx + dy * dy;
    }
}
