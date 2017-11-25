'use strict'

// UCD normalization property resources.

const path = require('path')

const ucd = require('./ucd.js')
const dehex = require('./dehex.js')

const byCodePoint = {}
const versions = ['8.0', '9.0', '10.0']
versions.forEach(version => {
  const data = ucd.readFileSync(path.join(__dirname, '/../UCD/', version, 'EastAsianWidth.txt'))

  byCodePoint[version] = {}

  // Defaults
  for (let codePoint = 0; codePoint < (1 << 20) + (1 << 16); codePoint++) {
    byCodePoint[version][codePoint] = undefined // unknown
  }

  data.forEach(function (row) {
    const codePoints = dehex(row[0])
    const eastAsianWidth = row[1] // "A", "F", "H", "N", "Na" or "W"

    codePoints.forEach(function (codePoint) {
      byCodePoint[version][codePoint] = eastAsianWidth
    })
  })
})

/** Get property value for a specific code point, or default if set */
module.exports = function (codePoint, version) {
  if (!(version in byCodePoint)) {
    throw new Error('Unicode version ' + version + ' not recognised')
  }
  const value = byCodePoint[version][codePoint]
  if (value === undefined) {
    throw new Error('Code point has no East_Asian_Width specified: ' + value)
  }
  return value
}
