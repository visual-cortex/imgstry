import { expect } from 'chai';
import { findLastIndex } from '~utils/array';

describe('arrayUtil: findLastIndex', () => {
  it(`should return -1 if no element satisfies the condition`, () => {
    expect(findLastIndex([1], (val) => val === 2)).to.equal(-1);
  });

  it(`should return the last index in an array filled with the same values as the searched value`, () => {
    const collection = [1, 1, 1, 1, 1];
    expect(findLastIndex(collection, (val) => val === 1)).to.equal(collection.length - 1);
  });

  it(`should return last index in an array if the searched value is the last element`, () => {
    const collection = [2, 1, 3, 3, 1, 2];
    expect(findLastIndex(collection, (val) => val === 2)).to.equal(collection.length - 1);
  });
});
