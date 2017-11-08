'use strict'

// UCD Canonical_Combining_Class resources.

const path = require('path')

const ucd = require('./ucd.js')
const dehex = require('./dehex.js')

const byCodePoint = {}
const versions = ['8.0', '9.0', '10.0']
versions.forEach(version => {
  const data = ucd.readFileSync(path.join(__dirname, '/../UCD/', version, 'extracted/DerivedCombiningClass.txt'))

  byCodePoint[version] = {}

  // Defaults
  const defaultCcc = 0
  for (let codePoint = 0; codePoint < (1 << 20) + (1 << 16); codePoint++) {
    byCodePoint[version][codePoint] = defaultCcc
  }

  data.forEach(function (row) {
    const codePoints = dehex(row[0])
    const ccc = Number(row[1])

    codePoints.forEach(function (codePoint) {
      if (codePoint in byCodePoint[version] && byCodePoint[version][codePoint] !== defaultCcc) {
        throw new Error(codePoint)
      }
      byCodePoint[version][codePoint] = ccc
    })
  })
})

/** Get CCC for a specific code point */
module.exports = function (codePoint, version) {
  if (!(version in byCodePoint)) {
    throw new Error('Unicode version ' + version + ' not recognised')
  }
  if (!(codePoint in byCodePoint[version])) {
    throw new Error('Canonical_Combining_Class unknown for ' + String(codePoint))
  }
  return byCodePoint[version][codePoint]
}
