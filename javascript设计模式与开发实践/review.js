function str2Uint8Array(input) {
    const encoder = new TextEncoder()
    const view = encoder.encode(input)
    return view
}
var arrayBufferRes = str2Uint8Array('{"code" : 0, "success": false}')
console.log(arrayBufferRes)

// let reader = new FileReader()
// reader.onload = e => {
//     if (e.target.readyState === 2) {
//         let res = {}
//         res = JSON.parse(e.target.result)
//         console.info('back:: ', res)
//     }
// }
// reader.readAsText(response)