import ResultType from 'result-type'
import ResultCore from 'result-core'
import type from '@jkroso/type'

export default class Result extends ResultCore {
  /**
  * Create a Result for a transformation of the value
  * of `this` Result
  *
  * @param  {Function} onValue
  * @param  {Function} onError
  * @return {Result}
  */

  then(onValue, onError) {
    switch (this.state) {
      case 'fail': onValue = onError // falls through
      case 'done':
        if (!onValue) return this
        try {
          return coerce(onValue.call(this, this.value))
        } catch (e) {
          return failed(e)
        }
      default:
        const x = pending()
        this.listen(
          handle(x, onValue, 'write', this),
          handle(x, onError, 'error', this))
        return x
    }
  }

  /**
  * Create a child Result destined to fulfill with `value`
  *   return result.then(function(value){
  *     // some side effect
  *   }).yield(e)
  *
  * @param  {x} value
  * @return {Result}
  */

  yield(value) {
    return this.then(() => value)
  }

  /**
  * return a Result for `this[attr]`
  *
  * @param {String} attr
  * @return {Result}
  */

  get(attr) {
    return this.then(obj => obj[attr])
  }
}


/**
 * wrap `reason` in a "failed" result
 *
 * @param {x} reason
 * @return {Result}
 * @api public
 */

export const failed = reason => new Result('fail', reason)

/**
 * wrap `value` in a "done" Result
 *
 * @param {x} value
 * @return {Result}
 * @api public
 */

export const wrap = value => new Result('done', value)

/**
 * A pending Result
 */

export const pending = () => new Result('pending')

/**
 * coerce `value` to a Result
 *
 * @param {x} value
 * @return {Result}
 * @api public
 */

export const coerce = value => {
  if (!(value instanceof ResultType)) {
    return isPromise(value)
      ? coercePromise(value)
      : wrap(value)
  }
  if (value instanceof Result) return value
  switch (value.state) {
    case 'done': return wrap(value.value)
    case 'fail': return failed(value.value)
  }
  const result = pending()
  value.listen(value => result.write(value),
               error => result.error(error))
  return result
}

export const coercePromise = promise => {
  const result = pending()
  promise.then(value => result.write(value),
               error => result.error(error))
  return result
}

/**
 * create a function which will propagate a value/error
 * onto `result` when called. If `fn` is present it
 * will transform the value/error before assigning the
 * result to `result`
 *
 * @param {Function} result
 * @param {Function} fn
 * @param {String} method
 * @return {Function}
 * @api private
 */

const handle = (result, fn, method, ctx) =>
  typeof fn != 'function'
    ? x => result[method](x)
    : x => {
      try { transfer(fn.call(ctx, x), result) }
      catch (e) { result.error(e) }
    }

/**
 * run `value` through `onValue`. If `value` is a
 * "failed" promise it will be passed to `onError`
 * instead. Any errors will result in a "failed"
 * promise being returned rather than an error
 * thrown so you don't have to use a try catch
 *
 * @param {Any} result
 * @param {Function} onValue
 * @param {Function} onError
 * @return {Any}
 */

export const when = (value, onValue, onError) => {
  if (value instanceof ResultType) switch (value.state) {
    case 'fail':
      if (!onError) return value
      onValue = onError
      value = value.value
      break
    case 'done':
      value = value.value
      break
    default:
      const x = pending()
      value.listen(handle(x, onValue, 'write'),
                   handle(x, onError, 'error'))
      // unbox if possible
      return x.state == 'done' ? x.value : x
  }
  if (isPromise(value)) return value.then(onValue, onError)
  if (!onValue) return value
  try { return onValue(value) }
  catch (e) { return failed(e) }
}

/**
 * read `value` even if its within a promise
 *
 * @param {x} value
 * @param {Function} onValue
 * @param {Function} onError
 */

export const read = (value, onValue, onError) => {
  if (value instanceof ResultType) value.read(onValue, onError)
  else onValue(value)
}

/**
 * transfer the value of `a` to `b`
 *
 * @param {Any} a
 * @param {Result} b
 */

