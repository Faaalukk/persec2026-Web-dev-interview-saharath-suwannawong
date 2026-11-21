// Run: node --test validString.test.ts   (Node 24+, no dependencies)
import { describe, test } from "node:test"
import assert from "node:assert/strict"
import { isValid } from "./validString.ts"

describe("isValid - examples in validString.ts", () => {
  const cases: [string, boolean][] = [
    ["()", true],
    ["([]]", false],
    ["([{}])", true],
    ["([[{}]]]", false],
    [")", false],
    ["(]}])", false],
    ["([)]", false],
    ["{", false],
  ]
  for (const [input, expected] of cases) {
    test(`"${input}" => ${expected}`, () => assert.equal(isValid(input), expected))
  }
})

describe("isValid - valid input", () => {
  test("each bracket type alone", () => {
    assert.equal(isValid("()"), true)
    assert.equal(isValid("[]"), true)
    assert.equal(isValid("{}"), true)
  })

  test("brackets side by side", () => {
    assert.equal(isValid("()[]{}"), true)
    assert.equal(isValid("(){}[]()"), true)
  })

  test("nested brackets", () => {
    assert.equal(isValid("{[()]}"), true)
    assert.equal(isValid("((()))"), true)
    assert.equal(isValid("[({})]{}"), true)
  })

  test("nested and side by side together", () => {
    assert.equal(isValid("{[]}([{}])[]"), true)
  })

  test("empty string is valid (nothing to close)", () => {
    assert.equal(isValid(""), true)
  })

  test("long valid input", () => {
    assert.equal(isValid("(".repeat(5000) + ")".repeat(5000)), true)
  })
})

describe("isValid - invalid input", () => {
  test("only open brackets", () => {
    assert.equal(isValid("("), false)
    assert.equal(isValid("(["), false)
    assert.equal(isValid("{{{"), false)
  })

  test("only close brackets", () => {
    assert.equal(isValid("]"), false)
    assert.equal(isValid("))"), false)
  })

  test("close before open", () => {
    assert.equal(isValid(")("), false)
    assert.equal(isValid("][]["), false)
  })

  test("wrong bracket type", () => {
    assert.equal(isValid("(]"), false)
    assert.equal(isValid("{)"), false)
    assert.equal(isValid("[}"), false)
  })

  test("wrong closing order", () => {
    assert.equal(isValid("([)]"), false)
    assert.equal(isValid("{[}]"), false)
  })

  test("extra open bracket at the end", () => {
    assert.equal(isValid("()("), false)
  })

  test("extra close bracket at the end", () => {
    assert.equal(isValid("())"), false)
  })

  test("long invalid input (one bracket missing)", () => {
    assert.equal(isValid("(".repeat(5000) + ")".repeat(4999)), false)
  })
})

describe("isValid - other characters (current behavior)", () => {
  test("any character that is not a bracket returns false", () => {
    assert.equal(isValid("a"), false)
    assert.equal(isValid("(a)"), false)
    assert.equal(isValid("( )"), false)
    assert.equal(isValid("<>"), false)
  })
})
