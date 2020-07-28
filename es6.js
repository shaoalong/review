// 单纯的解构赋值,可以复制继承自原型对象的属性
// 扩展运算符的解构赋值，不能复制继承自原型对象的属性
// const o = Object.create({
//     x: 1,
//     y: 2
// });
// o.z = 3;

// let {
//     x,
//     ...newObj
// } = o;
// let {
//     y,
//     z
// } = newObj;
// console.log(x) // 1             x是单纯的解构赋值，所以可以读取对象o继承的属性
// console.log(y) // undefined     变量y和z是扩展运算符的解构赋值，只能读取对象o自身的属性，变量y取不到值
// console.log(z) // 3             所以变量z可以赋值成功

// let o1 = {
//     a: 1
// };
// let o2 = {
//     b: 2
// };
// o2.__proto__ = o1;
// let {
//     ...o3
// } = o2;
// console.log(o3)
// console.log(o3.a)

// 拷贝
// const obj = {}
// const clone1 = {
//     __proto__: Object.getPrototypeOf(obj),
//     ...obj
// }
// const clone2 = Object.assign(Object.create(Object.getPrototypeOf(obj)), obj)
// const clone3 = Object.create((Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj)));

// // assign对于set 处理为undefined，get处理成 返回字段，最终返回的是属性并非方法
// const source = {
//     set foo(value) {
//         console.log(value);
//     },
//     get foo() {
//         return 'heihei'
//     },
//     getName() {
//         return 'haha'
//     }
// };
// // 若想继承setter或者getter就用getOwnPropertyDescriptors
// const target1 = {};
// Object.assign(target1, source);
// // Object.defineProperties(target1, Object.getOwnPropertyDescriptors(source))
// console.log(Object.getOwnPropertyDescriptors(target1))

// 内置的Symbol值
// 1.Symbol.hasInstance:指向一个内部方法。当其他对象使用instanceof运算符，判断是否为该对象的实例时，会调用这个方法
// class MyClass {
//     [Symbol.hasInstance](foo) {
//         return foo instanceof Array;
//     }
// }
// console.log([1,2,3] instanceof new MyClass()) // true

// class Even {
//     static [Symbol.hasInstance](obj) {
//         return Number(obj) % 2 === 0;
//     }
// }
// // 等价于
// // const Even = {
// //     [Symbol.hasInstance](obj) {
// //         return Number(obj) % 2 === 0;
// //     }
// // }
// console.log(2 instanceof Even)

// 2.Symbol.isConcatSpreadable:一个布尔值，表示该对象用于Array.prototype.concat()时，是否可以展开;数组的默认行为是可以展开，Symbol.isConcatSpreadable默认等于undefined。该属性等于true时，也有展开的效果
// let arr = [4,5,6]
// console.log([1,2,3].concat(...arr))
// console.log([1,2,3].concat(arr))
// console.log([1,2,3].concat(arr,7,8))
// arr[Symbol.isConcatSpreadable] = false;
// console.log([1,2,3].concat(arr)) // [1,2,3,[4,5,6]]
// console.log(arr.concat([1,2,3])); // [[4,5,6],1,2,3]

// class A1 extends Array {
//     constructor(args) {
//         super(args);
//         this[Symbol.isConcatSpreadable] = true
//     }
// }
// class A2 extends Array {
//     constructor(args) {
//         super(args);
//     }
//     get [Symbol.isConcatSpreadable]() {
//         return false;
//     }
// }
// let a1 = new A1();
// a1[0] = 3;
// a1[1] = 4;
// let a2 = new A2();
// a2[0] = 5;
// a2[1] = 6;
// console.log([1, 2].concat(a1).concat(a2)) // [ 1, 2, 3, 4, [ 5, 6 ] ]

// 3.Symbol.species:属性指向用来创建派生类对象的构造函数,即：this.constructor[Symbol.species]属性存在就会使用这个属性创建对象实例。
// class CustomerClass {
//     constructor(age) {
//         this.name = 'CustomerClass'
//         this.age = age
//     }
// }
// class MyArray extends Array {
//     static get[Symbol.species]() {
//         return CustomerClass;
//     }
// }

// const a = new MyArray(1, 2, 3);
// const b = a.map(x => x);
// const c = a.filter(x => x > 1);
// const d = a.map(x => x * x);
// console.log(a) // [1,2,3]
// console.log(b) // {'0': 1, '1': 2, '2': 3, 'name': 'CustomerClass', 'age': 3}
// console.log(c) // {'0': 2, '1': 3, 'name': 'CustomerClass', 'age': 0}
// console.log(d) // {'0': 1, '1': 4, '3': 9, 'name': 'CustomerClass', 'age': 3}
// console.log(a instanceof MyArray) // true
// console.log(b instanceof CustomerClass) // true
// console.log(c instanceof CustomerClass) // true
// // map的实现
// // Array.prototype.map = function (callback) {
// //     var Species = this.constructor[Symbol.species];
// //     console.log(Species)
// //     var returnValue = new Species(this.length);
// //     this.forEach(function (item, index, array) {
// //         returnValue[index] = callback(item, index, array);
// //     });
// //     return returnValue;
// // }

