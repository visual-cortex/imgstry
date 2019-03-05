
type FillPredicate = number | ((idx: number) => number);

/**
 * Creates an array and fills it with the specified value
 *
 * @export
 * @param {number} count the number of elements the array should contain
 * @param {FillPredicate} predicateOrValue the fill predicate
 * @returns { number[] } the array with the requested value
 */
export function fillWith(count: number, predicateOrValue: FillPredicate) {
  if (typeof predicateOrValue === 'function') {
    return Array(count).fill(void 0).map((_, idx) => predicateOrValue(idx));
  }

  return Array(count).fill(predicateOrValue);
}
