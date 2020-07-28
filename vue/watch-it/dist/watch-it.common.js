'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

let uid = 0;
let targetStack = [];

class Dep {
  constructor() {
    this.id = ++uid;
    this.subs = [];
  }

  // 添加订阅者
  addSub(watcher) {
    this.subs.push(watcher);
  }

  // 删除订阅者
  removeSub(watcher) {
    const index = this.subs.indexOf(watcher);
    if (index > -1) {
      this.subs.splice(index, 1);
    }
  }

  // 通知订阅者
  notify() {
    console.log('notify', this);
    this.subs.forEach(watcher => {
      watcher.update();
    });
  }

  // 建立与当前watcher的依赖关系
  depend() {
    Dep.target.addDep(this);
  }
}

Dep.target = null;
Dep.pushTarget = function(target) {
  if (Dep.target) targetStack.push(Dep.target);
  Dep.target = target;
};
Dep.popTarget = function() {
  Dep.target = targetStack.pop();
};

var dep = Dep;

var defineReactive = function defineReactive(obj, key, val) {
    const dep$1 = new dep();
    const property = Object.getOwnPropertyDescriptor(obj, key);
    if (property && !property.configurable) return

    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function reactiveGetter() {
            if (dep.target) {
                // 建立依赖关系
                dep$1.depend();
            }
            return val;
        },
        set: function reactiveSetter(value) {
            if (value === val) return
            val = value;
            // 通知更新
            dep$1.notify();
        }
    });
};

// 储存下一个tick需要执行的回调函数
const callbacks = [];
// 标志是否正在执行回调函数，保证在下一个tick之前只执行一次
let pending = false;
// 异步触发执行回调函数
let timeFunc;
if (typeof Promise !== 'undefined') {
    const p = Promise.resolve();
    timeFunc = () => {
        p.then(flashCallbacks);
    };
} else {
    timeFunc = () => {
        setTimeout(flashCallbacks, 0);
    };
}

function flashCallbacks() {
    pending = false;
    const copies = callbacks.slice(0);
    callbacks.length = 0;
    copies.forEach(cb => cb());
}

var nextTick = function(cb) {
    callbacks.push(cb);
    if (!pending) {
        pending = true;
        timeFunc();
    }
};
// nextTick原理：异步更新队列
//     Vue在观察到数据变化时并不是直接更新数据，而是开启一个队列，并缓冲在同一事件循环中发生的所有数据改变。
//     如果同一个watcher被多次触发，只会被推入到队列一次。这种在缓冲时去除重复数据从而避免不必要的计算和DOM操作上非常重要。
//     然后在下一个事件循环tick中，Vue刷新队列并执行实际工作。
// nextTick的主要应用场景
// 1.在Vue生命周期created钩子函数进行dom操作一定要放到Vue.nextTick的回调函数中
//     在created钩子函数执行的时候DOM其实并未进行渲染，而此时进行DOM操作无异于徒劳，所以此时一定要将DOM操作的js代码放进Vue.nextTick的回调函数中。
//     与之对应的mounted钩子函数，因为钩子函数执行时所有的DOM挂载和渲染都已经完成，此时在该钩子函数中进行任何DOM操作都不会有问题。
// 2.在数据变化后要执行的某个操作，而这个操作需要使用随数据改变而改变的DOM结构的时候，这个操作都应该放进Vue.nextTick的回调函数中。

var util = {
	nextTick: nextTick
};

const { nextTick: nextTick$1 } = util;
const queue = [];
let waiting = false;

function flushSchedulerQueue() {
    for(let i = 0; i < queue.length; i++) {
        let watcher = queue[i];
        watcher.run();
    }
    waiting = false;
    queue.length = 0;
}

var queueWatcher = function(watcher) {
    if (queue.indexOf(watcher) > -1) return
    queue.push(watcher);
    if (!waiting) {
        waiting = true;
        nextTick$1(flushSchedulerQueue);
    }
};

var scheduler = {
	queueWatcher: queueWatcher
};

const { popTarget, pushTarget } = dep;
const { queueWatcher: queueWatcher$1 } = scheduler;

