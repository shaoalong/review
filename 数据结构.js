// 数据结构是计算机编程中对数据存储最基本的操作，不同的数据结构适用于不同的业务场景。如今大部分情况都是调用开发API封装好的类库，直接调用，
// 几乎不需要程序员再去深究其中背后实现的逻辑，大大简化和减低了对程序员的要求。正式这种知其然不知其所以然，导致很多程序员缺少对于底层结构的了解，
// 分不清不同数据结构之间的性能差异，导致很多系统性能问题。

// 列表：
//     定义: 列表是处理一组有序项目的数据结构，即你可以在一个列表中储存一个序列的项目。
//     需求: 购物清单、待办事项列表、十佳榜单、最后十名榜单等。当不需要在一个很长的序列中储存元素，或者对其排序或查找时，列表尤为有用。反之，如果数据结构非常复杂，列表的作用就没有那么大了。
//     class List {
//       constructor() {
//         this.dataStore = []
//         this.listSize = 0
//         this.pos = 0
//       }
//       append(element) {
//         this.dataStore.push(element)
//         this.listSize++
//       }
//       insert(element, val) {
//         const index = this.dataStore.indexOf(element)
//         if (index > -1) {
//           this.dataStore.splice(index + 1, 0, val)
//           this.listSize++
//         } else {
//           throw new Error('cann’t find element')
//         }
//       }
//       remove(element) {
//         const index = this.dataStore.indexOf(element)
//         if (index > -1) {
//           this.dataStore.splice(index, 1)
//           this.listSize--
//         } else {
//           throw new Error('cann’t find element')
//         }
//       }
//       clear() {
//         this.dataStore = []
//         this.listSize = 0
//         this.pos = 0
//       }
//       prev() {
//         this.pos--
//         if (this.pos <= 0) {
//           this.pos = 0
//         }
//       }
//       next() {
//         this.pos++
//         if (this.pos >= this.listSize) {
//           this.pos = this.listSize - 1
//         }
//       }
//       front() {
//         this.pos = 0
//       }
//       end() {
//         this.pos = this.listSize - 1
//       }
//       moveTo(position) {
//         this.pos = position
//       }
//       getElement() {
//         return this.dataStore[this.pos]
//       }
//       contains(element) {
//         const index = this.dataStore.indexOf(element)
//         return index > -1
//       }
//       length() {
//         return this.listSize
//       }
//       display() {
//         console.log(this.dataStore)
//       }
//     }

//     const goodsList = new List()
//     goodsList.append('a')
//     goodsList.append('b')
//     goodsList.append('c')
//     goodsList.append('d')
//     goodsList.display()

//     goodsList.next()
//     const current = goodsList.getElement()
//     console.log(current)

//     goodsList.insert('b', 'b1')
//     goodsList.display()
// 队列：
//     定义: 特殊的列表，只能在队尾插入，队首删除。是一种“先进先出”的数据结构。
//     需求: 排队、多系统之间消息通知、订单处理、日志系统等
//     class Queue {
//       constructor() {
//         this.dataStore = []
//       }
//       enqueue(element) {
//         this.dataStore.push(element)
//       }
//       dequeue() {
//         return this.dataStore.shift()
//       }
//       isEmpty() {
//         return !this.dataStore.length
//       }
//       show() {
//         console.log(this.dataStore)
//       }
//     }
//     // 基数排序
//     function baseSort(arr) {
//       const queues = new Array(10).fill(0).map(() => new Queue());
//       function digitySort(arr, digity) {
//         if (digity === 1) {
//           arr.forEach(item => {
//             queues[item % 10].enqueue(item)
//           })
//         }
//         if (digity === 10) {
//           arr.forEach(item => {
//             queues[Math.floor(item / 10)].enqueue(item)
//           })
//         }
//         const result = [];
//         queues.forEach(queue => {
//           while (!queue.isEmpty()) {
//             result.push(queue.dequeue())
//           }
//         })
        
//         return result
//       }

//       return digitySort(digitySort(arr, 1), 10)
//     }
//     const arr = [1,23,42,2,9,4]
//     console.log(baseSort(arr))

// 栈：
//     定义: 特殊的列表，只能在列表的一端操作，这一端叫做栈顶。是一种“先进后出”的数据结构。
//     需求: 函数的调用、递归、进制转换、括号匹配等
//     class Stack{
//       constructor () {
//         this.dataStore = [];
//         this.top = 0;
//       }
//       push(element) {
//         this.dataStore[this.top++] = element
//       }
//       pop() {
//         return this.dataStore[--this.top]
//       }
//       peek() {
//         return this.dataStore[this.top - 1]
//       }
//       length() {
//         return this.top
//       }
//     }

//     function mulBase(targetType) {
//       return function(val) {
//         const stack = new Stack()
//         let num = val
//         do {
//           stack.push(num % targetType)
//           num = Math.floor(num / targetType)
//         } while (num > 0)
//         let result = []
//         while (stack.length()) {
//           result.push(stack.pop())
//         }
//         return result.join('')
//       }
//     }

//     const mulBase2 = mulBase(2)
//     const mulBase8 = mulBase(8)
//     console.log(mulBase2(11))
//     console.log(mulBase8(11))
链表：
    定义: 链表是物理存储单元上非连续、非顺序的存储结构。数据元素的逻辑顺序是通过链表中的指针链接次序实现的。
    需求: 除了对数据的随机访问，链表几乎可以在任何可以使用一维数组的情况中。如果需要随机访问，数组任然是更好的选择。
// 字典：