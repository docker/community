# result-core

JavaScript doesn't allow you to spawn new threads. Nore does it allow you to park a thread programmatically. Instead it uses an "event loop", which functions as a sort of work queue. It allows you to request an operation and register a function to be called when its completed. This function is called a "callback" and it provides all the synchronization we need to compose computations however it leaves our control flow model FUBAR. Normally we think of values and errors as propagating up and down an implicit call stack. When a child computation completes it is returned to its parent frame where it can be passed into other computation frames or simply ignored and allowed to propagate up the stack. Meanwhile, in the "event loop" model values/errors are passed in to the callbacks as arguments which means both that they never become available in the parent context and that they can't just be allowed to propagate. Also without callstack's our error objects are mostly garbage.

Results are an attempt to re-build the call stack conceptual model back on top of the "event loop" model. The approach they take is to ask you to reify your asynchronous function calls with a Result instance. The intention of these is to model stack frames, in that they will eventually be either a successfully computed value or an error. Because these Result instances are runtime objects you can compose them together to recreate the computation tree that is normally implicit and maintained underneath the runtime.

This implementation does nothing to improve the stack traces of your errors but that feature could be added.

## Installation

`npm install result-core`

then in your app:

```js
import Result from 'result-core'
```

## API

### Result(state::String, value::Any)

A class for creating concrete representations of function calls.

`state` can be one of:

- `"pending"`
- `"done"`
- `"fail"`

All Results start of in a "pending" state and will transition either to "done" or "fail".

```js
new Result('pending').state // => 'pending'
```

### Result.value

The value of the Result. If the Result has a state of "fail" then this value is an error. If its "pending" then reading its value is useless. You should use the read method unless you know what your doing and are handling each of the 3 possible states correctly.

```js
function add(a, b){
  var result = new Result('pending')
  result.write(a + b)
  return result
}

add(1, 2).value // => 3
```

### Result#write(value)

give the Result its value and change its state to "done"

```js
var one = new Result('pending').write(1)
one.state // => 'done'
one.value // => 1
```

### Result#error(reason)

  give the Result its error and change its state to "fail"

```js
var err = new Error('coz oops')
var two = new Result('pending').error(err)
two.state // => 'fail'
two.value // => err
```

### Result#read([onValue], [onError])

  access the result of `this`

```js
one.read(n => n /* n = 1 */) // error handlers are optional
two.read(
  null,  // value handlers are also optional
  e => e // => err
)
```
