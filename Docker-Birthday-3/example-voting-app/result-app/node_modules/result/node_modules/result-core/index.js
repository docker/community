import ResultType from 'result-type'
import nextTick from 'next-tick'

export default class Result extends ResultType {
  constructor(state, value) {
    super()
    this.state = state
    this.value = value
  }

  /**
  * give `this` its value
  *
  * @param {x} value
  * @return {this}
  */

  write(value) {
    if (this.state == 'pending') {
      this.state = 'done'
      this.value = value
      this._onValue && run(this, this._onValue)
    }
    return this
  }

  /**
  * give `this` its reason for failure
  *
  * @param {x} reason
  * @return {this}
  */

  error(reason) {
    if (this.state == 'pending') {
      this.state = 'fail'
      this.value = reason
      this._onError && run(this, this._onError)
    }
    return this
  }

  /**
  * access the result of `this` ASAP
  *
  * @param {Function} onValue
  * @param {Function} onError
  * @return {this}
  */

  read(onValue, onError) {
    switch (this.state) {
      case 'done':
        onValue && runFn(this, onValue)
        break
      case 'fail':
        if (onError) runFn(this, onError)
        else rethrow(this.value)
        break
      default:
        this.listen(onValue, onError || rethrow)
    }
    return this
  }

  /**
  * add listeners for the result
  *
  * @param {Function} onValue
  * @param {Function} onError
  * @return {this}
  */

  listen(onValue, onError) {
    onValue && listen(this, '_onValue', onValue)
    onError && listen(this, '_onError', onError)
  }
}

const listen = (obj, prop, fn) => {
  var fns = obj[prop]
  if (!fns) obj[prop] = fn
  else if (typeof fns == 'function') obj[prop] = [fns, fn]
  else obj[prop].push(fn)
}

/**
 * dispatch to `runFn` on the type of `fns`
 *
 * @param {Function} fns
 * @param {ctx} Result
 * @api private
 */

const run = (ctx, fns) => {
  if (typeof fns == 'function') runFn(ctx, fns)
  else for (var i = 0, len = fns.length; i < len;) {
    runFn(ctx, fns[i++])
  }
}

/**
 * run `fn` and re-throw any errors with a clean
 * stack to ensure they aren't caught unwittingly.
 * since readers are sometimes run now and sometimes
 * later the following would be non-deterministic
 *
 *   try {
 *     result.read(() => {
 *       throw new Error('boom')
 *     })
 *   } catch (e) {
 *     // if result is "done" boom is caught, while
 *     // if result is "pending" it won't be caught
 *   }
 *
 * @param {Result} ctx
 * @param {Function} fn
 */

const runFn = (ctx, fn) => {
  try { fn(ctx.value) }
  catch (e) { rethrow(e) }
}

const rethrow = error => nextTick(() => { throw error })
