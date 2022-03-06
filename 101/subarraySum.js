/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 * 
 * 数据结构：前缀和+Map
 * 时间复杂度：O(n)
 * https://leetcode-cn.com/problems/subarray-sum-equals-k/
 */
var subarraySum = function (nums, k) {
    if (!nums.length) return 0;
    if (nums.length === 1) return nums[0] === k ? 1 : 0;

    let ans = 0;

    // 前缀和 + Map
    let sums = new Array(nums.length + 1);
    sums[0] = 0;
    let map = new Map();
    map.set(0, 1);
    for (let i = 1, len = sums.length, lcnt, cur; i < len; i++) {
        sums[i] = sums[i - 1] + nums[i - 1];
        // 若之前有可以匹配的值，则直接更新答案
        lcnt = map.get(sums[i] - k);
        lcnt && (ans += lcnt);
        // 将当前和存入 map, 初始值为1 若之前已经有了则+1
        cur = map.get(sums[i]) || 0;
        map.set(sums[i], cur + 1);
    }
    return ans;
};