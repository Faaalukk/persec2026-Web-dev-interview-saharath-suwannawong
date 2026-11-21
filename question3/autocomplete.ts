/**
 * Return items that contain `search` (ignore case), sorted by match position,
 * and limited to `maxResult` items.
 *
 * Priority (search = "th"):
 *   1. START  - item starts with search          "Think"
 *   2. MIDDLE - search is inside the item        "Mother"
 *   3. END    - item ends with search            "Math"
 *
 * Rules:
 *   - Only the first occurrence of search decides the priority.
 *     "Thoth" starts with "th", so it is START (not END).
 *   - Items with the same priority keep their input order (stable sort).
 *   - An item equal to search ("th" vs "TH") is START.
 *   - Return the items with their original letter case.
 *   - Empty search or maxResult <= 0 returns [].
 *
 * Remarks - cases NOT supported:
 *   - Word boundary in phrases: "New York" with search "york" is END
 *     of the whole string. Each word is not checked separately.
 *   - Locale-specific case rules (for example Turkish "İ" / "i").
 *   - Accent-insensitive match: "é" does not match "e".
 *   - Whitespace in search or items is not trimmed.
 *   - Tie-break inside the same priority by match position, length
 *     or alphabetical order. Input order is used instead.
 *   - Fuzzy match or typo tolerance ("thnik" does not match "think").
 *   - Duplicates are kept (no dedupe).
 *   - null / undefined parameters are not validated.
 *   - Non-integer maxResult is truncated by Array.prototype.slice (2.9 -> 2).
 */

// Plain object instead of `enum`, because Node type stripping does not support enum.
const PRIORITY = {
  START: 1,
  MIDDLE: 2,
  END: 3,
} as const

type Priority = (typeof PRIORITY)[keyof typeof PRIORITY]

function getPriority(index: number, itemLength: number, searchLength: number): Priority {
  if (index === 0) return PRIORITY.START
  if (index + searchLength === itemLength) return PRIORITY.END
  return PRIORITY.MIDDLE
}

export function autocomplete(search: string, items: string[], maxResult: number): string[] {
  if (search === "" || maxResult <= 0) {
    return []
  }

  const keyword = search.toLowerCase()

  const matches: { item: string; priority: Priority }[] = []
  for (const item of items) {
    const index = item.toLowerCase().indexOf(keyword)
    if (index === -1) continue
    matches.push({ item, priority: getPriority(index, item.length, keyword.length) })
  }

  // Array.prototype.sort is stable (ES2019+), so the same priority keeps input order.
  matches.sort((a, b) => a.priority - b.priority)

  return matches.slice(0, maxResult).map((match) => match.item)
}

console.log(autocomplete("th", ["Mother", "Think", "Worthy", "Apple", "Android"], 2))
// [ 'Think', 'Mother' ]
// or bash node --test autocomplete.test.ts for test spec
