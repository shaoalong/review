1. setInterval/setInterval传入的函数如果是箭头函数，就会保留作用域。当把上下文环境设为null也不会成功(因对原上下文环境中的作用域有引用，所以不会回收)
var global
let config = {
    alert: setInterval(() => {console.log('Alert')}, 1000),
}
config = null
console.log(config)

2.被freeze的对象，不可添加删除修改
const box = { x: 10, y: 20 }
Object.freeze(box)
const shape = box
shape.x = 100
console.log(shape)

3.自动分号插入。
function nums(a, b) {
    if (a > b)
        console.log('a is bigger')
    else
        console.log('b is bigger')
    return
    a + b
}
console.log(nums(3,6)) // undefined

4. 对象相同属性，后面的值会覆盖之前的值，但位置任然是前面
const obj = {
    a: 1,
    b: 2,
    a: 3
}
console.log(obj)

5.String.raw:是用来获取一个模板字符串的原始字符串的
var path = 'Documents\Projects\table.html'
var pathRaw = String.raw`C:\Documents\Projects\table.html`
console.log(path) // DocumentsProjects	able.html
console.log(pathRaw) // C:\Documents\Projects\table.html
console.log(String.raw`C:\y${path}`) // C:DocumentsProjects	able.html
console.log(String.raw`C:\Documents\Projects\table.html`) // C:\Documents\Projects\table.html

6.JSON和JSON.parse()与JSON.stringify()
JSON:JavaScript Object Notation
将JS数据结构转化为JSON字符串: JSON.stringify(value[, replacer [, space]]); 
value:js数据结构。
replacer:如果是函数，那么序列化过程中的每个属性都白这个函数处理；如果是数组，那么只有包含在数组里的属性才会被序列化到JSON字符串中
space:转化为JSON字符串缩进用的空白字符；如果是数字就表示空格的个数，如果是字符串就表示用该字符串代替空格

class Node {
    constructor(data) {
        this.data = data
        this.next = null
    }
}
class LList {
    constructor() {
        this.head = new Node('head')
    }
    insert(el, data) {
        let currentNode = this.head
        const node = new Node(data)
        while (currentNode.next !== null && currentNode.data !== el) {
            currentNode = currentNode.next
        }
        node.next = currentNode.next
        currentNode.next = node
    }
    display() {
        let currentNode = this.head
        let result = []
        while (currentNode !== null) {
            result.push(currentNode.data)
            currentNode = currentNode.next
        }
        console.log(result.splice(1))
    }
}
const l1 = new LList()
l1.insert('head', 1)
l1.insert(1, 2)
l1.insert(2, 4)
l1.display()

const l2 = new LList()
l2.insert('head', 1)
l2.insert(1, 3)
l2.insert(3, 4)
l2.display()

console.log(l1.head)
console.log(l2.head)
function combine(l1, l2) {
    if (l1 === null) {
        return l2
    }
    if (l2 === null) {
        return l1
    }
    if (l1.data < l2.data) {
        l1.next = combine(l1.next, l2)
        return l1
    } else {
        l2.next = combine(l2.next, l1)
        return l2
    }
}
const l3Node = combine(l1.head.next, l2.head.next)
const l3 = new LList()
l3.head.next = l3Node
l3.display()
l1.display()
l2.display()



function largeNumMult(str1, str2) {
    const str1Len = str1.length
    const str2Len = str2.length
    if (str1Len <= 2 || str2Len <= 2) {
        return str1 * str2
    }
    let str1LenMid = Math.floor(str1Len / 2)
    let str2LenMid = Math.floor(str1Len / 2)
    let str1Pow = Math.pow(10, str1LenMid)
    let str2Pow = Math.pow(10, str2LenMid)
    let a1 = str1.slice(0, str1LenMid)
    let a2 = str1.slice(str1LenMid).replace(/^0*/, '')
    let b1 = str2.slice(0, str2LenMid)
    let b2 = str2.slice(str2LenMid).replace(/^0*/, '')
    console.log(a1, str1Pow, a2, b1, str2Pow, b2)
    return largeNumMult(a1, b1) * str1Pow * str2Pow + largeNumMult(a1, b2) * str1Pow + largeNumMult(a2, b1) * str2Pow + largeNumMult(a2, b2)
}
console.log(largeNumMult('72106547548473106236', '982161082972751393'))
var num = '1020'
let str1LenMid = Math.floor(4 / 2)
let str1Pow = Math.pow(10, str1LenMid)
console.log(str1LenMid)
console.log(str1Pow)
console.log(num.replace(/^0*/, ''))




var template = "{{name}}很厉害，才{{age}}岁"
var context = {name: 'bottle', age: '15'}
var render = function(template, context) {
    return template.replace(/\{\{(.*?)\}\}/g, (match, key, index, source) => {
        console.log(match, key, index, source)
        return context[key.trim()]
    })
}
console.log(render(template, context))