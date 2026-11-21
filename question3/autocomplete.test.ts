// Run: node --test autocomplete.test.ts   (Node 24+, no dependencies)
import { describe, test } from "node:test"
import assert from "node:assert/strict"
import { autocomplete } from "./autocomplete.ts"

describe("autocomplete - example from the question", () => {
  test("returns top 2 by priority", () => {
    assert.deepEqual(
      autocomplete("th", ["Mother", "Think", "Worthy", "Apple", "Android"], 2),
      ["Think", "Mother"],
    )
  })

  test("same input with bigger maxResult returns all 3 matches", () => {
    assert.deepEqual(
      autocomplete("th", ["Mother", "Think", "Worthy", "Apple", "Android"], 10),
      ["Think", "Mother", "Worthy"],
    )
  })
})

describe("autocomplete - priority", () => {
  test("START, then MIDDLE, then END", () => {
    assert.deepEqual(
      autocomplete("th", ["Math", "Mother", "Think"], 3),
      ["Think", "Mother", "Math"],
    )
  })

  test("same priority keeps input order", () => {
    assert.deepEqual(
      autocomplete("th", ["Worthy", "Bath", "Mother", "Path", "Three", "Thin"], 6),
      ["Three", "Thin", "Worthy", "Mother", "Bath", "Path"],
    )
  })

  test("first occurrence decides priority: starts and ends with search is START", () => {
    assert.deepEqual(autocomplete("th", ["Math", "Thoth"], 2), ["Thoth", "Math"])
  })

  test("item equal to search is START", () => {
    assert.deepEqual(autocomplete("th", ["Math", "TH"], 2), ["TH", "Math"])
  })
})

describe("autocomplete - ignore case", () => {
  test("search in uppercase matches lowercase items", () => {
    assert.deepEqual(autocomplete("TH", ["think", "mother"], 2), ["think", "mother"])
  })

  test("mixed case search and items", () => {
    assert.deepEqual(autocomplete("tH", ["MATH", "ThInK"], 2), ["ThInK", "MATH"])
  })

  test("returns items with original letter case", () => {
    assert.deepEqual(autocomplete("th", ["THINK"], 1), ["THINK"])
  })
})

describe("autocomplete - maxResult", () => {
  test("maxResult bigger than matches returns all matches", () => {
    assert.deepEqual(autocomplete("th", ["Think", "Apple"], 5), ["Think"])
  })

  test("maxResult = 0 returns []", () => {
    assert.deepEqual(autocomplete("th", ["Think"], 0), [])
  })

  test("negative maxResult returns []", () => {
    assert.deepEqual(autocomplete("th", ["Think", "Mother"], -1), [])
  })

  test("limit is applied after sort", () => {
    assert.deepEqual(autocomplete("th", ["Math", "Mother", "Think"], 1), ["Think"])
  })
})

describe("autocomplete - other cases", () => {
  test("no match returns []", () => {
    assert.deepEqual(autocomplete("xyz", ["Think", "Mother"], 2), [])
  })

  test("empty items returns []", () => {
    assert.deepEqual(autocomplete("th", [], 2), [])
  })

  test("empty search returns []", () => {
    assert.deepEqual(autocomplete("", ["Think", "Mother"], 2), [])
  })

  test("search longer than item does not match", () => {
    assert.deepEqual(autocomplete("thinking", ["Think"], 1), [])
  })

  test("duplicates are kept", () => {
    assert.deepEqual(autocomplete("th", ["Think", "Think"], 2), ["Think", "Think"])
  })

  test("input array is not changed", () => {
    const items = ["Math", "Think"]
    autocomplete("th", items, 2)
    assert.deepEqual(items, ["Math", "Think"])
  })
})

// These tests lock the current behavior of cases listed as NOT supported
// in the remarks of autocomplete.ts. If support is added later, update them.
describe("autocomplete - not supported cases (current behavior)", () => {
  test("phrase is checked as one string, not per word", () => {
    assert.deepEqual(autocomplete("york", ["New York", "Yorkshire"], 2), ["Yorkshire", "New York"])
  })

  test("whitespace in search is not trimmed", () => {
    assert.deepEqual(autocomplete(" th", ["Think"], 1), [])
  })

  test("accent is not ignored", () => {
    assert.deepEqual(autocomplete("cafe", ["Café"], 1), [])
  })
})
