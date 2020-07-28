const { nextTick } = require('./util')
const queue = []
let waiting = false

function flushSchedulerQueue() {
    for(let i = 0; i < queue.length; i++) {
        let watcher = queue[i]
        watcher.run()
    }
    waiting = false
    queue.length = 0
}

exports.queueWatcher = function(watcher) {
    if (queue.indexOf(watcher) > -1) return
    queue.push(watcher)
    if (!waiting) {
        waiting = true
        nextTick(flushSchedulerQueue)
    }
}