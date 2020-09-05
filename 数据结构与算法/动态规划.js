
// 基本思想：
//     问题的最优解如果可以由子问题的最优解推导得到，则可以先求子问题的最优解，再构造原问题的最优解；
//     若子问题有较多的重复出现，则可以自底向上从最终子问题向原问题逐步求解。
// 使用条件：
//     1.最优化原理：如果问题的最优解所包含的子问题的解也是最优的，就称该问题具有最优子结构，即满足最优化原理。
//     2.无后效性：即某一阶段状态一旦确定，就不受这个状态以后决策的影响。也就是说某状态以后的过程不会影响以前的状态，只与当前状态有关。
//     3.有重叠子问题：即子问题之间是不独立的，一个子问题在下一个阶段决策中可能被多次使用到。(该性质并不是动态规划使用的必要条件，但是如果没有这条性质，动态规划算法同其他算法相比就不具备优势了)
// 设计步骤：
//     1.划分阶段：按照问题的时间空间特征，把问题分为若干个阶段。在划分阶段时，注意划分后的阶段要是有序的或者是可排序的，否则问题就无法求解。
//     2.确定状态和状态变量：将问题发展到各个阶段时所处的客观情况用不同的状态表示出来。当然状态要满足无后效性。
//     3.确定决策并写出状态转移方程：因为决策和状态转移有着天然的联系，状态转移就是根据上一阶段的状态和决策来导出本阶段的状态。所以如果确定了决策，状态转移方程也就写出来了。
//     4.寻找边界条件：给出的状态转移方程是一个递推式，需要一个递推的终止条件或边界条件。一般。只要解决问题的阶段、状态和状态转移决策，就可以写出状态转移方程（包括边界条件）
// 特点：
//     1.把原始问题划分成一系列子问题
//     2.求解每个子问题仅一次，并将结果保存在表中，以后用到时直接存取，不重复计算，节省时间
//     3.自底向上地计算
//     4.整体问题最优解取决于子问题的最优解（状态转移方程）（将子问题称为状态，最终状态的求解归结为其他状态的求解）




// 背包问题
// dp[i][j]表示前i个商品，背包可装j大小的商品时的最大价值
// 前0个商品或者背包只能装0大小的商品时，只能装0价值
// 如果背包容积j大于第i个商品的体积，那么对于第i个商品有两种选择：选择第i个商品或者不选择i个商品
// 如果背包容积j小于第i个商品的体积，那么不可选第i个商品
// dp[i][j] = 0 , i或者j为0
// dp[i][j] = max(dp[i-1][j-第i-1个商品的体积] + 第i-1个商品的价值, dp[i-1][j]), 容积j大于第i-1个商品的体积
// dp[i][j] = dp[i-1][j], 容积小于第i-1个商品的体积
function dKnapsack(capacity, sizeArr, valueArr) {
    var dp = [];
    for (var i = 0; i <= sizeArr.length; i++) {
        for(var s = 0; s <= capacity; s++) {
            dp[i] || (dp[i] = [])
            if (i ===0 || s === 0) {
                dp[i][s] = 0;
            } else if (s >= sizeArr[i - 1]) {
                dp[i][s] = Math.max(dp[i-1][s-sizeArr[i-1]] + valueArr[i - 1], dp[i-1][s])
            } else {
                dp[i][s] = dp[i-1][s];
            }
        }
    }
    return dp;
}
var value = [4, 5, 10, 11, 13];
var size = [3, 4, 7, 8, 9];
var capacity = 16;
console.log(dKnapsack(capacity, size, value));


// 三角形最大和
// 问题：arr = [[7],[3,8],[8,1,0],[2,7,4,4],[4,5,2,6,5]],只能往下或者右移动，求最大和
// 7 0 0 0 0
// 3 8 0 0 0
// 8 1 0 0 0
// 2 7 4 4 0
// 4 5 2 6 5
// 设dp[i][j]表示arr[i][j]为节点的最大和
// arr[0][0]节点的最大和为 dp[0][0] = 7
// arr[0][j]第一行节点的和为 dp[0][j] = 7
// arr[1][0]节点的路线只能是 7 -> 3 dp[1][0] = 7 + 3 = 10
// arr[1][1]节点的路线可能是 7 -> 0 -> 8或者7 -> 3 -> 8 ,dp[1][1] = max(dp[0][1], dp[1][0]) + arr[1][1]
// arr[1][2]节点的路线可能是 7 -> 0 -> 0 -> 0或者 7 -> 3 -> 8 -> 0 或者 7 -> 0 -> 8 -> 0,dp[1][2] = max(dp[0][2], dp[1][1]) + arr[1][2]
// ...
// arr[i][j]的最大和为 dp[i][j] = max(dp[i][j-1], dp[i-1][j]) + arr[i][j]
// 状态转移方程为：
// dp[i][j] = arr[0][0], i = 0
// dp[i][j] = arr[0][0] + arr[1][0] + ... + arr[i][0], j = 0
// dp[i][j] = max(dp[i][j-1],dp[i-1][j]) + arr[i][j]

