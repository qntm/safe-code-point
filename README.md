# safe-code-point

Module for determining whether the supplied code point is ["safe"](https://qntm.org/safe). This module (well, code very much like it) was used to generate code points for [Base65536](https://github.com/qntm/base65536), [Base32768](https://github.com/qntm/base32768) and [Base2048](https://github.com/qntm/base2048).

## Example

```js
'use strict'

const safeCodePoint = require('./index.js')

const numCodePoints = (1 << 16) + (1 << 20)

safeCodePoint.supportedVersions.forEach(version => {
  let safe = 0
  for (let codePoint = 0; codePoint < numCodePoints; codePoint++) {
    if (safeCodePoint(codePoint, version)) {
      safe++
    }
  }
  console.log(version, safe)
})
```

## API

### safeCodePoint(codePoint[, version = '12.0'])

Returns a Boolean indicating whether the supplied code point is safe (is not a member of any unsafe Unicode General Categories, has a canonical combining class of 0 and survives all forms of normalization). `codePoint` should be an integer from `0` to `1114111` inclusive. `version` should be a string from `supportedVersions`.

### safeCodePoint.supportedVersions

An array of version strings. At the time of writing, the values supported are `'7.0'`, `'8.0'`, `'9.0'`, `'10.0'`, `'11.0'` and `'12.0'`.

### safeCodePoint.generalCategory(codepoint[, version = '12.0'])

Returns the Unicode General Category of the supplied code point as a two-character string, e.g. `"Lo"` for "Letter, other".

## Licence

This code is MIT-licenced, however the bundled UCD files are subject to [separate terms of use](http://www.unicode.org/copyright.html).
