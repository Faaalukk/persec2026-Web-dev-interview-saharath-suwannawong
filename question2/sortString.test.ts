// Run: node --test sortString.test.ts   (Node 24+, no dependencies)
import { describe, test } from "node:test"
import assert from "node:assert/strict"
import { sortCodes } from "./sortString.ts"

describe("sortCodes - examples from the question", () => {
  test("prefix alphabetical first, then number numeric", () => {
    assert.deepEqual(sortCodes(["TH19", "SG20", "TH2"]), ["SG20", "TH2", "TH19"])
  })

  test("number is numeric order, suffix does not break order", () => {
    assert.deepEqual(
      sortCodes(["TH10", "TH3Netflix", "TH1", "TH7"]),
      ["TH1", "TH3Netflix", "TH7", "TH10"],
    )
  })
})

describe("sortCodes - supported rules", () => {
  test("prefix has more weight than number", () => {
    assert.deepEqual(sortCodes(["TH1", "SG99", "AU500"]), ["AU500", "SG99", "TH1"])
  })

  test("prefix with different length", () => {
    assert.deepEqual(sortCodes(["THA1", "T1", "TH1"]), ["T1", "TH1", "THA1"])
  })

  test("same prefix and number: no suffix first, then suffix alphabetical", () => {
    assert.deepEqual(
      sortCodes(["TH3Netflix", "TH3", "TH3Amazon"]),
      ["TH3", "TH3Amazon", "TH3Netflix"],
    )
  })

  test("multi-digit numbers", () => {
    assert.deepEqual(
      sortCodes(["TH100", "TH20", "TH3", "TH1000"]),
      ["TH3", "TH20", "TH100", "TH1000"],
    )
  })

  test("duplicates are kept", () => {
    assert.deepEqual(sortCodes(["TH2", "SG1", "TH2"]), ["SG1", "TH2", "TH2"])
  })

  test("empty array returns empty array", () => {
    assert.deepEqual(sortCodes([]), [])
  })

  test("single item", () => {
    assert.deepEqual(sortCodes(["TH1"]), ["TH1"])
  })

  test("input array is not changed and a new array is returned", () => {
    const input = ["TH2", "SG1"]
    const result = sortCodes(input)
    assert.deepEqual(input, ["TH2", "SG1"])
    assert.notEqual(result, input)
  })

  test("invalid format goes to the end", () => {
    assert.deepEqual(
      sortCodes(["TH", "123", "TH1", "", "SG5"]),
      ["SG5", "TH1", "", "123", "TH"],
    )
  })
})

// These tests lock the current behavior of cases listed as NOT supported
// in the remarks of sortString.ts. If support is added later, update them.
describe("sortCodes - not supported cases (current behavior)", () => {
  test("case-sensitive: uppercase prefix comes before lowercase", () => {
    assert.deepEqual(sortCodes(["th2", "TH10", "Th1"]), ["TH10", "Th1", "th2"])
  })

  test("leading zeros: equal number keeps input order", () => {
    assert.deepEqual(sortCodes(["TH02", "TH2", "TH002"]), ["TH02", "TH2", "TH002"])
  })

  test("numbers in suffix are compared as plain string", () => {
    assert.deepEqual(
      sortCodes(["TH3Netflix2", "TH3Netflix10"]),
      ["TH3Netflix10", "TH3Netflix2"],
    )
  })

  test("whitespace is not trimmed, so the item is invalid format", () => {
    assert.deepEqual(sortCodes(["TH 2", "TH1"]), ["TH1", "TH 2"])
  })
})
