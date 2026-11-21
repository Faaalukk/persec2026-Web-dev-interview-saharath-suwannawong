/**
 * Tribonacci: each next value is the sum of the 3 values before it.
 *
 *   tribonacci([1, 3, 5], 5)    -> [1, 3, 5, 9, 17]
 *   tribonacci([2, 2, 2], 3)    -> [2, 2, 2]
 *   tribonacci([10, 10, 10], 4) -> [10, 10, 10, 30]
 *
 * Parameters:
 *   signature - starting values, 0 to 3 integers
 *   n         - number of values in the result (starting values included),
 *               a non-negative integer
 *
 * Rules when signature and n do not match:
 *   - n = 0 returns [] for any signature.
 *   - n < signature.length returns the first n starting values.
 *     tribonacci([5, 2, 0], 2) -> [5, 2]
 *   - signature with 1 or 2 values: the next value is the sum of the
 *     values that exist (at most the last 3).
 *     tribonacci([1], 5)    -> [1, 1, 2, 4, 7]
 *     tribonacci([3, 4], 5) -> [3, 4, 7, 14, 25]
 *   - Empty signature with n > 0 throws RangeError (nothing to sum).
 *
 * Errors (RangeError):
 *   - signature has more than 3 values.
 *   - signature has a value that is not a safe integer.
 *   - n is not a non-negative safe integer.
 *   - A computed value is bigger than Number.MAX_SAFE_INTEGER
 *     (for [1, 1, 1] the limit is 62 values).
 *
 * Remarks - cases NOT supported:
 *   - Values bigger than Number.MAX_SAFE_INTEGER (BigInt).
 *   - Decimal starting values (0.5).
 *   - Other rule for a short signature, for example filling missing values
 *     with 0 ([1] -> [0, 0, 1, ...]). The rule "sum of the values that exist" is used.
 *   - Very big n uses memory for the whole array (no lazy generator).
 */

const SIZE = 3

export function tribonacci(signature: number[], n: number): number[] {
  if (signature.length > SIZE) {
    throw new RangeError(`Signature must have 0 to ${SIZE} values: [${signature.join(", ")}]`)
  }
  if (!signature.every((value) => Number.isSafeInteger(value))) {
    throw new RangeError(`Signature values must be safe integers: [${signature.join(", ")}]`)
  }
  if (!Number.isSafeInteger(n) || n < 0) {
    throw new RangeError(`n must be a non-negative safe integer: ${n}`)
  }

  // Copy, so the input array is not changed.
  const result = signature.slice(0, n)
  if (result.length === n) {
    return result
  }

  if (result.length === 0) {
    throw new RangeError(`Signature is empty, so it cannot make ${n} values`)
  }

  while (result.length < n) {
    // Sum of the last 3 values (or fewer, if the signature is short).
    const next = result.slice(-SIZE).reduce((sum, value) => sum + value, 0)
    if (!Number.isSafeInteger(next)) {
      throw new RangeError(`Value ${result.length + 1} is bigger than Number.MAX_SAFE_INTEGER`)
    }
    result.push(next)
  }
  return result
}

console.log(tribonacci([1, 3, 5], 5))
// [ 1, 3, 5, 9, 17 ]
console.log(tribonacci([10, 10, 10], 4))
// [ 10, 10, 10, 30 ]
// or bash node --test tribonacci.test.ts for test spec