// 4.Symbol.iterator:指向该对象的默认遍历器方法;对象遍历的时候的遍历器
// const myIterator = {};
// myIterator[Symbol.iterator] = function* () {
//     yield 1;
//     yield 2;
//     yield 3;
// };
// console.log([...myIterator])

// class Collection {
//     *[Symbol.iterator]() {
//         let i = 0;
//         while (this[i] !== undefined) {
//             yield this[i];
//             ++i;
//         }
//     }
// }
// const myCollection = new Collection();
// myCollection[0] = 1;
// myCollection[1] = 2;
// for (let value of myCollection) {
//     console.log(value)
// }

// 5.Symbol.toPrimitive:指向一个方法。该对象被转为原始类型的值时，会调用这个方法，返回该对象对应的原始类型值。
// let obj = {
//     [Symbol.toPrimitive](hint) {
//       switch (hint) {
//         case 'number':
//           return 123;
//         case 'string':
//           return 'str';
//         case 'default':
//           return 'default';
//         default:
//           throw new Error();
//        }
//      }
//   };
//   console.log(2 * obj) // 246
//   console.log(+ obj) // 123
//   console.log(3 + obj) // '3default'
//   console.log('h' + obj) // 'hdefault'
//   console.log(obj == 'default') // true
//   console.log(String(obj)) // 'str'

// let ab = {
//     valueOf() {
//         return 0;
//     },
//     toString() {
//         return '1';
//     },
//     [Symbol.toPrimitive]() {
//         return 2;
//     }
// };
// console.log(1 + ab);
// console.log('1' + ab);
// // Symbol.toPrimitive方法在转换基本类型的时候优先级最高。

// 6.Symbol.toStringTag:指向一个方法。在该对象上面调用Object.prototype.toString方法时，如果这个属性存在，它的返回值会出现在toString方法返回的字符串之中，表示对象的类型
// const obj1 = {
//     [Symbol.toStringTag]: 'Foo'
// }
// console.log(obj1.toString()) // [object Foo]

// class Collection {
//     get [Symbol.toStringTag]() {
//         return 'xxx';
//     }
// }
// const x = new Collection();
// console.log(Object.prototype.toString.call(x)) // [object xxx]


// 7.Symbol.unscopables:指向一个对象。该对象指定了使用with关键字时，哪些属性会被with环境排除。

// const wm = new WeakMap();


// (() => {
//     let key = {};
//     let obj = { foo: 1 };
//     wm.set(key, obj);
// })()

// console.log(wm)
// obj = null;
// key = null;
// console.log(wm.get(key))


// const ob = new Object();
// let val = { ob: 'heihei'};
// ob.value = val;
// console.log(ob)
// val.newVal = 'haha'
// console.log(ob)

// set中的receiver表示绑定的上下文
// receiver指向操作对象；如果set中传参了receiver，即对Proxy实例赋值，会调用defineProperty
// var handler = {
//     defineProperty (target, key, descriptor) {
//         console.log('defineProperty', key)
//         return Reflect.defineProperty(target, key, descriptor)
//     },
//     // set(target, key, val, receiver) {
//     //     console.log('set')
//     //     Reflect.set(target, key, val, receiver)
//     // }
// };
// let _receiver = {_test: 2};
// var v = {
//     _test: 0,
//     set test(val) {
//         this._test = val
//     },
//     get test() {
//         return this._test;
//     }
// };
// var proxy = new Proxy(v, handler);
// proxy.test = 3;
// console.log(proxy.test)
// console.log(v.test)
// console.log(_receiver._test)


// var myObject = {
//     foo: 1,
//     bar: 2,
//     get baz() {
//       return this.foo + this.bar;
//     },
//   }

//   console.log(myObject.baz)

// const ages = [11, 33, 12, 54, 18, 96];
// // 旧写法
// // const youngest = Math.min.apply(Math, ages);
// // const oldest = Math.max.apply(Math, ages);
// // const type = Object.prototype.toString.call(youngest);
// // 新写法
// const youngest = Reflect.apply(Math.min, Math, ages)
// const oldest = Reflect.apply(Math.max, Math, ages)
// const type = Reflect.apply(Object.prototype.toString, youngest, [])
// console.log(youngest)
// console.log(oldest)
// console.log(type)



// const p = new Proxy({}, {
//     defineProperty(target, prop, descriptor) {
//       console.log('defineProperty');
//       return Reflect.defineProperty(target, prop, descriptor);
//     },
//     // set(target, key, val) {
//     //     console.log('set');
//     //     return Reflect.set(target, key, val);
//     // }
//   });

//   p.foo = 'bar';
//   // {value: "bar", writable: true, enumerable: true, configurable: true}

