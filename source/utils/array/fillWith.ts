
type FillPredicate = number | ((idx: number) => number);

/**
 * Creates an array and fills it with the specified value
 * @param count the number of elements the array should contain
 * @param predicateOrValue the fill predicate
 * @returns the array with the requested value
 */
export function fillWith(count: number, predicateOrValue: FillPredicate) {
    if (typeof predicateOrValue === 'function') {
        return Array(count).fill(void 0).map((_, idx) => predicateOrValue(idx));
    }

    return Array(count).fill(predicateOrValue);
}
