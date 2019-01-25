/**
 * Creates an array and fills it with the specified value
 *
 * @export
 * @param {number} count the number of elements the array should contain
 * @param {number} value the filler value
 * @returns { number[] } the array with the requested value
 */
export function fillWith(count: number, value: number) {
  return Array(count).fill(value);
}
