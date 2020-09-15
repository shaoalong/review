export default {
    install: (param) => {
        const vue = param;
        vue.mixin({
            beforeCreate() {
                if (this.$options && this.$options.store) {
                    this.$store = this.$options.store
                } else {
                    this.$store = this.$parent && this.$parent.$store
                }
            }
        })
    }
};

可见，store注入vue的实例组件的方式是通过vue的mixin机制，借助vue组件的生命周期钩子beforeCreate完成的。
即每个vue组件实例化过程中，会在beforeCreate钩子前调用vuexInit方法。


function resetStoreVM (store, state, hot) {
    var oldVm = store._vm;
  
    // 运用计算属性computed构建getters
    store.getters = {};
    var wrappedGetters = store._wrappedGetters;
    var computed = {};
    forEachValue(wrappedGetters, function (fn, key) {
      // use computed to leverage its lazy-caching mechanism
      // direct inline function use will lead to closure preserving oldVm.
      // using partial to return function with only arguments preserved in closure enviroment.
      computed[key] = partial(fn, store);
      Object.defineProperty(store.getters, key, {
        get: function () { return store._vm[key]; },
        enumerable: true // for local getters
      });
    });
  
    // use a Vue instance to store the state tree
    // suppress warnings just in case the user has added
    // some funky global mixins
    var silent = Vue.config.silent;
    Vue.config.silent = true;
    store._vm = new Vue({
      data: {
        $$state: state
      },
      computed: computed
    });
    Vue.config.silent = silent;
  
    // enable strict mode for new vm
    if (store.strict) {
      enableStrictMode(store);
    }
  
    if (oldVm) {
      if (hot) {
        // dispatch changes in all subscribed watchers
        // to force getter re-evaluation for hot reloading.
        store._withCommit(function () {
          oldVm._data.$$state = null;
        });
      }
      Vue.nextTick(function () { return oldVm.$destroy(); });
    }
  }
  我们可以看出Vuex的state状态是响应式的，是借助vue的data响应式，将state存入实例组件的data中；
  Vuex的getters则是借助vue的计算属性computed实现数据实时监听。

  总结：Vuex是通过全局注入store对象，来实现组件间的状态共享。在大型复杂的项目中，需要实现一个组件更改某个数据，
  多个组件自动获取更改后的数据进行业务逻辑处理，这时使用Vuex比较合适。
