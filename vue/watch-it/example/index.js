new Vue({
  el: document.querySelector('#root'),
  data: {
    name: 'along',
    age: 27,
  },
  computed: {
    fullName() {
      return this.name + ' shao'
    }
  },
  events: {
    '.btn-add': {
      click() {
        this.age++
      }
    },
    '.btn-sub': {
      click() {
        this.age--
      }
    },
    '.btn-clear': {
      click() {
        this.name = ''
      }
    },
    input: {
      change(e) {
        const el = e.target
        const key = el.getAttribute('v-bind')
        const oldVal = this[key]
        const val = el.value 
        console.log(oldVal, val, key)
        this[key] = typeof oldVal === 'number' ? +val : val
      }
    }
  },
  render() {
    return `
    <form>
      <div class="form-row">
        age: ${this.age}
        <button class="btn-sub">-</button>
        <input type="range" min="0" max="100" value="${this.age}" v-bind="age">
        <button class="btn-add">+</button>
      </div>
      <div class="form-row">
        name: <input value="${this.name}" v-bind="name">
        <button class="btn-clear">x</button>
      </div>
    </form>
    <div class="message">你好，我是 ${this.fullName}，我今年${this.age}岁，我${this.age < 18 ? '还是个孩纸' : this.age > 60 ? '退休了' : '是成年人'}。</div>
    `
  }
})