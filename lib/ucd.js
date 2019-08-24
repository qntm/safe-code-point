'use strict'

// This module reads in most kinds of Unicode Character Data set text files.
// Comments (marked with a #) are stripped, empty lines are removed. The
// remaining lines are divided up into fields on the semicolon delimiter, and
// the fields have whitespace trimmed.

var fs = require('fs')

module.exports.readFileSync = name => fs
  .readFileSync(name, { encoding: 'utf8' })
  .split(/\r?\n/)
  .map(line => line.replace(/^(.*?)(?:#.*)?$/, '$1'))
  .filter(line => line !== '')
  .map(line => line.split(';').map(field => field.trim()))