var maximumTotal = function(triangle) {
    var len = triangle.length
    var dp = new Array(len).fill(1).map(x => new Array(len).fill(0))
    for (var i = 0; i < len; i++) {
        for (var j = 0; j < len; j++) {
            if (i === 0) {
                dp[i][j] = triangle[i][0]
            } else if (j === 0) {
                dp[i][j] = dp[i-1][j] + triangle[i][j] || 0
            } else {
                dp[i][j] = Math.max(dp[i][j-1],dp[i-1][j]) + triangle[i][j] || 0
            }
        }
    }
    console.log(dp)
    return Math.max.apply(null, dp[len-1])
};
console.log(maximumTotal([[2],[3,4],[6,5,7],[4,1,8,3]]))

// 三角形最小路径和
// 问题：给定一个三角形，找出自顶向下的最小路径和。每一步只能移动到下一行中相邻的结点上。
// 相邻的结点 在这里指的是 下标 与 上一层结点下标 相同或者等于 上一层结点下标 + 1 的两个结点。
var minimumTotal = function(triangle) {
    var len = triangle.length
    var dp = new Array(len).fill(1).map(x => new Array(len).fill(null))
    for (var i = 0; i < len; i++) {
        for (var j = 0; j < i + 1; j++) {
            if (i === 0) {
                dp[i][j] = triangle[i][0]
            } else if (j === 0) {
                dp[i][j] = dp[i-1][j] + triangle[i][j]
            } else {
                dp[i][j] = (dp[i-1][j] ? Math.min(dp[i-1][j-1],dp[i-1][j]) : dp[i-1][j-1]) + triangle[i][j]
            }
        }
    }
    console.log(dp)
    return Math.min.apply(null, dp[len-1])
};
console.log(minimumTotal([[2],[3,4],[6,5,7],[4,1,8,3]]))


// 最长上升子序列
// 问题：arr = [2, 7, 1, 5, 6, 4, 3, 8, 9] 求它的最长上升子序列的长度
// 设f(i)为前i项的最长递增子序列的的长度，那么当前递增子序列的长度有两种情况
// 1.arr[i]是前i+1项的最大值，此时dp[i] = dp[i-1] + 1
// 2.arr[i]不是前i+1项的最大值，此时dp[i] = dp[i-1]
// 综上递推式为：
// dp[i] = 0, i = 0
// dp[i] = dp[i-1], arr[i]不是前i+1项的最大值
// dp[i] = dp[i-1] + 1 , arr[i]是前i+1项的最大值

function lengthOfLIS(arr) {
    var dp = new Array(array.length);
    dp[0] = 0;
    var prevMax = array[0];
    for (var i = 1; i < array.length; i++) {
        if (array[i] > prevMax) {
            dp[i] = dp[i-1] + 1;
            prevMax = array[i];
        } else {
            dp[i] = dp[i-1];
        }
    }
    return dp[array.length-1]
}
console.log(lengthOfLIS([10,9,2,5,3,7,101,18]))

var nums =  [-2, 0, 3, -5, 2, -1, 9]
var aa = nums.reduce((total, current) => total + current)
console.log(aa)



// 最长公共子串
var lcs = function(str1, str2) {
    var dp = [[]]
    var max = 0
    var index
    for (var i = 0; i < str1.length; i++) {
        for (var j = 0; j < str2.length; j++) {
            dp[i] || (dp[i] = [])
            if (str1[i] === str2[j]) {
                dp[i][j] = dp[i-1][j-1] + 1
            } else {
                dp[i][j] = 0
            }
            if (max < dp[i][j]) {
                max = dp[i][j]
                index = i
            }
        }
    }
    console.log(dp)
    var result = ''
    if (max) {
        for (var i = index - max + 1; i <= index; i++) {
            result += str1[i]
        }
    }
    return result
}

var str1 = 'asdfghj'
var str2 = 'qwudfgh'
console.log(lcs(str1, str2))

// 求区间和，包括索引
var NumArray = function(nums) {
    this.arr = nums
    this.length = nums.length
    this.total = nums.reduce((total, current) => total + current)
    this.leftArr = nums.map((x, i) => nums.reduce((total, current, j) => i >= j ? total + current : total))
    this.rightArr = nums.reverse().map((x, i) => nums.reduce((total, current, j) => i >= j ? total + current : total))
};
NumArray.prototype.sumRange = function(i, j) {
    return this.total - (i-1 >= 0 ? this.leftArr[i-1] : 0) -(this.length - j - 2 >= 0 ? this.rightArr[this.length - j - 2] : 0)
};
var arr = new NumArray([-2, 0, 3, -5, 2, -1])
console.log(arr.sumRange(0, 5))
console.log(arr.sumRange(0, 2))


