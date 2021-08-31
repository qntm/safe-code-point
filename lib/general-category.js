/** UCD General_Category resources. */

import dehex from './dehex.js'

/** Get GC for a specific code point */
export default data => {
  const byCodePoint = {}

  data.forEach(function (row) {
    const codePoints = dehex(row[0])
    const gc = row[1] // E.g. "Lo", "Po"

    codePoints.forEach(function (codePoint) {
      if (codePoint in byCodePoint) {
        throw new Error(codePoint)
      }
      byCodePoint[codePoint] = gc
    })
  })

  return codePoint => {
    if (!(codePoint in byCodePoint)) {
      throw new Error('General_Category unknown for ' + String(codePoint))
    }
    return byCodePoint[codePoint]
  }
}
