/**
 * @param {number} n
 * @return {number}
 * 
 * https://leetcode-cn.com/problems/perfect-squares/
 */
var numSquares = function (n) {
    // 完全平方数 nums[]
    let nums = [];
    for (let i = 1; i <= n; i++) {
        let mul = i * i;
        if (mul <= n) nums.push(mul);
        else break;
    }

    // 背包思想：完全平方数=物品，完全平方数的数值=体积，价值=1个
    // opt[i][j] 表示从前i个完全平方数中选一些数字，总和为j时的最少数字个数
    let opt = (new Array(n + 1)).fill(Infinity);
    opt[0] = 0;
    // 开始递推：min(选, 不选)
    for (let num of nums)
        for (let j = num; j <= n; j++) // 完全背包，故正序循环
            opt[j] = Math.min(opt[j], opt[j - num] + 1);

    return opt[n];
};