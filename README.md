# safe-code-point

Module for determining whether the supplied code point is ["safe"](https://qntm.org/safe). This module (well, code very much like it) was used to generate code points for [Base65536](https://github.com/qntm/base65536), [Base32768](https://github.com/qntm/base32768) and [Base2048](https://github.com/qntm/base2048).

## Example

```js
'use strict'

const SafeCodePoint = require('safe-code-point')
const safeCodePoint = SafeCodePoint('12.0')

const numCodePoints = (1 << 16) + (1 << 20)

let numSafeCodePoints = 0
for (let codePoint = 0; codePoint < numCodePoints; codePoint++) {
  if (safeCodePoint(codePoint)) {
    numSafeCodePoints++
  }
}

console.log(numSafeCodePoints)
```

## API

### SafeCodePoint(version)

Returns a `safeCodePoint` function for the supplied version of Unicode. At the time of writing, the `version`s supported are `'7.0'`, `'8.0'`, `'9.0'`, `'10.0'`, `'11.0'` and `'12.0'`.

### safeCodePoint(codePoint)

Returns a Boolean indicating whether the supplied code point is safe (is not a member of any unsafe Unicode General Categories, has a canonical combining class of 0 and survives all forms of normalization). `codePoint` should be an integer from `0` to `1114111` inclusive.

### safeCodePoint.generalCategory(codepoint)

Returns the Unicode General Category of the supplied code point as a two-character string, e.g. `"Lo"` for "Letter, other".

## Licence

This code is MIT-licenced, however the bundled UCD files are subject to [separate terms of use](http://www.unicode.org/copyright.html).
