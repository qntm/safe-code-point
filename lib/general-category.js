'use strict'

/** UCD General_Category resources. */

const path = require('path')

const ucd = require('./ucd.js')
const dehex = require('./dehex.js')
const supportedVersions = require('./supported-versions.js')

const byCodePoint = {}
supportedVersions.forEach(version => {
  const data = ucd.readFileSync(path.join(__dirname, '/../UCD/', version, 'extracted/DerivedGeneralCategory.txt'))

  byCodePoint[version] = {}

  data.forEach(function (row) {
    const codePoints = dehex(row[0])
    const gc = row[1] // E.g. "Lo", "Po"

    codePoints.forEach(function (codePoint) {
      if (codePoint in byCodePoint[version]) {
        throw new Error(codePoint)
      }
      byCodePoint[version][codePoint] = gc
    })
  })
})

/** Get GC for a specific code point */
module.exports = function (codePoint, version) {
  if (!(version in byCodePoint)) {
    throw new Error('Unicode version ' + version + ' not recognised')
  }
  if (!(codePoint in byCodePoint[version])) {
    throw new Error('General_Category unknown for ' + String(codePoint))
  }
  return byCodePoint[version][codePoint]
}
