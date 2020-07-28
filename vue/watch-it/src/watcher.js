const { popTarget, pushTarget } = require('./dep')
const { queueWatcher } = require('./scheduler')

let uid = 0
module.exports = class Watcher {
  constructor(expOrFn, cb, options) {
    if (options) {
      this.lazy = !!options.lazy
      this.sync = !!options.sync
    } else {
      this.lazy = this.sync = false
    }
    this.cb = cb // 除了侦听器watcher外，其它大多数为空函数
    this.uid = ++uid
    this.active = true
    this.dirty = this.lazy
    this.deps = []
    this.newDeps = []
    this.expression = expOrFn.toString()
    // 渲染watcher,expOrFn是updateComponent,即重新渲染执行render(_update);
    // 计算watcher,expOrFn是计算属性的计算方法;
    // 侦听器watcher,expOrFn是watcher属性的名字,this.cb就是watch的handler属性
    this.getter = expOrFn 
    this.value = this.lazy ? undefined : this.get()
  }
  // 取值操作
  get() {
    pushTarget(this) // Dep.target设置为该观察者
    let value = this.getter.call(null)
    popTarget() // 移除该观察者
    this.cleanDeps()
    return value
  }
  addDep(dep) {
    if (this.newDeps.indexOf(dep) > -1) return
    this.newDeps.push(dep) // 为观察者的deps添加依赖dep
    if (this.deps.indexOf(dep) === -1) {
      dep.addSub(this) // 为depe添加该观察者
    }
  }
  cleanDeps() {
    this.deps.forEach(dep => {
      if (this.newDeps.indexOf(dep) === -1) {
        dep.removeSub(this)
      }
    })
    this.deps = this.newDeps
    this.newDeps = []
  }
  // 当一个依赖改变的时候，通知他update
  update() {
    this.run()
    if (this.lazy) {
      // 三种watcher，只有计算属性watcher的lazy设置为true，表示启用惰性求值
      this.dirty = true
    } else if (this.sync) {
      // 标记为同步计算的直接运行run，三大类型暂无，所以基本会用下面的queueWatcher
      
    } else {
      console.log('==')
      // 将watcher推入观察者队列，下一个tick时调用。也就是说数变化不是立即去更新，而是异步批量去更新
      queueWatcher(this)
    }
  }
  // update执行后，运行回调cb
  run() {
    if (!this.active) return
    const value = this.get()
    const oldValue = this.value
    if (value !== oldValue) {
      this.value = value
      this.cb.call(null, value, oldValue)
    }
  }
  // 对于计算属性，当取值计算属性时，发现属性的watcher的dirty是true，说明数据不是最新的，需要重新计算，这里就是重新计算属性的值
  evaluate() {
    this.value = this.get()
    this.dirty = false
  }
  // 收集依赖
  depend() {
    this.deps.forEach(dep => {
      dep.depend()
    })
  }
  tearDown() {
    if (!this.active) return
    this.deps.forEach(dep => {
      dep.removeSub(this)
    })
    this.active = false
  }
}


// Watcher扮演的角色是订阅者/观察者，他的主要作用是为观察属性提供回调函数以及收集依赖（如计算属性computed，vue会把该属性所依赖的dep添加到自身的deps中）
// 当被观察的值发生变化时，会接收到来自dep的通知，从而触发回调函数。
// 侦听器watcher(normal-watcher): 在Vue.$prototype.$watch中定义
//   我们在钩子函数watch中定义的。只要监听的属性改变了，都会触发定义好的回调函数。
//   这类watch的expression是计算属性中的属性名
// 渲染watcher(render-watcher): 在mountComponent中定义
//   每一个组件都有一个render-watch，当data/computed中的属性改变的时候，会调用该render-watch来更新组件的视图。
//   这类watch的expression是 function() {vm._update(Vm._render(), hydrating)}
// 计算属性watcher(computed-watcher):在initComputed中定义
//   我们在组件钩子函数computed中定义的。每一个computed属性，最后都会生成一个对应的watcher对象，这类watcher有一个特点：当计算属性依赖于其它数据时，属性
//   并不会立即重新计算，只有之后其它地方需要读取属性的时候，他才会真正计算，即具备lazy特性。这类watch的expression是我们写的回调函数的字符串形式

// 处理功能上的区别，这三种watcher也有固定的执行顺序，分别是computed-watcher -> normal-watcher -> render-watcher
// 这么安排的原因是尽可能的保证，在更新组件视图的时候，computed属性已经是最新值了。
// 如果render-watcher排在computed-watcher前面，就会导致页面更新的时候computed值为旧数据