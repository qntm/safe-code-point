# CHANGELOG

## 2.x.x

The API of `safe-code-point` has completely changed to asynchronously look up Unicode code point data. Code like:

```js
const safeCodePoint = require('safe-code-point')

const a = safeCodePoint(codePoint, '11.0')
const b = safeCodePoint.generalCategory(codePoint, '11.0')
```

should change to something like:

```js
const SafeCodePoint = require('safe-code-point')

SafeCodePoint('11.0.0').then(safeCodePoint => {
  const a = safeCodePoint(codePoint)
  const b = safeCodePoint.generalCategory(codePoint)
})
```

`safeCodePoint.supportedVersions` has been removed.

## 1.x.x

Initial release.
