// 基本概念：
//     在计算机科学中，分治法是一种很重要的算法。字面上的解释是“分而治之”，就是把一个复杂的问题分成两个或更多的相同或相似的子问题，
//     再把子问题分成更小的子问题……直到最后子问题可以简单的直接求解，原问题的解即子问题的解的合并。
//     这个技巧是很多高效算法的基础，如排序算法(快速排序，归并排序)，傅立叶变换(快速傅立叶变换)……
// 设计思想:
//     将一个难以直接解决的大问题，分割成一些规模较小的相同问题，以便各个击破，分而治之。
// 设计策略:
//     对于一个规模为n的问题，若该问题可以容易地解决（比如说规模n较小）则直接解决，否则将其分解为k个规模较小的子问题，
//     这些子问题互相独立且与原问题形式相同，递归地解这些子问题，然后将各子问题的解合并得到原问题的解。这种算法设计策略叫做分治法
// 适用情况：
//     1.该问题的规模缩小到一定的程度就可以容易地解决
//     2.该问题可以分解为若干个规模较小的相同问题，即该问题具有最优子结构性质。
//     3.利用该问题分解出的子问题的解可以合并为该问题的解；
//     4.该问题所分解出的各个子问题是相互独立的，即子问题之间不包含公共的子子问题。
//     第一条特征是绝大多数问题都可以满足的，因为问题的计算复杂性一般是随着问题规模的增加而增加；
//     第二条特征是应用分治法的前提它也是大多数问题可以满足的，此特征反映了递归思想的应用；
//     第三条特征是关键，能否利用分治法完全取决于问题是否具有第三条特征，如果具备了第一条和第二条特征，而不具备第三条特征，则可以考虑用贪心法或动态规划法
//     第四条特征涉及到分治法的效率，如果各子问题是不独立的则分治法要做许多不必要的工作，重复地解公共的子问题，此时虽然可用分治法，但一般用动态规划法较好
// 基本步骤：
//     1.将原问题分解为若干个规模较小，相互独立，与原问题形式相同的子问题
//     2.若子问题规模较小而容易被解决则直接解，否则递归地解各个子问题
//     3.将各个子问题的解合并为原问题的解
// 思维过程：实际上就是类似于数学归纳法，找到解决本问题的求解方程公式，然后根据方程公式设计递归程序
//     1.一定是先找到最小问题规模时的求解方法
//     2.然后考虑随着问题规模增大时的求解方法
//     3.找到求解的递归函数式后（各种规模或因子），设计递归程序即可。
// 经典问题：
//     1.二分搜索
//     2.大整数乘法
//     3.Strassen矩阵乘法
//     4.棋盘覆盖
//     5.合并排序
//     6.快速排序
//     7.线性时间选择
//     8.最接近点对问题
//     9.循环赛日程表
//     10.汉诺塔
//     11.最长公共前缀

// 二分法搜索：
    var arr = [1,2,6,8,90,222,10000]
    function digSearch(arr, k) {
        if (arr.length === 1) {
            return arr[0] === k
        }
        var mid = Math.floor(arr.length / 2)
        var left = arr.slice(0, mid)
        var right = arr.slice(mid, arr.length)
        if (k === arr[mid]) {
            return true
        } else if (k > arr[mid]) {
            return digSearch(right, k)
        } else {
            return digSearch(left, k)
        }
    }
    console.log(digSearch(arr, 2))
// 最长公共前缀
    var strs = ['apple','application','apply','alpha']
    function longestPrefixer(arr) {
        if (arr.length === 1) {
            return arr[0]
        }
        if (arr.length === 2) {
            return getPrefixer(arr[0], arr[1])
        }
        var mid = Math.floor(arr.length / 2)
        var left = arr.slice(0, mid)
        var right = arr.slice(mid, arr.length)
        return getPrefixer(longestPrefixer(left), longestPrefixer(right))
    }
    function getPrefixer(str1, str2) {
        var i = 0
        var result = ''
        while (str1[i] === str2[i] && i <  Math.max(str1.length, str2.length)) {
            result += str1[i++]
        }
        return result
    }
    console.log(longestPrefixer(strs))
// 合并排序
    var arr = [1,5,3,2,9,12]
    function combineSort(arr) {
        if (arr.length === 1) {
            return arr
        }
        if (arr.length === 2) {
            return arr[0] > arr[1] ? [arr[1], arr[0]] : [arr[0], arr[1]]
        }
        var mid = Math.floor(arr.length / 2)
        var left = arr.slice(0, mid)
        var right = arr.slice(mid, arr.length)
        return combineArr(combineSort(left), combineSort(right))
    }
    function combineArr(arr1, arr2) {
        var arr = [...arr1, ...arr2]
        var i = arr1.length - 1
        var j = arr2.length - 1
        var n = arr.length - 1
        while (i > -1 && j > -1) {
            if (arr1[i] >= arr2[j]) {
                arr[n--] = arr1[i--]
            } else {
                arr[n--] = arr2[j--]
            }
        }
        if (i > -1) {
            while (n > -1) {
                arr[n--] = arr1[i--]
            }
        } else {
            while (n > -1) {
                arr[n--] = arr2[j--]
            }
        }
        return arr
    }
    // console.log(combineArr([2,5,9],[3,4,5]))
    // console.log(combineArr([-1,2,3],[3,4,5]))
    console.log(combineSort(arr))

// 快速排序
    var arr = [1,5,3,2,9,12]
    function quickSort(arr, low, heigh) {
        if (low >= heigh) return
        var left = low
        var right = heigh
        var temp = arr[low]
        while (low < heigh) {
            while (arr[heigh] >= temp && heigh > low) {
                heigh--
            }
            if (low < heigh) {
                arr[low++] = arr[heigh]
            }
            while (arr[low] <= temp && heigh > low) {
                low++
            }
            if (low < heigh) {
                arr[heigh--] = arr[low]
            }
        }
        arr[low] = temp
        quickSort(arr, left, low - 1)
        quickSort(arr, low + 1, right)
        return arr
    }
    function quickSort(arr) {
        if (arr.length <= 1) return arr
        var mid = Math.floor(arr.length / 2)
        var temp = arr[mid]
        var left = []
        var right = []
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] < temp) {
                left.push(arr[i])
            }
            if (arr[i] > temp) {
                right.push(arr[i])
            }
        }
        return quickSort(left).concat(temp, quickSort(right))
    }
    console.log(quickSort(arr, 0, 5))

// 大整数乘法
    var a = '123456'
    var b = '789'
    function bigMult(str1, str2) {
        var result = 0
        var len1 = (str1 + '').length
        var len2 = (str2 + '').length
        if (len1 === 1 || len2 === 1) {
            result = str1 * str2
        } else {
            var str1n = Math.pow(10, Math.floor((len1 / 2)))
            var str1h = Math.floor(str1 / str1n)
            var str1l = str1 % str1n
            var str2n = Math.pow(10, Math.floor((len2 / 2)))
            var str2h = Math.floor(str2 / str2n)
            var str2l = str2 % str2n
            result = bigMult(str1h, str2h) * str1n * str2n + bigMult(str1h, str2l) * str1n + bigMult(str1l, str2h) * str2n + bigMult(str1l, str2l)
        }
        return result
    }
    console.log(bigMult(a, b))
