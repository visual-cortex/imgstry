/**
 * Retrieves the last index that resolves the predicate
 * @template T
 * @param arr the source array
 * @param predicate the predicate with the logic
 * @returns the position of the found element, -1 if not found
 */
export function findLastIndex<T>(arr: T[], predicate: (val: T) => boolean) {
    for (let i = arr.length - 1; i >= 0; i--) {
        if (predicate(arr[i])) {
            return i;
        }
    }

    return -1;
}
