const isFunction = (obj) => typeof obj === 'function'
const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

class MyPromise{
    constructor(handle) {
        if (!isFunction(handle)) {
            throw new Error('handle must be a function')
        }
        this._status = PENDING
        this._value = null
        this._fulfilledQueues = []
        this._rejectedQueues = []
        try {
            handle(this._resolve.bind(this), this._reject.bind(this))
        } catch (err) {
            this._reject(err)
        }
    }

    _resolve(val) {
        const run = () => {
            if (this._status !== PENDING) return
            this._status = FULFILLED
            const runFulfilled = (val) => {
                let cb
                while (cb = this._fulfilledQueues.shift()) {
                    cb(val)
                }
            }
            const runRejected = (val) => {
                let cb
                while (cb = this._rejectedQueues.shift()) {
                    cb(val)
                }
            }
            if (val instanceof MyPromise) {
                val.then(value => {
                    this._value = value
                    runFulfilled(value)
                }, err => {
                    this._value = err
                    runRejected(value)
                })
            } else {
                this._value = value
                runFulfilled(value)
            }
        }
        setTimeout(run)
    }

    _reject(err) {
        if (this._status !== PENDING) return
        const run = () => {
            this._status = REJECTED
            this._value = err
            let cb
            while (cb = this._rejectedQueues.shift()) {
                cb(err)
            }
        }
        setTimeout(run)
    }

    then(onResolvedFn, onRejectedFn) {
        const { _status, _value } = this
        return new MyPromise((resolve, reject) => {
            const runFulfilled = (val) => {
                try {
                    if (!isFunction(onResolvedFn)) {
                        resolve(val)
                    } else {
                        const _val = onResolvedFn()
                        if (_val instanceof MyPromise) {
                            _val.then(resolve, reject)
                        } else {
                            resolve(_val)
                        }
                    }
                } catch (err) {
                    reject(err)
                }
            }
            const runRejected = (val) => {
                try {
                    if (!isFunction(onRejectedFn)) {
                        reject(val)
                    } else {
                        const _val = onRejectedFn(val)
                        if (_val instanceof MyPromise) {
                            _val.then(resolve, reject)
                        } else {
                            reject(_val)
                        }
                    }
                } catch (err) {
                    reject(err)
                }
            }
            switch (_status) {
                case PENDING: 
                    this._fulfilledQueues.push(onResolvedFn);
                    this._rejectedQueues.push(onRejectedFn);
                    break;
                case FULFILLED:
                    runFulfilled(_value);
                    break;
                case REJECTED:
                    runRejected(_value);
                    break;
            }
        })
    }

    catch(onRejected) {
        return this.then(undefined, onRejected)
    }

    static resolve(value) {
        if (value instanceof MyPromise) return value
        return new MyPromise(resolve => resolve(value))
    }

    static reject(value) {
        return new MyPromise((resolve, reject) => reject(value))
    }

    finally(cb) {
        return this.then(
            val => MyPromise.resolve(cb).then(() => val),
            val => MyPromise.reject(cb).then(() => { throw val }))
    }

    static race(...promise) {
        return new MyPromise((resolve, reject) => {
            for (let p of promise) {
                this.resolve(p).then(res => {
                    resolve(res)
                }, err => {
                    reject(err)
                })
            }
        })
    }

    static all(...promises) {
        return new MyPromise((resove, reject) => {
            let stack = []
            for (let p of promises) {
                this.resolve(p).then(res => {
                    stack.push(res)
                    if (stack.length === promises.length) resove(stack)
                }, err => {
                    reject(err)
                })
            }
        })
    }

    static any(...promises) {
        return new MyPromise((resolve, reject) => {
            let stack = []
            for (let p of promises) {
                this.resolve(p).then(res => {
                    resolve(res)
                }, err => {
                    stack.push(err)
                    if (stack.length === promises.length) reject(stack)
                })
            }
        })
    }

    static allSettled(...promises) {
        return new MyPromise((resolve) => {
            let stack = []
            for (let p of promises) {
                this.resolve(p).then(res => {
                    stack.push(res)
                    if (stack.length === promises.length) resolve(stack)
                }, err => {
                    stack.push(err)
                    if (stack.length === promises.length) resolve(stack)
                })
            }
        })
    }
}