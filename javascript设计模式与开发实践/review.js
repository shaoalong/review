// function str2Uint8Array(input) {
//     const encoder = new TextEncoder()
//     const view = encoder.encode(input)
//     return view
// }
// var arrayBufferRes = str2Uint8Array('{"code" : 0, "success": false}')
// console.log(arrayBufferRes)

// let reader = new FileReader()
// reader.onload = e => {
//     if (e.target.readyState === 2) {
//         let res = {}
//         res = JSON.parse(e.target.result)
//         console.info('back:: ', res)
//     }
// }
// reader.readAsText(response)

var throttle = function(fn, interval) {
    var timer = null
    var firstTime = true
    return function() {
        var args = arguments
        var _this = this
        if (firstTime) {
            fn.apply(this, args)
            firstTime = false
            return false
        }
        if (!timer) {
            console.log('==')
            timer = setTimeout(function(){
                console.log('__')
                fn.apply(_this, args)
                clearTimeout(timer)
                timer = null
            }, interval || 500)
        }
    }
}

var debounce = function(fn, interval) {
    var timer
    return function() {
        if (!timer) {
            timer = setTimeout(() => {
                fn.apply(this, arguments)
                clearTimeout(timer)
                timer = null
            }, interval || 500)
        } else {
            clearTimeout(timer)
            timer = null
        }
    }
}

var log = debounce(function(n) {
    console.log(n)
}, 1000)
var n = 0
while (n<1000000000) {
    log(n)
    n++
}