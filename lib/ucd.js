// This module reads in most kinds of Unicode Character Data set text files.
// Comments (marked with a #) are stripped, empty lines are removed. The
// remaining lines are divided up into fields on the semicolon delimiter, and
// the fields have whitespace trimmed.

import nodeFetch from 'node-fetch'

export const get = async (version, name) => {
  const url = `http://www.unicode.org/Public/${version}/ucd/${name}`
  const res = await nodeFetch(url)
  if (!res.ok) {
    throw Error(`${res.status} while fetching ${url}`)
  }
  const body = await res.text()
  return body
    .split(/\r?\n/)
    .map(line => line.replace(/^(.*?)(?:#.*)?$/, '$1'))
    .filter(line => line !== '')
    .map(line => line.split(';').map(field => field.trim()))
}
