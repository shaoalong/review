const Dep = require('./dep')

module.exports = function defineReactive(obj, key, val) {
    const dep = new Dep()
    const property = Object.getOwnPropertyDescriptor(obj, key)
    if (property && !property.configurable) return

    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function reactiveGetter() {
            if (Dep.target) {
                // 建立依赖关系
                dep.depend()
            }
            return val;
        },
        set: function reactiveSetter(value) {
            if (value === val) return
            val = value
            // 通知更新
            dep.notify()
        }
    })
}