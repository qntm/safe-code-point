'use strict'

// Returns an array of code points
// e.g. "0000" becomes `[0]`
// e.g. "0000..000A" becomes `[0, ..., 10]`
module.exports = str => {
  const components = str.split('..')
  if (components.length !== 1 && components.length !== 2) {
    throw new Error('Could not dehex this string')
  }
  const lower = parseInt(components[0], 16)
  const upper = components.length === 2 ? parseInt(components[1], 16) : lower
  const codePoints = []
  for (let codePoint = lower; codePoint <= upper; codePoint++) {
    codePoints.push(codePoint)
  }
  return codePoints
}
