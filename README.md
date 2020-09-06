# safe-code-point

Module for determining whether the supplied code point is ["safe"](https://qntm.org/safe). This module (well, code very much like it) was used to generate code points for [Base65536](https://github.com/qntm/base65536), [Base32768](https://github.com/qntm/base32768) and [Base2048](https://github.com/qntm/base2048).

## Example

```js
'use strict'

const SafeCodePoint = require('safe-code-point')

SafeCodePoint('12.0.0').then(safeCodePoint => {
  const numCodePoints = (1 << 16) + (1 << 20)

  let numSafeCodePoints = 0
  for (let codePoint = 0; codePoint < numCodePoints; codePoint++) {
    if (safeCodePoint(codePoint)) {
      numSafeCodePoints++
    }
  }

  console.log(numSafeCodePoints)
})
```

## API

### SafeCodePoint(version)

Returns a promise which resolves to a `safeCodePoint` function for the supplied version of Unicode.

Data is fetched from [the Unicode website](http://www.unicode.org/Public) at run time. At the time of writing, supported version strings are a subset of those seen in that directory: `'4.1.0'` to `'13.0.0'`. (Earlier versions do not provide the data in the same consumable structure, and Unicode 14.0.0 is a work in progress.)

### safeCodePoint(codePoint)

Returns a Boolean indicating whether the supplied code point is safe (is not a member of any unsafe Unicode General Categories, has a canonical combining class of 0 and survives all forms of normalization). `codePoint` should be an integer from `0` to `1114111` inclusive.

### safeCodePoint.generalCategory(codepoint)

Returns the Unicode General Category of the supplied code point as a two-character string, e.g. `"Lo"` for "Letter, other".

