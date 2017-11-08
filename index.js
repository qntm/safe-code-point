'use strict'

/**
  Ascertain whether a Unicode code point is "safe" for use in a binary encoding.
*/

const canonicalCombiningClass = require('./lib/canonical-combining-class.js')
const generalCategory = require('./lib/general-category.js')
const normalizationProperties = require('./lib/normalization-properties.js')

const quickChecks = [
  'NFD_QC', // canonical decomposition
  'NFC_QC', // canonical decomposition + canonical composition
  'NFKD_QC', // compatibility decomposition
  'NFKC_QC' // compatibility decomposition + canonical composition
]

// General Categories CONSIDERED SAFE
const gcIsSafe = {
  Ll: true,  // Letter, Lowercase
  Lm: true,  // Letter, Modifier
  Lo: true,  // Letter, Other
  Lt: true,  // Letter, Titlecase
  Lu: true,  // Letter, Uppercase
  Me: false, // Mark, Enclosing
  Mn: false, // Mark, Nonspacing
  Mc: false, // Mark, Spacing Combining
  Nd: true,  // Number, Decimal Digit
  Nl: true,  // Number, Letter
  No: true,  // Number, Other
  Cc: false, // Other, Control
  Cf: false, // Other, Format
  Cn: false, // Other, Not Assigned (no characters in the file have this property)
  Co: false, // Other, Private Use
  Cs: false, // Other, Surrogate
  Pe: false, // Punctuation, Close
  Pc: false, // Punctuation, Connector
  Pd: false, // Punctuation, Dash
  Pf: false, // Punctuation, Final quote (may behave like Ps or Pe depending on usage)
  Pi: false, // Punctuation, Initial quote (may behave like Ps or Pe depending on usage)
  Ps: false, // Punctuation, Open
  Po: false, // Punctuation, Other
  Zl: false, // Separator, Line
  Zp: false, // Separator, Paragraph
  Zs: false, // Separator, Space
  Sc: true,  // Symbol, Currency
  Sm: true,  // Symbol, Math
  Sk: true,  // Symbol, Modifier
  So: true   // Symbol, Other
}

module.exports = function (codePoint, version = '10.0') {
  const passesQuickChecks = quickChecks.every(property =>
    normalizationProperties(codePoint, property, version) === 'Y'
  )
  const inSafeGc = gcIsSafe[generalCategory(codePoint, version)] === true
  const hasCcc0 = canonicalCombiningClass(codePoint, version) === 0

  return passesQuickChecks && inSafeGc && hasCcc0
}

module.exports.generalCategory = generalCategory
