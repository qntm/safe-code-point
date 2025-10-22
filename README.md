# safe-code-point

Package for determining whether the supplied code point is ["safe"](https://qntm.org/safe). This module (well, code very much like it) was used to generate code points for [Base65536](https://github.com/qntm/base65536), [Base32768](https://github.com/qntm/base32768) and [Base2048](https://github.com/qntm/base2048).

This package supports ES modules only.

## Example

```js
import SafeCodePoint from 'safe-code-point'

const safeCodePoint = await SafeCodePoint('17.0.0')
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

### SafeCodePoint(version, options)

Returns a promise which resolves to a `safeCodePoint` function for the supplied version of Unicode.

Data is fetched from [the Unicode website](http://www.unicode.org/Public) at run time. At the time of writing, supported version strings are a subset of those seen in that directory: `'4.1.0'` to `'17.0.0'`. (Earlier versions do not provide the data in the same consumable structure.)

#### options

An optional object with the keys acting as additional options. The options are as follows:
- **`safeCategories`**: An object that determines whether a codepoint category is safe or not. The keys are the category, and the value is `true` if it is safe, and anything else if it is not safe. If not passed, the default parameters are shown in the example below.

Example:
```js
const safeCodePoint = await SafeCodePoint('17.0.0', {
  safeCategories: {
    Ll: true, // Letter, Lowercase
    Lm: true, // Letter, Modifier
    Lo: true, // Letter, Other
    Lt: true, // Letter, Titlecase
    Lu: true, // Letter, Uppercase
    Me: false, // Mark, Enclosing
    Mn: false, // Mark, Nonspacing
    Mc: false, // Mark, Spacing Combining
    Nd: true, // Number, Decimal Digit
    Nl: true, // Number, Letter
    No: true, // Number, Other
    Cc: false, // Other, Control
    Cf: false, // Other, Format
    Cn: false, // Other, Not Assigned (no characters in the file have this property)
    Co: false, // Other, Private Use
    Cs: false, // Other, Surrogate
    Pe: false, // Punctuation, Close
    Pc: false, // Punctuation, Connector
    Pd: false, // Punctuation, Dash
    Pf: false, // Punctuation, Final quote (may behave like Ps or Pe depending on usage)
    Pi: false, // Punctuation, Initial quote (may behave like Ps or Pe depending on usage)
    Ps: false, // Punctuation, Open
    Po: false, // Punctuation, Other
    Zl: false, // Separator, Line
    Zp: false, // Separator, Paragraph
    Zs: false, // Separator, Space
    Sc: true, // Symbol, Currency
    Sm: true, // Symbol, Math
    Sk: true, // Symbol, Modifier
    So: true // Symbol, Other
  }
})
```

### safeCodePoint(codePoint)

Returns a Boolean indicating whether the supplied code point is safe (is not a member of any unsafe Unicode General Categories, has a canonical combining class of 0 and survives all forms of normalization). `codePoint` should be an integer from `0` to `1114111` inclusive.

### safeCodePoint.generalCategory(codepoint)

Returns the Unicode General Category of the supplied code point as a two-character string, *e.g.* `"Lo"` for "Letter, other".

### safeCodePoint.wordBreak(codepoint)

Returns the [Word_Break property](https://unicode.org/reports/tr29/#Table_Word_Break_Property_Values) value of the supplied code point, *e.g.* `'Numeric'`, `'ALetter'` or (in most cases) `undefined`.
