/**
 * Sort the digits of a positive integer from highest to lowest
 * and return the result as a number.
 *
 *   3008 -> 8300
 *   1989 -> 9981
 *   2679 -> 9762
 *   9163 -> 9631
 *
 * Rules:
 *   - num must be a positive safe integer (1 to Number.MAX_SAFE_INTEGER),
 *     else RangeError.
 *   - The result must also be a safe integer, else RangeError.
 *     Example: 1999999999999999 -> 9999999999999991 is bigger than
 *     Number.MAX_SAFE_INTEGER (9007199254740991), so it cannot be exact.
 *   - Zero digits go to the end, so they are kept (3008 -> 8300).
 *
 * Remarks - cases NOT supported:
 *   - 0 and negative numbers (not positive integers).
 *   - Decimal numbers (12.5).
 *   - Numbers bigger than Number.MAX_SAFE_INTEGER, or BigInt input.
 *   - String input ("3008"). Only number is accepted.
 *   - Ascending order.
 */

export function sortDigitsDescending(num: number): number {
  if (!Number.isSafeInteger(num) || num <= 0) {
    throw new RangeError(`Number must be a positive safe integer: ${num}`)
  }

  // Each item is one character "0" to "9", so string sort is the same as number sort.
  const sorted = String(num).split("").sort().reverse().join("")
  const result = Number(sorted)

  if (!Number.isSafeInteger(result)) {
    throw new RangeError(`Result is bigger than Number.MAX_SAFE_INTEGER: ${sorted}`)
  }
  return result
}

console.log(sortDigitsDescending(3008))
// 8300
console.log(sortDigitsDescending(1989))
// 9981
// or bash node --test descendingDigits.test.ts for test spec