let uid$1 = 0;
var watcher = class Watcher {
  constructor(expOrFn, cb, options) {
    if (options) {
      this.lazy = !!options.lazy;
      this.sync = !!options.sync;
    } else {
      this.lazy = this.sync = false;
    }
    this.cb = cb; // 除了侦听器watcher外，其它大多数为空函数
    this.uid = ++uid$1;
    this.active = true;
    this.dirty = this.lazy;
    this.deps = [];
    this.newDeps = [];
    this.expression = expOrFn.toString();
    // 渲染watcher,expOrFn是updateComponent,即重新渲染执行render(_update);
    // 计算watcher,expOrFn是计算属性的计算方法;
    // 侦听器watcher,expOrFn是watcher属性的名字,this.cb就是watch的handler属性
    this.getter = expOrFn; 
    this.value = this.lazy ? undefined : this.get();
  }
  // 取值操作
  get() {
    pushTarget(this); // Dep.target设置为该观察者
    let value = this.getter.call(null);
    popTarget(); // 移除该观察者
    this.cleanDeps();
    return value
  }
  addDep(dep) {
    if (this.newDeps.indexOf(dep) > -1) return
    this.newDeps.push(dep); // 为观察者的deps添加依赖dep
    if (this.deps.indexOf(dep) === -1) {
      dep.addSub(this); // 为depe添加该观察者
    }
  }
  cleanDeps() {
    this.deps.forEach(dep => {
      if (this.newDeps.indexOf(dep) === -1) {
        dep.removeSub(this);
      }
    });
    this.deps = this.newDeps;
    this.newDeps = [];
  }
  // 当一个依赖改变的时候，通知他update
  update() {
    this.run();
    if (this.lazy) {
      // 三种watcher，只有计算属性watcher的lazy设置为true，表示启用惰性求值
      this.dirty = true;
    } else if (this.sync) ; else {
      console.log('==');
      // 将watcher推入观察者队列，下一个tick时调用。也就是说数变化不是立即去更新，而是异步批量去更新
      queueWatcher$1(this);
    }
  }
  // update执行后，运行回调cb
  run() {
    if (!this.active) return
    const value = this.get();
    const oldValue = this.value;
    if (value !== oldValue) {
      this.value = value;
      this.cb.call(null, value, oldValue);
    }
  }
  // 对于计算属性，当取值计算属性时，发现属性的watcher的dirty是true，说明数据不是最新的，需要重新计算，这里就是重新计算属性的值
  evaluate() {
    this.value = this.get();
    this.dirty = false;
  }
  // 收集依赖
  depend() {
    this.deps.forEach(dep => {
      dep.depend();
    });
  }
  tearDown() {
    if (!this.active) return
    this.deps.forEach(dep => {
      dep.removeSub(this);
    });
    this.active = false;
  }
};

const noop = () => {};
const computedWatcherOptions = { lazy: true };
const sharedPropertyDefination = {
    enumrable: true,
    configrable: true,
    get: noop,
    set: noop
};
// 生成getter
function createComputedGetter(key) {
    return function computedGetter() {
        const watcher = this.__computed_watchers__ && this.__computed_watchers__[key];
        if (watcher) {
            if (watcher.dirty) {
                watcher.evaluate();
            }
            if (dep.target) {
                watcher.depend();
            }
            return watcher.value
        }
    }
}
function defineComputed(target, key, userDef) {
    if (typeof userDef === 'function') {
        sharedPropertyDefination.get = createComputedGetter(key);
        sharedPropertyDefination.set = noop;
    } else {
        sharedPropertyDefination.get = userDef.get ? createComputedGetter(key) : noop;
        sharedPropertyDefination.set = userDef.set || noop;
    }
    Object.defineProperty(target, key, sharedPropertyDefination);
}
var defineComputed_1 = function(target, key, userDef) {
    let watchers;
    if (!target.hasOwnProperty('__computed_watchers__')) {
        watchers =  target.__computed_watchers__ = Object.create(null);
    } else {
        watchers = target.__computed_watchers__;
    }

    const getter = typeof userDef === 'function' ? userDef : userDef.get;
    watchers[key] = new watcher(getter || noop, noop, computedWatcherOptions);
    defineComputed(target, key, userDef);
};

class Observer {
    constructor(value) {
        this.value = value;
        Object.defineProperty(value, '__ob__', {
            value: this,
            enumerable: false,
            writable: true,
            configurable: true
        });
        this.walk(value);
    }

    walk(obj) {
        Object.keys(obj).forEach(key => {
            defineReactive(obj, key, obj[key]);
        });
    }
}

Observer.observe = function(value) {
    if (!value || typeof value !== 'object') return
    let ob;
    if (value.hasOwnProperty('__ob__') && value.__ob__ instanceof Observer) {
        ob = value.__ob__;
    } else {
        ob = new Observer(value);
    }
    return ob
};

var observer = Observer;

var defineReactive_1 = defineReactive;
var observe = observer.observe;
var defineComputed_1$1 = defineComputed_1;
var watch = function(fn, cb, options) {
    const watcher$1 = new watcher(fn, cb, options);
    return () => watcher$1.tearDown()
};

var watchIt = {
	defineReactive: defineReactive_1,
	observe: observe,
	defineComputed: defineComputed_1$1,
	watch: watch
};

exports.default = watchIt;
exports.defineComputed = defineComputed_1$1;
exports.defineReactive = defineReactive_1;
exports.observe = observe;
exports.watch = watch;
