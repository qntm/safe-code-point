import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import dehex from './dehex.js'

describe('dehex', () => {
  it('failures', () => {
    assert.throws(() => dehex('0000..000A..000C'), Error('Could not dehex this string'))
  })
})
