'use strict'

// UCD normalization property resources.

const dehex = require('./dehex.js')

/** Get property value for a specific code point, or default if set */
module.exports = data => {
  const byCodePoint = {}

  // Defaults
  for (let codePoint = 0; codePoint < (1 << 20) + (1 << 16); codePoint++) {
    byCodePoint[codePoint] = undefined // unknown
  }

  data.forEach(function (row) {
    const codePoints = dehex(row[0])
    const eastAsianWidth = row[1] // "A", "F", "H", "N", "Na" or "W"

    codePoints.forEach(function (codePoint) {
      byCodePoint[codePoint] = eastAsianWidth
    })
  })

  return codePoint => {
    const value = byCodePoint[codePoint]
    if (value === undefined) {
      throw new Error('Code point has no East_Asian_Width specified: ' + value)
    }
    return value
  }
}
