// Run: node --test romanNumerals.test.ts   (Node 24+, no dependencies)
import { describe, test } from "node:test"
import assert from "node:assert/strict"
import { fromRoman, toRoman } from "./romanNumerals.ts"

// Examples from https://en.wikipedia.org/wiki/Roman_numerals#Standard_form
const WIKIPEDIA_EXAMPLES: [number, string][] = [
  [39, "XXXIX"],
  [160, "CLX"],
  [207, "CCVII"],
  [246, "CCXLVI"],
  [789, "DCCLXXXIX"],
  [1009, "MIX"],
  [1066, "MLXVI"],
  [1776, "MDCCLXXVI"],
  [1900, "MCM"],
  [1912, "MCMXII"],
  [1918, "MCMXVIII"],
  [1944, "MCMXLIV"],
  [2026, "MMXXVI"],
  [2421, "MMCDXXI"],
  [3999, "MMMCMXCIX"],
]

// Digit table from the same Wikipedia section.
const DIGIT_TABLE: Record<string, string[]> = {
  units: ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"],
  tens: ["X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC"],
  hundreds: ["C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM"],
}

describe("toRoman", () => {
  test("Wikipedia examples", () => {
    for (const [num, roman] of WIKIPEDIA_EXAMPLES) {
      assert.equal(toRoman(num), roman, `${num}`)
    }
  })

  test("digit table: units, tens, hundreds", () => {
    DIGIT_TABLE.units.forEach((roman, i) => assert.equal(toRoman(i + 1), roman))
    DIGIT_TABLE.tens.forEach((roman, i) => assert.equal(toRoman((i + 1) * 10), roman))
    DIGIT_TABLE.hundreds.forEach((roman, i) => assert.equal(toRoman((i + 1) * 100), roman))
  })

  test("digit table: thousands", () => {
    assert.equal(toRoman(1000), "M")
    assert.equal(toRoman(2000), "MM")
    assert.equal(toRoman(3000), "MMM")
  })

  test("6 subtractive forms", () => {
    assert.equal(toRoman(4), "IV")
    assert.equal(toRoman(9), "IX")
    assert.equal(toRoman(40), "XL")
    assert.equal(toRoman(90), "XC")
    assert.equal(toRoman(400), "CD")
    assert.equal(toRoman(900), "CM")
  })

  test("zero digit adds no symbol", () => {
    assert.equal(toRoman(1009), "MIX")
    assert.equal(toRoman(2020), "MMXX")
    assert.equal(toRoman(3001), "MMMI")
  })

  test("minimum and maximum", () => {
    assert.equal(toRoman(1), "I")
    assert.equal(toRoman(3999), "MMMCMXCIX")
  })

  test("out of range throws RangeError", () => {
    assert.throws(() => toRoman(0), RangeError)
    assert.throws(() => toRoman(-1), RangeError)
    assert.throws(() => toRoman(4000), RangeError)
  })

  test("not an integer throws RangeError", () => {
    assert.throws(() => toRoman(1.5), RangeError)
    assert.throws(() => toRoman(Number.NaN), RangeError)
    assert.throws(() => toRoman(Number.POSITIVE_INFINITY), RangeError)
  })
})

describe("fromRoman", () => {
  test("Wikipedia examples", () => {
    for (const [num, roman] of WIKIPEDIA_EXAMPLES) {
      assert.equal(fromRoman(roman), num, roman)
    }
  })

  test("6 subtractive forms", () => {
    assert.equal(fromRoman("IV"), 4)
    assert.equal(fromRoman("IX"), 9)
    assert.equal(fromRoman("XL"), 40)
    assert.equal(fromRoman("XC"), 90)
    assert.equal(fromRoman("CD"), 400)
    assert.equal(fromRoman("CM"), 900)
  })

  test("non-standard additive forms throw", () => {
    for (const roman of ["IIII", "VIIII", "XXXX", "CCCC", "MMMM"]) {
      assert.throws(() => fromRoman(roman), Error, roman)
    }
  })

  test("repeated V, L, D throws", () => {
    for (const roman of ["VV", "LL", "DD"]) {
      assert.throws(() => fromRoman(roman), Error, roman)
    }
  })

  test("irregular subtractive forms throw", () => {
    for (const roman of ["IL", "IC", "ID", "IM", "XD", "XM", "VX", "LC", "DM", "IIX", "XXC"]) {
      assert.throws(() => fromRoman(roman), Error, roman)
    }
  })

  test("wrong order throws", () => {
    for (const roman of ["IVI", "IXI", "XCX", "CMC", "IIV"]) {
      assert.throws(() => fromRoman(roman), Error, roman)
    }
  })

  test("empty string throws", () => {
    assert.throws(() => fromRoman(""), Error)
  })

  test("invalid character throws", () => {
    for (const roman of ["ABC", "X1", "12", "N"]) {
      assert.throws(() => fromRoman(roman), /Invalid Roman numeral character/, roman)
    }
  })
})

describe("toRoman and fromRoman together", () => {
  test("round trip for every number from 1 to 3999", () => {
    for (let num = 1; num <= 3999; num++) {
      assert.equal(fromRoman(toRoman(num)), num)
    }
  })

  test("every number from 1 to 3999 has a different Roman numeral", () => {
    const all = new Set<string>()
    for (let num = 1; num <= 3999; num++) all.add(toRoman(num))
    assert.equal(all.size, 3999)
  })
})

// These tests lock the current behavior of cases listed as NOT supported
// in the remarks of romanNumerals.ts. If support is added later, update them.
describe("not supported cases (current behavior)", () => {
  test("lowercase input throws", () => {
    assert.throws(() => fromRoman("xiv"), Error)
  })

  test("whitespace is not trimmed", () => {
    assert.throws(() => fromRoman(" XIV"), Error)
  })

  test("Unicode Roman numeral character throws", () => {
    assert.throws(() => fromRoman("Ⅻ"), Error)
  })
})