// 连续子数组的最大和
var maxSubArray = function(nums) {
    var dp = [nums[0]]
    for (var i = 1; i < nums.length; i++) {
        dp[i] = Math.max(dp[i-1], 0) + nums[i]
    }
    return Math.max.apply(null, dp)
};
console.log(maxSubArray([-2,1,-3,4,-1,2,1,-5,4]))

// 买卖股票的最佳时机
// 题目：给定一个数组，它的第 i 个元素是一支给定股票第 i 天的价格。
// 如果你最多只允许完成一笔交易（即买入和卖出一支股票一次），设计一个算法来计算你所能获取的最大利润。
// 注意：你不能在买入股票前卖出股票。
var maxProfit = function(prices) {
    var dp = [0]
    var minValue = prices[0]
    for (var i = 1; i < prices.length; i++) {
        if (minValue > prices[i]) {
            minValue = prices[i]
            dp[i] = 0
        } else {
            dp[i] = prices[i] - minValue
        }
    }
    console.log(dp)
    return Math.max.apply(null,dp)
};
console.log(maxProfit([7,1,5,3,6,4]))

// 按摩师
// 题目：一个有名的按摩师会收到源源不断的预约请求，每个预约都可以选择接或不接。在每次预约服务之间要有休息时间，因此她不能接受相邻的预约。
// 给定一个预约请求序列，替按摩师找到最优的预约集合（总预约时间最长），返回总的分钟数。
var massage = function(nums) {
    var len = nums.length
    var dp = [[]]
    dp[0][0] = 0
    dp[0][1] = nums[0]
    for (var i = 1; i < len; i++) {
        dp[i] || (dp[i] = [])
        dp[i][0] = Math.max(dp[i-1][0],dp[i-1][1])
        dp[i][1] = dp[i-1][0] + nums[i]
    }
    console.log(dp)
    return Math.max(dp[len-1][1], dp[len-1][0])
};
console.log(massage([2,1,4,5,3,1,1,3]))

// 判断子序列
var isSubsequence = function(s, t) {
    var p = 0
    for (var i = 0; i < t.length; i++) {
        if (t[i] === s[p]) {
            p++
        }
    }
    return p === s.length
};
console.log(isSubsequence('abc', 'ahbgdc'))

// 爬楼梯
// 题目：假设你正在爬楼梯。需要 n 阶你才能到达楼顶。每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？
var climbStairs = function(n) {
    var dp = [1, 2]
    for (var i = 2; i < n; i++) {
        dp[i] = dp[i-1] + dp[i-2]
    }
    return dp[n-1]
};
console.log(climbStairs(4))



var countBits = function(num) {
    var dp = []
    dp[0] = [0]
    dp[1] = [0,1]
    for (var i = 2; i < num + 1; i++) {
        var t = i
        var n = 0
        while (t !== 1) {
            if (t % 2) {
                n++
            }
            t = Math.floor(t / 2)
        }
        dp[i] = [...dp[i-1], n+1]
    }
    return dp[num]
};
console.log(countBits(2))



var maxValue = function(grid) {
    var m = grid.length
    var n = grid[0].length
    var dp = [[]]
    dp[0][0] = grid[0][0]
    for (var i = 0; i < m; i++) {
        for (var j = 0; j < n; j++) {
            dp[i] || (dp[i] = [])
            if (i === 0 && j === 0) continue
            if (i === 0) {
                dp[i][j] = dp[i][j-1] + grid[i][j]
            } else if (j === 0) {
                dp[i][j] = dp[i-1][j] + grid[i][j]
            } else {
                dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]) + grid[i][j]
            }
        }
    }
    console.log(dp)
    return dp[m-1][n-1]
};
console.log(maxValue([[1,3,1],[1,5,1],[4,2,1]]))



var arr = [5,10,25,1]
var exchange = function(arr, money) {
    var dp = [[]]
    for (var i = 0; i < arr.length; i++) {
        for (var j = 0; j <= money; j++) {
            dp[i] || (dp[i] = [])
            if (i === 0) {
                dp[i][j] = j % arr[i] === 0 ? 1 : 0
                continue
            }
            if (j === 0) {
                dp[i][j] = 0
                continue
            }
            if (j >= arr[i]) {
                dp[i][j] = dp[i-1][j] + dp[i][j-arr[i]]
            } else {
                dp[i][j] = dp[i-1][j]
            }
        }
    }
    return dp[arr.length-1][money]
}

console.log(exchange([5,10,25,1], 15))


class MiniStack {
    constructor() {
        this.dataStore = []
        this.min = null
    }
    push(data) {
        this.dataStore.push(data)
        this.min > data && (this.min = data)
    }
    pop() {
        const data = this.dataStore.pop()
        if (data < this.min) {
            
        }
    }
    top() {
        return this.data[0]
    }
    getMin() {

    }
}