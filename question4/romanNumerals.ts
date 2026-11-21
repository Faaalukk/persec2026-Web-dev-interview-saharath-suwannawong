/**
 * Modern Roman numerals (standard form)
 * Reference: https://en.wikipedia.org/wiki/Roman_numerals#Standard_form
 *
 * Symbols: I = 1, V = 5, X = 10, L = 50, C = 100, D = 500, M = 1000
 * Subtractive forms (the only ones in standard use):
 *   IV = 4, IX = 9, XL = 40, XC = 90, CD = 400, CM = 900
 * Each digit (thousands, hundreds, tens, units) is written separately,
 * from highest to lowest. A zero digit adds no symbol.
 * Range: 1 to 3999 (MMMCMXCIX). There is no symbol for zero.
 *
 * Rules:
 *   - toRoman(num): num must be an integer from 1 to 3999, else RangeError.
 *   - fromRoman(roman): roman must be in standard form, else Error.
 *     Non-standard forms are rejected: "IIII", "VV", "IL", "IC", "XM", "MMMM", "".
 *
 * Remarks - cases NOT supported:
 *   - Numbers bigger than 3999 (vinculum / overline, for example V̅ = 5000).
 *   - Zero and negative numbers ("N" for nulla is not supported).
 *   - Additive forms used in history or on clocks ("IIII" = 4, "VIIII" = 9).
 *   - Irregular subtractive forms ("IIX" = 8, "IC" = 99, "IIC" = 98).
 *   - Lowercase input ("xiv"). Only uppercase is accepted.
 *   - Whitespace is not trimmed (" XIV" is invalid).
 *   - Unicode Roman numeral characters ("Ⅻ" U+216B).
 *   - Fractions (S = 1/2, dots for 1/12).
 */

// Ordered from highest to lowest, including the 6 subtractive forms.
const ROMAN_TABLE: readonly (readonly [string, number])[] = [
  ["M", 1000],
  ["CM", 900],
  ["D", 500],
  ["CD", 400],
  ["C", 100],
  ["XC", 90],
  ["L", 50],
  ["XL", 40],
  ["X", 10],
  ["IX", 9],
  ["V", 5],
  ["IV", 4],
  ["I", 1],
]

const SYMBOL_VALUE: Readonly<Record<string, number>> = {
  I: 1,
  V: 5,
  X: 10,
  L: 50,
  C: 100,
  D: 500,
  M: 1000,
}

const MIN_VALUE = 1
const MAX_VALUE = 3999

export function toRoman(num: number): string {
  if (!Number.isInteger(num) || num < MIN_VALUE || num > MAX_VALUE) {
    throw new RangeError(`Number must be an integer from ${MIN_VALUE} to ${MAX_VALUE}: ${num}`)
  }

  let rest = num
  let result = ""
  // Greedy: use the biggest symbol that fits, then repeat with the rest.
  for (const [symbol, value] of ROMAN_TABLE) {
    while (rest >= value) {
      result += symbol
      rest -= value
    }
  }
  return result
}

export function fromRoman(roman: string): number {
  let total = 0
  for (let i = 0; i < roman.length; i++) {
    const current = SYMBOL_VALUE[roman.charAt(i)]
    if (current === undefined) {
      throw new Error(`Invalid Roman numeral character "${roman.charAt(i)}" in "${roman}"`)
    }
    const next = SYMBOL_VALUE[roman.charAt(i + 1)] ?? 0
    // A smaller symbol before a bigger symbol is subtracted (IV = 5 - 1).
    total += current < next ? -current : current
  }

  // Standard form check: each number from 1 to 3999 has exactly one standard form.
  // If converting the total back does not give the same string, the input is
  // not in standard form (for example "IIII", "IL", "VX") or it is empty.
  if (total < MIN_VALUE || total > MAX_VALUE || toRoman(total) !== roman) {
    throw new Error(`Not a standard form Roman numeral: "${roman}"`)
  }
  return total
}

console.log(toRoman(1994))
// MCMXCIV
console.log(fromRoman("MMXXVI"))
// 2026
// or bash node --test romanNumerals.test.ts for test spec