export const transfer = (a, b) => {
  if (a instanceof ResultType) switch (a.state) {
    case 'done': b.write(a.value); break
    case 'fail': b.error(a.value); break
    default:
      a.listen(value => b.write(value), error => b.error(error))
  } else if (isPromise(a)) {
    a.then(value => b.write(value), error => b.error(error))
  } else {
    b.write(a)
  }
}

// thanks to babel `x instanceof Promise` is unreliable
const isPromise = value => value && typeof value.then == 'function'

/**
 * attempt to unbox a value synchronously if it can't be done because
 * the result is "pending" then an error will be thrown
 *
 * @param {Any} value
 * @return {Any}
 * @throws {Error} If given a pending result
 * @throws {Any} If given a failed result
 */

export const unbox = value => {
  if (!(value instanceof ResultType)) return value
  if (value.state == 'done') return value.value
  if (value.state == 'fail') throw value.value
  throw new Error('can\'t unbox a pending result')
}

/**
 * attempt to unbox a value. If it's a "pending" result then it will
 * just be returned as is
 *
 * @param {Any} value
 * @return {Any}
 * @throws {Error} If given a pending result
 * @throws {Any} If given a failed result
 */

export const softUnbox = value => {
  if (!(value instanceof ResultType)) return value
  if (value.state == 'done') return value.value
  if (value.state == 'fail') throw value.value
  return value
}

const memoize = fn => (value, seen=new Map) => {
  if (seen.has(value)) return seen.get(value)
  return fn(value, seen)
}

/**
 * Unbox all nested promises in a data structure
 *
 * @param {Any} value
 * @return {Any} a copy of `value`
 */

export const liftall = memoize((value, seen) => {
  if (value instanceof Result) return value.then(v => liftall(v, seen))
  if (isPromise(value)) return when(coercePromise(value), v => liftall(v, seen))
  const fn = liftall[type(value)]
  return fn ? fn(value, seen) : value
})

liftall.object = (value, seen) => {
  const copy = Object.create(value)
  seen.set(value, copy)
  return Object.keys(value).reduce((copy, key) =>
    when(copy, copy =>
      when(liftall(value[key], seen), value => {
        copy[key] = value
        return copy
      })), copy)
}

liftall.array = (values, seen) => {
  const copy = new Array(values.length)
  seen.set(values, copy)
  return values.reduce((copy, value, index) =>
    when(copy, copy =>
      when(liftall(value, seen), value => {
        copy[index] = value
        return copy
      })), copy)
}

/**
 * Deferred class
 */

export class Deferred extends Result {
  constructor(fn){
    super('pending')
    this.onNeed = fn
    this.needed = false
  }

  /**
  * add a trigger aspect to listen. This aspect ensures
  * `onNeed` is called the first time someone reads from
  * the Deferred result
  *
  * @param {Function} method
  * @return {Function}
  * @api private
  */

  listen(onValue, onError) {
    super.listen(onValue, onError)
    if (this.needed === false) {
      this.needed = true
      try {
        transfer(this.onNeed(), this)
      } catch (e) {
        this.error(e)
      }
    }
  }
}

/**
 * create a Deferred which is associated with the
 * Function `onNeed`. `onNeed` will only be called
 * once someone actually reads from the Deferred.
 *
 *   defer(() => 'hello')
 *   defer((cb) => cb(null, 'hello'))
 *   defer((write, error) => write('hello'))
 *
 * @param {Function} onNeed(write, error)
 * @return {Deferred}
 */

export const defer = onNeed => {
  switch (onNeed.length) {
    case 2:
      return new Deferred(function(){
        const res = pending()
        onNeed.call(this, v => res.write(v), e => res.error(e))
        return res
      })
    case 1:
      return new Deferred(function(){
        const result = pending()
        onNeed.call(this, (error, value) => {
          if (error != null) result.error(error)
          else result.write(value)
        })
        return result
      })
    default:
      return new Deferred(onNeed)
  }
}
