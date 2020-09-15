let uid = 0
let targetStack = []

class Dep {
  constructor() {
    this.id = ++uid
    this.subs = []
  }

  // 添加订阅者
  addSub(watcher) {
    this.subs.push(watcher)
  }

  // 删除订阅者
  removeSub(watcher) {
    const index = this.subs.indexOf(watcher)
    if (index > -1) {
      this.subs.splice(index, 1)
    }
  }

  // 通知订阅者
  notify() {
    console.log('notify', this)
    var subs = this.subs.slice();
    for (var i = 0; i < subs.length; i++) {
      subs[i].update()
    }
  }

  // 建立与当前watcher的依赖关系
  depend() {
    Dep.target.addDep(this)
  }
}

Dep.target = null
Dep.pushTarget = function(target) {
  // 在一次依赖收集期间，如果有其他依赖收集任务开始（比如：当前 computed 计算属性嵌套其他 computed 计算属性），
  // 那么将会把当前 target 暂存到 targetStack，先进行其他 target 的依赖收集，
  if (Dep.target) targetStack.push(Dep.target)
  Dep.target = target
}
Dep.popTarget = function() {
  // 当嵌套的依赖收集任务完成后，将 target 恢复为上一层的 Watcher，并继续做依赖收集
  Dep.target = targetStack.pop()
}

module.exports = Dep


// Observer是对数据的数据监听，Dep是一个订阅器。每一个被监听的数据都有一个Dep实例，Dep实例里面存放了N多个订阅者(观察者)对象Watcher
// 被监听的数据进行取值操作时(getter)，如果存在Dep.target(某一个观察者),则说明这个观察者是依赖该数据的(如计算属性中，
// 计算某一属性会用到其它已经被监听的数据，就说该属性依赖于其它属性，会对其他属性进行取值)，就会把这个观察者添加到该数据的订阅器subs里面，
// 留待后面数据变更时通知(会先通过观察者id判断订阅器中是否已经存在该观察者)，同时该观察者也会把该数据的订阅器dep添加到自身deps中，方便其他地方使用
// 被监听的数据进行赋值操作时(setter)时，就会触发dep.notify()，循环该数据订阅器中的观察者，进行更新操作。
// 具体流程如下：
//   observer -> 
//   walk -> 
//   defineReactive -> 
//   get -> 
//   dep.depend() -> 
//   watcher.addDep(new Dep()) -> 
//   watcher.newDeps.push(dep) -> 
//   dep.addDep(new Watcher()) -> 
//   dep.subs.push(watcher)

// computed: {
//   fullName() {
//     return this.firstName + this.lastName
//   }
// }
// 1.defineComputed(this, 'fullName', () => this.computed.fullName.call(this))
// 2.new Watcher(() => this.computed.fullName.call(vm), () => {}, { lazy: true })
// 3.defineReactive(this, 'fullName', { get })
// 4.watcher.evaluate
// 5.watcher.get
// 6.Dep.target = fullName的watcher
// 7.执行getter(() => this.computed.fullName.call(this))
// 8.取值firstName和lastName即分别的getter
// 9.dep.depend()建立依赖关系
// 10.Dep.target.addDep(firstName的dep和lastName的dep)
// 11.firstName的dep和lastName的dep的deps.push(Dep.target即fullName的watcher)

// watch: {
//   firstName(val, oldValue) {
//     console.log('监听到了firstName改变')
//   }
// }
// 0.new Watcher('firstName', this.watch.fullName)
// 1.observer(this)
// 2.defineReactive(this, 'firstName', { get })
// 3.dep.depend()建立依赖关系 此时Dep.target 是firstName的watcher
// 4.Dep.target.addDep(firstName的dep)
// 5.firstName的dep.addDep(Dep.target即firstName的watcher)
// 6.当对firstName赋值时触发firstName的set
// 7.firstName的dep.notify()
// 8.firstName的watcher.update()
// 9.firstName的watcher.run()
// 10.this.watch.fullName()
