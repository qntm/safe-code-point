'use strict'

// UCD normalization property resources.

const dehex = require('./dehex.js')

/** Get property value for a specific code point, or default if set */
module.exports = data => {
  const byCodePoint = {}

  // Defaults
  for (let codePoint = 0; codePoint < (1 << 20) + (1 << 16); codePoint++) {
    byCodePoint[codePoint] = {
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
      byCodePoint[codePoint][property] = value
    })
  })

  return (codePoint, property) => {
    const properties = byCodePoint[codePoint]
    if (properties === undefined) {
      throw new Error('Unrecognised code point: ' + String(codePoint))
    }
    const value = properties[property]
    if (value === undefined) {
      throw new Error('Unrecognised property: ' + property)
    }
    return value
  }
}
