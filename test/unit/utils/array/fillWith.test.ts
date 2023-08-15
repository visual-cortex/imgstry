import { describe, expect, it } from 'vitest';
import { fillWith } from '~/utils/array';

const repeatWith = (predicate: (count: number) => void) =>
    [1, 2, 3, 5, 7, 11, 13, 17].forEach(predicate);

describe('arrayUtil: fillWith', () => {
    repeatWith(count => {
        it(`should generate an array with ${count} entries`, () => {
            // @ts-expect-error allow invalid input
            expect(fillWith(count, void 0).length).to.equal(count);
        });

        it(`should generate an array with the value '10' - ${count} times`, () => {
            const filled = fillWith(count, 10);
            const counter = filled.reduce((acc, current) => current === 10 ? acc + 1 : acc, 0);

            expect(counter).to.equal(count);
        });

        it(`should generate an array with the index value 0...${count - 1}`, () => {
            const filled = fillWith(count, (idx) => idx);
            const counter = filled.reduce((acc, current, idx) => current === idx ? acc + 1 : acc, 0);

            expect(counter).to.equal(count);
        });

        it(`should generate an array with the index value 1...${count}`, () => {
            const filled = fillWith(count, (idx) => idx + 1);
            const counter = filled.reduce((acc, current, idx) => current === idx + 1 ? acc + 1 : acc, 0);

            expect(counter).to.equal(count);
        });
    });
});
