'use strict'

// UCD normalization property resources.

const path = require('path')

const ucd = require('./ucd.js')
const dehex = require('./dehex.js')
const supportedVersions = require('./supported-versions.js')

const byCodePoint = {}
supportedVersions.forEach(version => {
  const data = ucd.readFileSync(path.join(__dirname, '/../UCD/', version, 'DerivedNormalizationProps.txt'))

  byCodePoint[version] = {}

  // Defaults
  for (let codePoint = 0; codePoint < (1 << 20) + (1 << 16); codePoint++) {
    byCodePoint[version][codePoint] = {
      NFD_QC: 'Y',
      NFC_QC: 'Y',
      NFKD_QC: 'Y',
      NFKC_QC: 'Y'
    }
  }

  data.forEach(function (row) {
    const codePoints = dehex(row[0])
    const property = row[1] // E.g. "NFD_QC"
    const value = row[2] // E.g. "N"

    codePoints.forEach(function (codePoint) {
      byCodePoint[version][codePoint][property] = value
    })
  })
})

/** Get property value for a specific code point, or default if set */
module.exports = function (codePoint, property, version) {
  if (!(version in byCodePoint)) {
    throw new Error('Unicode version ' + version + ' not recognised')
  }
  const properties = byCodePoint[version][codePoint]
  if (properties === undefined) {
    throw new Error('Unrecognised code point: ' + String(codePoint))
  }
  const value = properties[property]
  if (value === undefined) {
    throw new Error('Unrecognised property: ' + property)
  }
  return value
}
