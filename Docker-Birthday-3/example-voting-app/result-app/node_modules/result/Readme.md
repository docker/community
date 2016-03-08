
# result

Reify your function's result. In JavaScript (JS) function calls result in the creation of a stack frame behind the scenes. This contains the state of the function as its code is being processed. On completion the stack frame is popped of the stack and a value is effectively substituted into the place where the function was originally called. You can say the result travels back up the stack which usually maps to traveling backwards through your source code. However functions aren't always given correct input and therefore can't always return correct values. To handle this we `throw` values instead of `return`ing them (usually that "value" is an `Error` instance). The JS engine handles `throw` in a similar way to `return`, that is, it walks the value back up the stack. However, while its walking back up its not looking for normal code its looking for code you have explicitly declared to be for the purpose of handling errors. In JS that means a kind of goofy `try catch` arrangement. When it finds this special error handling code it substitutes in the "value" as it would if we were `return`ing and then carries on as per usual. If it never manages to find any error handling code it logs the "value" to the console and kills the process. So we can say that whenever we code in JS we are coding for two paths, the success path and the error path. The JS engine passes values up and down these paths implicitly. That is we don't explicitly tell the engine where we want values to go, other than the `return`/`throw` path. The path values take is implied by the positioning of functions. Put one function to the right of another and their results will combine. Its a simple and kind of limited system but it makes a lot of sense give the interface we use to create programs is textual.

A big problem arises when your programs input comes from outside of memory though. If your loading data from the hard-drive or across the Internet the CPU is going to end up spending so much time waiting around for something to work on that its ridiculous the expect to to just sit there and wait. We can't speed this data up but we might be able write our programs in such a way that the CPU can do other tasks while its waits for data required by another. Now we are talking about asynchronous or concurrent programming. We can't express this type of program to a JS engine simply by sticking two functions next to each other like we would normally though. It won't know that its meant to wait and think your asynchronous function simply `return`ed `undefined` or something. Though if we reify the concept of a functions result we can create our own dependency tree and recreate the value passing system normally provided implicitly by the JS engine in such a way that its tolerant of undefined time gaps between operations.

## Installation

`npm install result`

then in your app:

```js
import Result from 'result'
```

## API

### Result()

the Result class

### Result#read(onValue, onError)

Read the value of `this`

### Result#write([value])

Give the Result it's value

### Result#error(reason)

put the Result into a failed state

### Result#then(onValue, onError)

Create a Result for a transformation of the value of `this` Result

### Result#node(fn(error, value))

read using a node style function

```js
result.node(function(err, value){})
```

### Result#yield(value)

Create a child Result destined to fulfill with `value`

```js
return result.then(function(value){
	// something side effect
}).yield(e)
```

### Result#get(attr:String)

  return a Result for `this[attr]`

### Result.failed()

wrap `reason` in a "failed" result

### Result.wrap()

wrap `value` in a "done" Result

### Result.read(value, onValue, onError)

read the value of `value` even if its within a Result

### Result.coerce(value)

coerce `value` to a Result

### Result.when(result, onValue, onError)

transform `value` with `onValue`. If `value` is a "failed" Result it will be passed to `onError` instead

### Result.transfer(a, b)

  transfer the value of `a` to `b`

### Result.unbox(value)

  attempt to unbox a value synchronously

### defer(onNeed)

Sometimes your not sure if an expensive to computation is actually going to be required or not. Without any abstraction this forces you to either waste computation or expose a goofy API to consumers of the result. The `defer` function solves this by creating a special type of `Result`, a DeferredResult, which executes a function and assimilates its result the first time someone reads the `DeferredResult`. From the consumers perspective this is just a normal `Result` so no goofy API required. For example to represent a GitHub user as an Object we might write:

```js
var user = {
  name: 'jake',
  handle: 'jkroso',
  repos: defer(function(){
    // get list of repos by http
  })
}
```

The usual way to represent a user might be to provide methods to access expensive properties like repos. But repos are really just normal data, the API shouldn't change just because they aren't immediately available. And repos would be recomputed each time someone accesses them which is really dumb. Using `DeferredResult`s don't _quite_ give you a normal API but it does get you as close as you could ever hope without language level support. Or wasted computation. See [solicit](//github.com/jkroso/solicit) for another example of how `DeferredResult`s can be useful.
