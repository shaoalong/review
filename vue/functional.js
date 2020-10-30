export default {
    name: 'tableRender',
    functional: true,
    props: {
        row: Object,
        index: Number,
        render: Function,
    },
    data: {},
    children: [],
    render: (h, ctx) => {
        const params = {
            row: ctx.props.row,
            index: ctx.props.index
        };
        return ctx.props.render(h, params);
    }
};

// 动态dialog组件
import Vue from 'vue'
// width 单位px
// 最小宽度360，最大宽度1200，计算公式：16*2 + 160*N + (N-1)*8
// 2: 360, 3: 528, 4: 696, 5: 864, 6: 1032, 7: 1200
const KyeDialog = Vue.component('kye-dialog', {
  functional: true,
  render (h, self) {
    self.props.width = self.props.width || '360px'
    if (typeof self.props.width === 'number') {
      if (self.props.width > 1) {
        let width = self.props.width * 212 + (self.props.width - 1) * 8 + 48
        self.props.width = `${width > 1200 ? 1200 : width}px`
      } else {
        self.props.width = '360px'
      }
    }
    if (self.props.hasOwnProperty('view')) {
      self.props.customClass = 'kye-dialog-dynamic'
    }
    if (!self.props.hasOwnProperty('closeOnClickModal')) {
      self.props.closeOnClickModal = false
    }
    if (!self.props.hasOwnProperty('closeOnPressEscape')) {
      self.props.closeOnPressEscape = false
    }
    if (!self.props.hasOwnProperty('appendToBody')) {
      self.props.appendToBody = true
    }
    let directives = self.data.directives || []
    self.data.directives = [...directives, { name: 'drag' }, { name: 'next' }]
    let onClose = self.listeners.close
    let $on = {
      close: () => {
        // 关闭时发送事件：解绑动态组件，解决再次打开时数据缓存的问题
        if (self.listeners['update:view']) {
          self.listeners['update:view'](null)
        }
        if (onClose) {
          onClose()
        }
      }
    }
    self.data.on = { ...self.data.on, ...self.listeners, ...$on }
    self.data.attrs = { ...self.data.attrs, ...self.props }
    return h(
      'el-dialog',
      self.data,
      self.children && self.children.map(t => {
        if (t.data && t.data.attrs) {
          t.data.attrs = { ...t.data.attrs, ...(t.componentOptions && t.componentOptions.propsData) }
        }
        if (t.data && t.data.on === undefined) {
          t.data.on = t.data.on || (t.componentOptions && t.componentOptions.listeners)
        }
        return h(
          (t.componentOptions && t.componentOptions.tag) || t.tag,
          t.data,
          t.children || (t.componentOptions && t.componentOptions.children)
        )
      })
    )
  }
})
export default KyeDialog

data: 传递给组件的 data 对象,作为 createElement 的第二个参数传入组件
    attrs(Object): 组件传进来的所有属性，排除掉class/staticClass/style和props显式声明的属性
    on(Object): 组件通过v-on(@)绑定的事件,需要通过this.$emit触发
    nativeOn(Object): 组件通过@xxx.native绑定的事件
    class(Object): 组件的动态class属性
    staticClass(String): 组件的静态class属性
    style(Object): 组件的动态style属性
    staticClass(Object): 组件的静态style属性
props: 如果不声明该属性，该值为data.attrs;如果声明了该属性，那么该值为声明的属性，且data.attrs的值会排除掉props中声明的属性。
listeners: 一个包含了组件上所注册的 v-on 侦听器的对象。这只是一个指向 data.on 的别名
children:  VNode子节点数组