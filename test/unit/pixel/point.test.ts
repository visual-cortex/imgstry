import { describe, expect, it } from 'vitest';
import { Point } from '~/core/point';
import { fillWith } from '~/utils/array';

describe('class: Point', () => {
    it('should construct correctly', () => {
        const point = new Point();

        expect(point).to.deep.include({ x: 0, y: 0 });
    });

    fillWith(25, (i) => i).forEach(x =>
        fillWith(x, (i) => i * 2).forEach(y => {
            const p1 = new Point({ x, y });
            const p2 = new Point({ x: 255 - x, y: 255 - y });
            it(`should correctly calculate distances between P1: x:${p1.x} y:${p1.x} and P2: x:${p2.x} y:${p2.y}`, () => {
                const expectedDistance = Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2);

                expect(p1.distanceTo(p2)).to.equal(expectedDistance);
            });
        }),
    );
});
