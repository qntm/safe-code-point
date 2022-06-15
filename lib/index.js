/**
  Ascertain whether a Unicode code point is "safe" for use in a binary encoding.
*/

import * as ucd from './ucd.js'
import canonicalCombiningClass from './canonical-combining-class.js'
import eastAsianWidth from './east-asian-width.js'
import generalCategory from './general-category.js'
import normalizationProperties from './normalization-properties.js'
import wordBreak from './word-break.js'

const quickChecks = [
  'NFD_QC', // canonical decomposition
  'NFC_QC', // canonical decomposition + canonical composition
  'NFKD_QC', // compatibility decomposition
  'NFKC_QC' // compatibility decomposition + canonical composition
]

// General Categories CONSIDERED SAFE
const gcIsSafe = {
  Ll: true, // Letter, Lowercase
  Lm: true, // Letter, Modifier
  Lo: true, // Letter, Other
  Lt: true, // Letter, Titlecase
  Lu: true, // Letter, Uppercase
  Me: false, // Mark, Enclosing
  Mn: false, // Mark, Nonspacing
  Mc: false, // Mark, Spacing Combining
  Nd: true, // Number, Decimal Digit
  Nl: true, // Number, Letter
  No: true, // Number, Other
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
  Sc: true, // Symbol, Currency
  Sm: true, // Symbol, Math
  Sk: true, // Symbol, Modifier
  So: true // Symbol, Other
}

export default async version => {
  // First load up a bunch of data
  const cccData = await ucd.get(version, 'extracted/DerivedCombiningClass.txt')
  const eawData = await ucd.get(version, 'EastAsianWidth.txt')
  const gcData = await ucd.get(version, 'extracted/DerivedGeneralCategory.txt')
  const npData = await ucd.get(version, 'DerivedNormalizationProps.txt')
  const wbpData = await ucd.get(version, 'auxiliary/WordBreakProperty.txt')

  const ccc = canonicalCombiningClass(cccData)
  const eaw = eastAsianWidth(eawData)
  const gc = generalCategory(gcData)
  const np = normalizationProperties(npData)
  const wb = wordBreak(wbpData)

  const safeCodePoint = codePoint => {
    const passesQuickChecks = quickChecks.every(property =>
      np(codePoint, property) === 'Y'
    )
    const inSafeGc = gcIsSafe[gc(codePoint)] === true
    const hasCcc0 = ccc(codePoint) === 0

    return passesQuickChecks && inSafeGc && hasCcc0
  }

  safeCodePoint.canonicalCombiningClass = ccc
  safeCodePoint.eastAsianWidth = eaw
  safeCodePoint.generalCategory = gc
  safeCodePoint.normalizationProperties = np
  safeCodePoint.wordBreak = wb

  return safeCodePoint
}
