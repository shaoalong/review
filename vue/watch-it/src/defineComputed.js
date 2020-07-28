const Dep = require('./dep')
const Watcher = require('./watcher')

const noop = () => {}
const computedWatcherOptions = { lazy: true }
const sharedPropertyDefination = {
    enumrable: true,
    configrable: true,
    get: noop,
    set: noop
}
// 生成getter
function createComputedGetter(key) {
    return function computedGetter() {
        const watcher = this.__computed_watchers__ && this.__computed_watchers__[key]
        if (watcher) {
            if (watcher.dirty) {
                watcher.evaluate()
            }
            if (Dep.target) {
                watcher.depend()
            }
            return watcher.value
        }
    }
}
function defineComputed(target, key, userDef) {
    if (typeof userDef === 'function') {
        sharedPropertyDefination.get = createComputedGetter(key)
        sharedPropertyDefination.set = noop
    } else {
        sharedPropertyDefination.get = userDef.get ? createComputedGetter(key) : noop
        sharedPropertyDefination.set = userDef.set || noop
    }
    Object.defineProperty(target, key, sharedPropertyDefination)
}
module.exports = function(target, key, userDef) {
    let watchers
    if (!target.hasOwnProperty('__computed_watchers__')) {
        watchers =  target.__computed_watchers__ = Object.create(null)
    } else {
        watchers = target.__computed_watchers__
    }

    const getter = typeof userDef === 'function' ? userDef : userDef.get
    watchers[key] = new Watcher(getter || noop, noop, computedWatcherOptions)
    defineComputed(target, key, userDef)
}