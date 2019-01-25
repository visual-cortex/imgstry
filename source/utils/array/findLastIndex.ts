/**
 * Retrieves the last index that resolves the predicate
 *
 * @export
 * @template T
 * @param {T[]} arr the source array
 * @param {Function} predicate the predicate with the logic
 * @returns {number} the position of the found element, -1 if not found
 */
export function findLastIndex<T>(arr: T[], predicate: (val: T) => boolean) {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (predicate(arr[i])) {
      return i;
    }
  }

  return -1;
}
