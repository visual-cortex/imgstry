type FillPredicate = number | ((idx: number) => number);

/**
 * Creates an array and fills it with the specified value
 * @param count the number of elements the array should contain
 * @param predicateOrValue the fill predicate
 * @returns the array with the requested value
 */
export function fillWith(count: number, predicateOrValue: FillPredicate) {
    if (typeof predicateOrValue !== 'function') {
        return new Array<number>(count).fill(predicateOrValue);
    }

    const result = new Array<number>(count);
    for (let i = 0; i < count; i++) {
        result[i] = predicateOrValue(i);
    }
    return result;
}
