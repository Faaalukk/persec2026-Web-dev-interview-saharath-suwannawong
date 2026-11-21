// Run: node --test descendingDigits.test.ts   (Node 24+, no dependencies)
import { describe, test } from "node:test"
import assert from "node:assert/strict"
import { sortDigitsDescending } from "./descendingDigits.ts"

describe("sortDigitsDescending - examples from the question", () => {
  test("3008 => 8300", () => assert.equal(sortDigitsDescending(3008), 8300))
  test("1989 => 9981", () => assert.equal(sortDigitsDescending(1989), 9981))
  test("2679 => 9762", () => assert.equal(sortDigitsDescending(2679), 9762))
  test("9163 => 9631", () => assert.equal(sortDigitsDescending(9163), 9631))
})

describe("sortDigitsDescending - other valid input", () => {
  test("single digit returns the same number", () => {
    assert.equal(sortDigitsDescending(1), 1)
    assert.equal(sortDigitsDescending(7), 7)
  })

  test("already in descending order returns the same number", () => {
    assert.equal(sortDigitsDescending(9631), 9631)
    assert.equal(sortDigitsDescending(1000), 1000)
  })

  test("ascending order is reversed", () => {
    assert.equal(sortDigitsDescending(123456789), 987654321)
  })

  test("zero digits move to the end", () => {
    assert.equal(sortDigitsDescending(10), 10)
    assert.equal(sortDigitsDescending(1001), 1100)
    assert.equal(sortDigitsDescending(90000), 90000)
  })

  test("same digits", () => {
    assert.equal(sortDigitsDescending(5555), 5555)
  })

  test("result returns a number, not a string", () => {
    assert.equal(typeof sortDigitsDescending(3008), "number")
  })

  test("16-digit number whose result is still a safe integer", () => {
    assert.equal(sortDigitsDescending(1000000000000008), 8100000000000000)
  })
})

describe("sortDigitsDescending - invalid input", () => {
  test("0 throws RangeError", () => {
    assert.throws(() => sortDigitsDescending(0), RangeError)
  })

  test("negative number throws RangeError", () => {
    assert.throws(() => sortDigitsDescending(-3008), RangeError)
  })

  test("decimal number throws RangeError", () => {
    assert.throws(() => sortDigitsDescending(12.5), RangeError)
  })

  test("NaN and Infinity throw RangeError", () => {
    assert.throws(() => sortDigitsDescending(Number.NaN), RangeError)
    assert.throws(() => sortDigitsDescending(Number.POSITIVE_INFINITY), RangeError)
  })

  test("number bigger than Number.MAX_SAFE_INTEGER throws RangeError", () => {
    assert.throws(() => sortDigitsDescending(Number.MAX_SAFE_INTEGER + 1), RangeError)
  })

  test("result bigger than Number.MAX_SAFE_INTEGER throws RangeError", () => {
    assert.throws(() => sortDigitsDescending(1999999999999999), /Result is bigger/)
  })
})
