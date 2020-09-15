// Promise.js（源码）
const isFunction = obj => typeof obj === 'function'
const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

class MyPromise {
    constructor(handle) {
        if (!isFunction(handle)) {
            throw new Error('MyPromise must accept a function as a parameter')
        }
        // 状态
        this._status = PENDING
        // 值
        this._value = undefined
        // 成功回调函数队列
        this._fulfilledQueues = []
        // 失败回调函数队列
        this._rejectedQueues = []
        try {
            handle(this._resolve.bind(this), this._reject.bind(this))
        } catch (err) {
            this._reject(err)
        }
    }
    _resolve(val) {
        // debugger
        const run = () => {
            if (this._status !== PENDING) return
            this._status = FULFILLED
            // 依次执行成功队列中的函数，并清空队列
            const runFulfilled = (value) => {
                let cb
                while (cb = this._fulfilledQueues.shift()) {
                    cb(value)
                }
            }
            // 依次执行失败队列中的函数，并清空队列
            const runRejected = (value) => {
                let cb
                while (cb = this._rejectedQueues.shift()) {
                    cb(value)
                }
            }
            /*
                如果resolve的参数为Promise对象，则必须等待该Promise对象状态改变后,
                当前Promsie的状态才会改变，且状态取决于参数Promsie对象的状态
            */
            if (val instanceof MyPromise) {
                val.then(value => {
                    this._value = value
                    runFulfilled(value)
                }, err => {
                    this._value = err
                    runRejected(err)
                })
            } else {
                this._value = val
                runFulfilled(val)
            }
        }
        setTimeout(run, 0)
    }
    _reject(err) {
        if (this._status !== PENDING) return
        // 依次执行失败队列中的函数，并清空队列
        const run = () => {
            this._status = REJECTED
            this._value = err
            let cb
            while (cb = this._rejectedQueues.shift()) {
                cb(err)
            }
        }
        setTimeout(run, 0);
    }
    then(onFulfilled, onRejected) {
        const { _status, _value } = this
        // 返回一个新的Promise对象
        return new MyPromise((onFulfilledNext, onRejectedNext) => {
            // debugger
            // 封装一个成功时执行的函数
            let fullfilled = value => {
                try {
                    if (!isFunction(onFulfilled)) {
                        // 如果回调不是函数，就把值传入下一个then的回调函数，并立即执行下一个then的回调函数
                        onFulfilledNext(value)
                    } else {
                        let res = onFulfilled(value)
                        // console.log(res)
                        if (res instanceof MyPromise) {
                            // 如果当前回调函数返回MyPromise对象，必须等待其状态改变后在执行下一个回调
                            res.then(onFulfilledNext, onRejectedNext)
                        } else {
                            // 否则会将返回结果直接作为参数，传入下一个then的回调函数，并立即执行下一个then的回调函数
                            onFulfilledNext(res)
                        }
                    }
                } catch (err) {
                    onRejectedNext(err)
                }
            }
            // 封装一个失败时执行的函数
            let rejected = error => {
                try {
                    if (!isFunction(onRejected)) {
                        // 如果回调不是函数，就把值传入下一个then的回调函数，并立即执行下一个then的回调函数
                        onRejectedNext(error)
                    } else {
                        let res = onRejected(error)
                        if (res instanceof MyPromise) {
                            // 如果当前回调函数返回MyPromise对象，必须等待其状态改变后在执行下一个回调
                            res.then(onFulfilledNext, onRejectedNext)
                        } else {
                            // 否则会将返回结果直接作为参数，传入下一个then的回调函数，并立即执行下一个then的回调函数
                            onFulfilledNext(error)
                        }
                    }
                } catch (err) {
                    // 如果函数执行出错，新的Promise对象的状态为失败
                    onRejectedNext(err)
                }
            }
            switch (_status) {
                // 当状态为pending时，将then方法回调函数加入执行队列等待执行
                case PENDING:
                    this._fulfilledQueues.push(fullfilled)
                    this._rejectedQueues.push(rejected)
                    break
                // 当状态已经改变时，立即执行对应的回调函数
                case FULFILLED:
                    fullfilled(_value)
                    break
                case REJECTED:
                    rejected(_value)
                    break
            }
        })
    }
    catch(onRejected) {
        return this.then(undefined, onRejected)
    }
    finally(cb) {
        return this.then(
            value => MyPromise.resolve(cb()).then(() => value),
            reason => MyPromise.resolve(cb()).then(() => { throw reason })
        )
    }
    static resolve(value) {
        // 如果参数是MyPromise实例，直接返回这个实例
        if (value instanceof MyPromise) return value
        return new MyPromise(resolve => resolve(value))
    }
    static reject(value) {
        return new MyPromise((resolve, reject) => reject(value))
    }
    static all(list) {
        return new MyPromise((resolve, reject) => {
            let values = []
            let count = 0
            for (let [i, p] of list.entries()) {
                // 数组参数如果不是MyPromise实例，先调用MyPromise.resolve
                this.resolve(p).then(res => {
                    values[i] = res
                    count++
                    // 所有状态都变成fulfilled时返回的MyPromise状态就变成fulfilled
                    if (count === list.length) resolve(values)
                }, err => {
                    // 有一个被rejected时返回的MyPromise状态就变成rejected
                    reject(err)
                })
            }
        })
    }
    static race(list) {
        return new MyPromise((resolve, reject) => {
            for (let p of list) {
                this.resolve(p).then(res => {
                    // 只要有一个实例率先改变状态，新的MyPromise的状态就跟着改变
                    resolve(res)
                }, err => {
                    reject(res)
                })
            }
        })
    }
    static any(list) {
        return new MyPromise((resolve, reject) => {
            let count = 0
            let values = []
            for (let [i, p] of list.entries()) {
                this.resolve(p).then(res => {
                    // 只要有一个实例改变状态为fulfilled，新的MyPromise的状态就跟着改变
                    resolve(res)
                }, err => {
                    values[i] = err
                    count++
                    // 否则当所有实例状态都为rejected时，新的MyPromise状态才跟着rejected
                    if (count === list.length) reject(err)
                })
            }
        })
    }
    static allSettled(list) {
        return new MyPromise((resolve, reject) => {
            let count = 0
            let values = []
            for (let [i, p] of list.entries()) {
                // 当所有实例改变状态都改变时，新的MyPromise状态才跟着改变
                this.resolve(p).then(res => {
                    count++
                    values[i] = res
                    if (count === list.length) resolve(values)
                }, err => {
                    count++
                    values[i] = err
                    if (count === list.length) resolve(values)
                })
            }
        })
    }
}
// module.exports = MyPromise