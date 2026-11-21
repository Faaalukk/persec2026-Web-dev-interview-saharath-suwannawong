/**
 * Sort codes in the format [prefix][number][suffix]
 * e.g. "TH19", "SG20", "TH3Netflix"
 *
 * Rules:
 *   1. prefix  -> alphabetical order        ("SG" < "TH")
 *   2. number  -> numeric order             (2 < 10 < 19)
 *   3. suffix  -> alphabetical order, tie-breaker only ("" < "Amazon" < "Netflix")
 *
 * Remarks - cases NOT supported (results may not match expectations):
 *   - Case-insensitive compare: "th2" vs "TH10" is compared by char code,
 *     so every uppercase prefix comes before every lowercase prefix.
 *   - Leading zeros tie-break: "TH02", "TH2", "TH002" have the same number,
 *     so they keep their original input order (no special rule).
 *   - Strings without prefix or without number ("123", "TH", "1TH", ""):
 *     moved to the end of the result, sorted by plain string compare.
 *   - Multiple number segments in suffix: "TH3Netflix10" vs "TH3Netflix2"
 *     suffix is compared as plain string, so "Netflix10" < "Netflix2".
 *   - Numbers larger than Number.MAX_SAFE_INTEGER lose precision.
 *   - Whitespace is not trimmed ("TH 2" is treated as invalid format).
 *   - null / undefined items are not validated.
 *   - Non-ASCII prefix (Thai, accented letters) is not matched by the regex.
 *   - Descending order is not supported.
 *   - Duplicates are kept (no dedupe).
 */

interface CodeKey {
  prefix: string
  number: number
  suffix: string
}

const CODE_PATTERN = /^([A-Za-z]+)(\d+)(.*)$/

function parseCode(s: string): CodeKey | null {
  const match = s.match(CODE_PATTERN)
  if (!match) {
    return null
  }
  return { prefix: match[1], number: Number(match[2]), suffix: match[3] }
}

function compareText(a: string, b: string): number {
  if (a < b) return -1
  if (a > b) return 1
  return 0
}

export function sortCodes(input: string[]): string[] {
  // Parse each item once, then sort by the parsed key.
  const items = input.map((value) => ({ value, key: parseCode(value) }))

  items.sort((a, b) => {
    // Invalid format goes to the end.
    if (!a.key || !b.key) {
      if (!a.key && !b.key) return compareText(a.value, b.value)
      return a.key ? -1 : 1
    }

    const byPrefix = compareText(a.key.prefix, b.key.prefix)
    if (byPrefix !== 0) return byPrefix

    const byNumber = a.key.number - b.key.number
    if (byNumber !== 0) return byNumber

    return compareText(a.key.suffix, b.key.suffix)
  })

  // Return a new array, the input is not changed.
  return items.map((item) => item.value)
}

console.log(sortCodes(["TH19", "SG20", "TH2"]))
// [ 'SG20', 'TH2', 'TH19' ]
console.log(sortCodes(["TH10", "TH3Netflix", "TH1", "TH7"]))
// [ 'TH1', 'TH3Netflix', 'TH7', 'TH10' ]
// or bash node --test sortString.test.ts for test spec