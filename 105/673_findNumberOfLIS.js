/**
 * @param {number[]} nums
 * @return {number}
 * 
 * https://leetcode-cn.com/problems/number-of-longest-increasing-subsequence/
 */
var findNumberOfLIS = function (nums) {
    const n = nums.length;

    // 以 nums[i] 结尾的数组，最长递增子序列的
    const lenArr = (new Array(n)).fill(1); // 长度
    const countArr = (new Array(n)).fill(1); // 个数
    let max = 1; // 记录最大长度

    // 动态规划：开始递推
    for (let i = 1; i < n; i++) {
        for (let j = i - 1; j >= 0; j--) {
            // 当严格递增时，比较“+1之后的新长度”和当前长度
            if (nums[j] < nums[i]) {
                let newLen = lenArr[j] + 1;
                if (lenArr[i] < newLen) {
                    lenArr[i] = newLen;
                    countArr[i] = countArr[j];
                } else if (lenArr[i] === newLen) {
                    countArr[i] += countArr[j];
                }
            }
        }
        if (lenArr[i] > max) max = lenArr[i];
    }

    // 计算最长递增子序列的总数
    let ans = 0;
    for (let i = 0; i < n; i++) {
        if (lenArr[i] === max) ans += countArr[i];
    }
    return ans;
};