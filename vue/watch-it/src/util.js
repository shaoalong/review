// 储存下一个tick需要执行的回调函数
const callbacks = []
// 标志是否正在执行回调函数，保证在下一个tick之前只执行一次
let pending = false
// 异步触发执行回调函数
let timeFunc
if (typeof Promise !== 'undefined') {
    const p = Promise.resolve()
    timeFunc = () => {
        p.then(flashCallbacks)
    }
} else {
    timeFunc = () => {
        setTimeout(flashCallbacks, 0)
    }
}

function flashCallbacks() {
    pending = false
    const copies = callbacks.slice(0)
    callbacks.length = 0
    copies.forEach(cb => cb())
}

exports.nextTick = function(cb) {
    callbacks.push(cb)
    if (!pending) {
        pending = true
        timeFunc()
    }
}
// nextTick原理：异步更新队列
//     Vue在观察到数据变化时并不是直接更新数据，而是开启一个队列，并缓冲在同一事件循环中发生的所有数据改变。
//     如果同一个watcher被多次触发，只会被推入到队列一次。这种在缓冲时去除重复数据从而避免不必要的计算和DOM操作上非常重要。
//     然后在下一个事件循环tick中，Vue刷新队列并执行实际工作。
// nextTick的主要应用场景
// 1.在Vue生命周期created钩子函数进行dom操作一定要放到Vue.nextTick的回调函数中
//     在created钩子函数执行的时候DOM其实并未进行渲染，而此时进行DOM操作无异于徒劳，所以此时一定要将DOM操作的js代码放进Vue.nextTick的回调函数中。
//     与之对应的mounted钩子函数，因为钩子函数执行时所有的DOM挂载和渲染都已经完成，此时在该钩子函数中进行任何DOM操作都不会有问题。
// 2.在数据变化后要执行的某个操作，而这个操作需要使用随数据改变而改变的DOM结构的时候，这个操作都应该放进Vue.nextTick的回调函数中。
