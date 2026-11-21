// Run: node --test tribonacci.test.ts   (Node 24+, no dependencies)
import { describe, test } from "node:test"
import assert from "node:assert/strict"
import { tribonacci } from "./tribonacci.ts"

describe("tribonacci - examples from the question", () => {
  test("[1, 3, 5], 5 => [1, 3, 5, 9, 17]", () => {
    assert.deepEqual(tribonacci([1, 3, 5], 5), [1, 3, 5, 9, 17])
  })

  test("[2, 2, 2], 3 => [2, 2, 2]", () => {
    assert.deepEqual(tribonacci([2, 2, 2], 3), [2, 2, 2])
  })

  test("[10, 10, 10], 4 => [10, 10, 10, 30]", () => {
    assert.deepEqual(tribonacci([10, 10, 10], 4), [10, 10, 10, 30])
  })

  test("sequences from the description", () => {
    assert.deepEqual(tribonacci([1, 1, 1], 6), [1, 1, 1, 3, 5, 9])
    assert.deepEqual(tribonacci([2, 3, 1], 6), [2, 3, 1, 6, 10, 17])
  })
})

describe("tribonacci - 3 starting values", () => {
  test("starting values with 0", () => {
    assert.deepEqual(tribonacci([5, 2, 0], 6), [5, 2, 0, 7, 9, 16])
    assert.deepEqual(tribonacci([0, 0, 1], 7), [0, 0, 1, 1, 2, 4, 7])
  })

  test("all 0", () => {
    assert.deepEqual(tribonacci([0, 0, 0], 5), [0, 0, 0, 0, 0])
  })

  test("negative starting values", () => {
    assert.deepEqual(tribonacci([-1, 0, 1], 5), [-1, 0, 1, 0, 1])
  })
})

describe("tribonacci - signature and n do not match", () => {
  test("n = 0 returns [] for any signature", () => {
    assert.deepEqual(tribonacci([], 0), [])
    assert.deepEqual(tribonacci([1], 0), [])
    assert.deepEqual(tribonacci([3, 4, 1], 0), [])
  })

  test("n smaller than signature returns the first n values", () => {
    assert.deepEqual(tribonacci([5, 2, 0], 1), [5])
    assert.deepEqual(tribonacci([5, 2, 0], 2), [5, 2])
    assert.deepEqual(tribonacci([3, 4], 1), [3])
  })

  test("n equal to signature length returns the signature", () => {
    assert.deepEqual(tribonacci([1], 1), [1])
    assert.deepEqual(tribonacci([3, 4], 2), [3, 4])
  })

  test("1 starting value: sum of the values that exist", () => {
    assert.deepEqual(tribonacci([1], 5), [1, 1, 2, 4, 7])
  })

  test("2 starting values: sum of the values that exist", () => {
    assert.deepEqual(tribonacci([3, 4], 5), [3, 4, 7, 14, 25])
  })

  test("empty signature with n > 0 throws RangeError", () => {
    assert.throws(() => tribonacci([], 1), RangeError)
    assert.throws(() => tribonacci([], 5), RangeError)
  })

  test("signature with more than 3 values throws RangeError", () => {
    assert.throws(() => tribonacci([1, 2, 3, 4], 5), RangeError)
  })
})

describe("tribonacci - invalid input", () => {
  test("negative n throws RangeError", () => {
    assert.throws(() => tribonacci([1, 1, 1], -1), RangeError)
  })

  test("decimal n throws RangeError", () => {
    assert.throws(() => tribonacci([1, 1, 1], 2.5), RangeError)
  })

  test("NaN and Infinity n throw RangeError", () => {
    assert.throws(() => tribonacci([1, 1, 1], Number.NaN), RangeError)
    assert.throws(() => tribonacci([1, 1, 1], Number.POSITIVE_INFINITY), RangeError)
  })

  test("signature value that is not an integer throws RangeError", () => {
    assert.throws(() => tribonacci([1, 0.5, 1], 4), RangeError)
    assert.throws(() => tribonacci([1, Number.NaN, 1], 4), RangeError)
  })

  test("value bigger than Number.MAX_SAFE_INTEGER throws RangeError", () => {
    assert.throws(() => tribonacci([1, 1, 1], 100), /bigger than Number.MAX_SAFE_INTEGER/)
  })
})

describe("tribonacci - other", () => {
  test("input array is not changed", () => {
    const signature = [1, 1, 1]
    tribonacci(signature, 6)
    assert.deepEqual(signature, [1, 1, 1])
  })

  test("returns a new array when n equals signature length", () => {
    const signature = [2, 2, 2]
    assert.notEqual(tribonacci(signature, 3), signature)
  })

  test("result length is always n", () => {
    for (let n = 0; n <= 20; n++) {
      assert.equal(tribonacci([1, 1, 1], n).length, n)
    }
  })

  test("each value is the sum of the 3 values before it", () => {
    const result = tribonacci([1, 3, 5], 30)
    for (let i = 3; i < result.length; i++) {
      assert.equal(result[i], result[i - 1]! + result[i - 2]! + result[i - 3]!)
    }
  })
})

describe("tribonacci - safe integer limit", () => {
  test("[1, 1, 1] can make 62 values, 63 throws", () => {
    assert.equal(tribonacci([1, 1, 1], 62).length, 62)
    assert.throws(() => tribonacci([1, 1, 1], 63), RangeError)
  })
})
