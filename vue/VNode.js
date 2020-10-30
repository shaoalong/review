class VNode {
  constructor(tag, data, children, text, elm, context, componentOptions, asyncFactory) {
    this.tag = tag // 节点标签名
    this.data = data // 节点对应的对象，包含了具体的一些数据信息
    this.children = children // 节点的子节点
    this.text = text  // 节点的文本
    this.elm = elm // 虚拟节点对应的真实dom节点
    this.ns = undefined // 节点的命名空间
    this.context == context // 节点的编译作用域
    this.functionalContext = undefined // 函数化组件作用域.如果不是函数组件该值为undefined
    this.functionalOptions = undefined
    this.functionalScopeId = undefined
    this.key = data && data.key // 节点的key属性，被当作节点的标志，用以优化
    this.componentOptions = componentOptions // 组件的option选项
    this.componentInstance = undefined // 节点对应的组件实例
    this.parent = undefined // 节点的父节点
    this.raw = false // 简而言之就是是否为原生HTML或只是普通文本，innerHTML的时候为true，textContent的时候为false
    this.isStatic = false // 是否为静态节点
    this.isRootInsert = true // 是否作为根节点插入
    this.isComment = false // 是否为注释节点
    this.isCloned = false // 是否是克隆节点
    this.isOnce = false // 是否有v-once指令
    this.asyncFactory = asyncFactory
    this.asyncMeta = undefined
    this.isAsyncPlaceholder = false
  }
  get child() {
    return this.componentInstance
  }
}

// 从上面的代码可以看出，vnode只是一个名字，本质上来说就是一个普通的JavaScript对象，是从VNode类实例化的对象。
// 我们用这个JavaScript对象来描述一个真实DOM元素的话，那么该DOM元素上的所有属性在VNode这个对象上都存在对应得属性。
// 简单来说，vnode可以理解成节点描述对象，他描述了应该怎样去创建真实的DOM节点。
// 例如，tag表示一个元素节点的名称，text表示一个文本节点的文本，children表示子节点等。
// vnode表示一个真实的DOM元素，所有真实的DOM节点都是用vnode创建并插入到页面中。

// VNode类型：
// 1.注释节点：一个注释节点只有两个有效属性 text 和 isComment。其余属性全是默认undefined或者false
//   const createEmptyVNode = text => {
//     const node = new VNode()
//     node.text = text;
//     node.isComment = true;
//     return node
//   }
//   console.log(createEmptyVNode('我是注释节点'))

// 2.文本节点：一个注释节点只有一个有效属性 text 
//   const createTextVNode = (val) => {
//     return new VNode(undefined, undefined, undefined, String(val))
//   }
//   console.log(createTextVNode('我是文本节点'))

// 3. 克隆节点:
//     克隆节点是将现有节点的属性赋值到新节点中，让新创建的节点和被克隆的节点的属性保持一致，从而实现克隆效果。它的作用是优化静态节点和插槽节点（slot node）。
//     以静态节点为例，当组件内某个状态发生变化后，当前组件会通过虚拟DOM重新渲染视图，静态节点因为它的内容不会改变，
//     所以除了首次渲染需要执行渲染函数获取vnode之外，后续更新不需要执行渲染函数重新生成vnode。
//     因此，这是就会使用创建克隆节点的方法将vnode克隆一份，使用克隆节点进行渲染。这样就不需要执行渲染函数生成新的静态节点的vnode，从而提升一定的性能。
//     克隆节点和被克隆节点位移的区别是isCloned属性，克隆节点为true，被克隆的原始节点为false。
//     const cloneVNode = (vnode, deep) => {
//       const cloned = new VNode(vnode.tag, vnode.data, vnode.children, vnode.text, vnode.elm, vnode.context, vnode.componentOptions, vnode.asyncFactory)
//       cloned.ns = vnode.ns
//       cloned.isStatic = vnode.isStatic
//       cloned.key = vnode.key
//       cloned.isComment = vnode.isComment
//       cloned.isCloned = true
//       if (deep && vnode.children) {
//         cloned.children = cloneVNodes(vnode.children)
//       }
//       return cloned
//     }

// 4.元素节点:
//   元素节点通常会存在以下4中有效属性
//     tag：tag就是一个节点的名称，例如 p、ul、li和div等。
//     data：改属性包含了一些节点上的数据，比如attrs、class和style等。
//     children：当前节点的子节点列表。
//     context：它是当前组件的Vue.js实例

// 5. 组件节点:
//   组件节点和元素节点类似，有以下两个独有的属性
//     componentOptions:组件节点的选项参数，其中包含propsData、tag、children等信息
//     componentInstance:组件的实例
//   一个组件节点，对应得vnode是下面这样：
//     {
//       componentOptions: {Ctor: '', children: undefined, listeners: {close: Function}, propsData: {}, tag: ''},
//       componentInstance: VueComponent,
//       context: VueComponent,
//       data: {},
//       tag: "vue-component-1-child",
//       ...
//     }