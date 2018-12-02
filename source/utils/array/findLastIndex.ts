export function findLastIndex<T>(arr: T[], predicate: (val: T) => boolean) {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (predicate(arr[i])) {
      return i;
    }
  }
}
