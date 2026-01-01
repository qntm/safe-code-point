import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import wordBreak from './word-break.js'

describe('word-break', () => {
  it('impossible error', () => {
    assert.throws(() => wordBreak([
      ['0000..000A', 7],
      ['0009..000F', 8]
    ]), Error('9'))
  })
})
