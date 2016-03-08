# type

  Type assertions aka less-broken `typeof`.

## API

```js
var type = require('type')
type(new Date) // => 'date'
type({}) // => 'object'
type(null) // => 'null'
type(undefined) // => 'undefined'
type("hey") // => 'string'
type(true) // => 'boolean'
type(false) // => 'boolean'
type(12) // => 'number'
type(type) // => 'function'
type(/asdf/) // => 'regexp'
type((function(){ return arguments })()) // => 'arguments'
type([]) // => 'array'
type(new Uint8Array) // => 'bit-array'
type(document.createElement('div')) // => 'element'
```
