import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import gc from './general-category.js'

describe('general-category', () => {
  it('impossible error', () => {
    assert.throws(() => gc([
      ['0000..000A', 7],
      ['0009..000F', 8]
    ]), Error('9'))
  })
})
