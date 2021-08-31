/** UCD Word_Break resources. */

import dehex from './dehex.js'

/** Get Word_Break for a specific code point */
export default data => {
  const byCodePoint = {}

  // Defaults
  for (let codePoint = 0; codePoint < (1 << 20) + (1 << 16); codePoint++) {
    byCodePoint[codePoint] = undefined
  }

  data.forEach(function (row) {
    const codePoints = dehex(row[0])
    const wbp = row[1] // E.g. "Numeric", "ALetter"

    codePoints.forEach(function (codePoint) {
      if (codePoint in byCodePoint && byCodePoint[codePoint] !== undefined) {
        throw new Error(codePoint)
      }
      byCodePoint[codePoint] = wbp
    })
  })

  return codePoint => {
    if (!(codePoint in byCodePoint)) {
      throw new Error('Word_Break unknown for ' + String(codePoint))
    }
    return byCodePoint[codePoint]
  }
}
