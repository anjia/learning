/**
 * @param {number[]} nums
 * @return {boolean}
 * 
 * https://leetcode-cn.com/problems/jump-game/
 */
var canJump = function (nums) {
    const n = nums.length;
    // opt[i][j] 表示从前i个数中选一些数字，能否到达位置j（可行性问题）
    let opt = (new Array(n)).fill(false); // 默认都是false
    opt[0] = true; // 递推起点

    // 开始递推，用列表法进行决策：若 opt[j] 可达，则它的下一步是“从 opt[j+1] 到 opt[j+steps] 都将可达”
    for (let i = 0; i < n; i++) {
        if (opt[i] && !opt[n - 1]) {
            for (let j = i + 1; j <= i + nums[i] && j < n && !opt[n - 1]; j++) {
                opt[j] = true;
            }
        }
    }

    return opt[n - 1];
};