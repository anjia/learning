/**
 * @param {number[]} nums
 * @return {number}
 * 
 * https://leetcode-cn.com/problems/jump-game-ii/
 */
var jump = function (nums) {
    const n = nums.length;
    // opt[i][j] 表示前i个数，跳跃到位置j，所需的最少跳跃次数
    let opt = (new Array(n)).fill(Infinity);
    opt[0] = 0;
    // 用列表法进行决策：opt[i] -> min(opt[i], opt[i+steps]+1);
    for (let i = 0; i < n; i++) {
        // 从位置i开始起跳
        for (let j = i + 1; j <= i + nums[i] && j < n; j++) {
            opt[j] = Math.min(opt[j], opt[i] + 1); // min(原始值, 从i跳一次来)
        }
    }
    return opt[n - 1];
};