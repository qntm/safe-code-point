import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import ccc from './canonical-combining-class.js'

describe('canonical-combining-class', () => {
  it('impossible error', () => {
    assert.throws(() => ccc([
      ['0000..000A', 7],
      ['0009..000F', 8]
    ]), Error('9'))
  })
})