//   p.foo // "bar"

// promise的抛错不会影响外面的进程
// const someAsyncThing = function() {
//     return new Promise(function(resolve, reject) {
//       // 下面一行会报错，因为x没有声明
//       resolve(x + 2);
//     });
//   };

//   someAsyncThing().then(function() {
//     console.log('everything is great');
//   });

//   setTimeout(() => { console.log(123) }, 2000);


// function getFoo() {
//   return new Promise((resolve) => resolve('foo'))
// }

// const g = function* () {
//   try {
//     const foo = yield getFoo();
//     const bar = yield getFoo();
//     console.log(foo);
//     console.log(bar);
//   } catch (e) {
//     console.log(e)
//   }
// }

// function run (generator) {
//   const it = generator();
//   function go(result) {
//     if (result.done) {
//       return result.value;
//     }
//     return result.value.then(function(value) {
//       return go(it.next(value))
//     }, function(error) {
//       return go(it.throw(error))
//     })
//   }
//   go(it.next())
// }

// run(g)


// function Obj(val) {
//   this.value = val;
//   this.next = null;
// }

// Obj.prototype[Symbol.iterator] = function() {
//   var iterator = { next: next };
//   var current = this;
//   function next() {
//     if (current) {
//       var value = current.value;
//       current = current.next;
//       return { done: false, value: value};
//     } else {
//       return { done: true }
//     }
//   }
//   return iterator;
// }

// var one = new Obj(1);
// var two = new Obj(2);
// var three = new Obj(3);

// one.next = two;
// two.next = three;

// for (var i of one){
//   console.log(i); // 1, 2, 3
// }


// let obj = {
//   data: ['hello', 'world'],
//   [Symbol.iterator]() {
//     const self = this;
//     let index = 0;
//     return {
//       next() {
//         if (index < self.data.length) {
//           return {
//             value: self.data[index++],
//             done: false
//           }
//         } else {
//           return {
//             value: undefined,
//             done: true
//           }
//         }
//       }
//     }
//   }
// }

// for (var i of obj){
//   console.log(i);
// }

// function* genFuncWithReturn() {
//   yield 'a';
//   yield 'b';
//   return 'The result';
// }
// function* logReturned(genObj) {
//   let result = yield* genObj;
//   console.log(result);
// }

// console.log([...logReturned(genFuncWithReturn())]);
// let x = genFuncWithReturn();
// console.log(...x);

// function* foo() {
//   yield 2;
//   yield 3;
//   return "foo";
// }

// function* bar() {
//   yield 1;
//   var v = yield* foo();
//   console.log("v: " + v);
//   yield 4;
// }

// for (let c of bar()) {
//   console.log(c)
// }


// const getBarPromise = () => {
//   console.log('immediately bar')
//   return new Promise(resolve => {
//     setTimeout(() => {
//       console.log('bar');
//       resolve('bar')
//     }, 1000)
//   })
// }
// const getFooPromise = () => {
//   console.log('immediately foo')
//   return new Promise(resolve => {
//     setTimeout(() => {
//       console.log('foo');
//       resolve('foo')
//     }, 3000)
//   })
// }

// async function main() {
//   // 异步调用
//   // const bar = await getBarPromise();
//   // const foo = await getFooPromise();
//   // 同步调用1
//   // let fooPromise = getFooPromise();
//   // let barPromise = getBarPromise();
//   // const bar = await fooPromise;
//   // const foo = await barPromise;
//   // 同步调用2
//   const [bar, foo] = await Promise.all([getBarPromise(), getFooPromise()])
//   console.log(bar)
//   console.log(foo)
// }
// main()


// const newImage = async (url) => {
//   const image = new Image();
//   image.src = url;
//   return new Promise((resolve, reject) => {
//     image.onload = () => {
//       resolve(image)
//     }
//     image.onerror = (err) => {
//       reject(err)
//     }
//   })
// }


// const bar = Symbol('bar');
// const snaf = Symbol('snaf');

// class MyClass {
//     static say() {
//         return this.age
//     }
//     foo(baz) {
//         this[bar](baz)
//     }

//     [bar](baz) {
//         return this[snaf] = baz;
//     }
// }
// MyClass.age = '18'
// console.log(MyClass.say())
// const inst = new MyClass();
// console.log(Object.getOwnPropertyDescriptors(inst.__proto__))
// console.log(Object.getOwnPropertyNames(inst.__proto__))
// console.log(Object.getOwnPropertySymbols(inst.__proto__))

// const b = new ArrayBuffer(8);
// const v1 = new Int32Array(b);
// const v2 = new Uint8Array(b, 2);
// const v3 = new Int16Array(b, 2, 2);
// v3[0] = 259
// console.log(v1)
// console.log(v2)
// console.log(v3)

// const f64a = new Float64Array(8);
// f64a[0] = 10;
// f64a[1] = 20;
// f64a[2] = f64a[0] + f64a[1];
// console.log(f64a)
