'use strict'

// This module reads in most kinds of Unicode Character Data set text files.
// Comments (marked with a #) are stripped, empty lines are removed. The
// remaining lines are divided up into fields on the semicolon delimiter, and
// the fields have whitespace trimmed.

const nodeFetch = require('node-fetch')

module.exports.get = (version, name) => {
  const url = `http://www.unicode.org/Public/${version}/ucd/${name}`
  return nodeFetch(url)
    .then(res => {
      if (!res.ok) {
        throw Error(`${res.status} while fetching ${url}`)
      }
      return res.text()
    })
    .then(body => {
      return body
        .split(/\r?\n/)
        .map(line => line.replace(/^(.*?)(?:#.*)?$/, '$1'))
        .filter(line => line !== '')
        .map(line => line.split(';').map(field => field.trim()))
    })
}
