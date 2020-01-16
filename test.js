class MyArray extends Array {
}
const a = new MyArray(1, 2, 3);
const b = a.map(x => x);
const c = a.filter(x => x > 1);
console.log(b instanceof MyArray)
console.log(b instanceof Array)
console.log(MyArray.__proto__ == Array)