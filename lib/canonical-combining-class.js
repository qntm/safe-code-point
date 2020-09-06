'use strict'

// UCD Canonical_Combining_Class resources.

const path = require('path')

const ucd = require('./ucd.js')
const dehex = require('./dehex.js')

/** Get CCC for a specific code point */
module.exports = function (codePoint, version) {
  const data = ucd.readFileSync(path.join(__dirname, '/../UCD/', version, 'extracted/DerivedCombiningClass.txt'))

  const byCodePoint = {}

  // Defaults
  const defaultCcc = 0
  for (let codePoint = 0; codePoint < (1 << 20) + (1 << 16); codePoint++) {
    byCodePoint[codePoint] = defaultCcc
  }

  data.forEach(function (row) {
    const codePoints = dehex(row[0])
    const ccc = Number(row[1])

    codePoints.forEach(function (codePoint) {
      if (codePoint in byCodePoint && byCodePoint[codePoint] !== defaultCcc) {
        throw new Error(codePoint)
      }
      byCodePoint[codePoint] = ccc
    })
  })

  if (!(codePoint in byCodePoint)) {
    throw new Error('Canonical_Combining_Class unknown for ' + String(codePoint))
  }
  return byCodePoint[codePoint]
}
