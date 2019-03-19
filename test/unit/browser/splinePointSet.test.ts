import { expect } from 'chai';
import {
  Point,
  SplinePointSet,
} from '~core/point';

describe('class: SplinePointSet', () => {
  it(`should have a static 'NotFound' definition`, () => {
    const notFound = SplinePointSet.notFound;

    expect(notFound).to.not.be.undefined;
    expect(notFound.index).to.equal(-1);
    expect(notFound.point).to.be.null;
  });

  it(`should return the first point via the 'first' getter`, () => {
    const set = new SplinePointSet([
      { x: 1, y: 1 },
      { x: 2, y: 2 },
    ]);

    expect(set.first).to.be.an.instanceOf(Point);
    expect(set.first).to.deep.include({ x: 1, y: 1 });
  });

  it(`should convert 'ctor' items to points`, () => {
    const set = new SplinePointSet([
      { x: 1, y: 1 },
      { x: 2, y: 2 },
      new Point({ x: 3, y: 3 }),
    ]);

    set.forEach(point => expect(point).to.be.an.instanceOf(Point));
  });

  it('should find the closest point index', () => {
    const set = new SplinePointSet([
      { x: 1, y: 1 },
      { x: 2, y: 2 },
      new Point({ x: 3, y: 3 }),
    ]);

    const idx = set.indexOfClosest({ x: 2.6, y: 2.6 }, .5, (point) => point);

    expect(idx).to.equal(2);
  });

  it('should find the closest point', () => {
    const set = new SplinePointSet([
      { x: 1, y: 1 },
      { x: 2, y: 2 },
      new Point({ x: 3, y: 3 }),
    ]);

    const point = set.closest({ x: 2.6, y: 2.6 }, .5, (p) => p);

    expect(point.point).to.deep.include({ x: 3, y: 3 });
  });

  it('should return -1 if the closest point is not found', () => {
    const set = new SplinePointSet([
      { x: 1, y: 1 },
      { x: 2, y: 2 },
      new Point({ x: 3, y: 3 }),
    ]);

    const idx = set.indexOfClosest({ x: 2.6, y: 2.6 }, .001, (point) => point);

    expect(idx).to.equal(-1);
  });

  it('should return -1 if the set is empty', () => {
    const set = new SplinePointSet([]);

    const idx = set.indexOfClosest({ x: 2.6, y: 2.6 }, .001, (point) => point);

    expect(idx).to.equal(-1);
  });

  it('should insert x: .5 as the first element', () => {
    const set = new SplinePointSet([
      { x: 1, y: 1 },
      { x: 2, y: 2 },
      new Point({ x: 3, y: 3 }),
    ]);

    const newPoint = { x: .5, y: 1 };

    set.push(newPoint);

    expect(set.first).to.deep.include(newPoint);
  });

  it('should insert x: 4 as the last element', () => {
    const set = new SplinePointSet([
      { x: 1, y: 1 },
      { x: 2, y: 2 },
      new Point({ x: 3, y: 3 }),
    ]);

    const newPoint = { x: 4, y: 1 };

    set.push(newPoint);

    expect(set.indexOfClosest(newPoint, .1, (p) => p)).to.equal(set.length - 1);
  });

  it('should be iterrable', () => {
    const set = new SplinePointSet([
      { x: 1, y: 1 },
      { x: 2, y: 2 },
      new Point({ x: 3, y: 3 }),
    ]);

    for (const point of set) {
      expect(point).to.be.an.instanceOf(Point);
    }
  });

  it('should update point', () => {
    const set = new SplinePointSet([
      { x: 1, y: 1 },
      { x: 2, y: 2 },
      new Point({ x: 3, y: 3 }),
    ]);

    const idx = set.indexOfClosest({ x: 2.6, y: 2.6 }, .5, (point) => point);

    const updated = set.update(idx, { x: .3, y: .3 });

    expect(set.first).to.deep.include({ x: .3, y: .3 });
    expect(updated.point).to.deep.include({ x: .3, y: .3 });
    expect(set.length).to.equal(3);
  });

  it('should NOT update point if there is another point on the same X coordinate', () => {
    const set = new SplinePointSet([
      { x: 1, y: 1 },
      { x: 2, y: 2 },
      new Point({ x: 3, y: 3 }),
    ]);

    const idx = set.indexOfClosest({ x: 2.6, y: 2.6 }, .5, (point) => point);

    const updated = set.update(idx, { x: 1, y: .3 });

    expect(set.first).to.deep.include({ x: 1, y: 1 });
    expect(updated.point).to.deep.include({ x: 1, y: 1 });
    expect(set.length).to.equal(3);
  });
});
