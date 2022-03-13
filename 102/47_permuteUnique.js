/**
 * @param {number[]} nums
 * @return {number[][]}
 * 
 * https://leetcode-cn.com/problems/permutations-ii/
 */
var permuteUnique = function (nums) {
    // 排序，因为要去重
    nums.sort((a, b) => {
        return a > b ? 1 : -1;
    });
    const n = nums.length;
    const ans = [];

    // 状态变量（深度遍历的那条递归）
    let used = [];
    let path = [];
    // 递归：判断第pos个位置该放什么元素
    const dfs = function (pos) {
        if (pos === n) {
            ans.push([...path]);
            return;
        }
        for (let i = 0; i < n; i++) {
            // 去重判断 i>0 && nums[i]===nums[i-1] && !used[i-1]
            if (used[i] || (i > 0 && nums[i] === nums[i - 1] && !used[i - 1])) continue;
            path.push(nums[i]);
            used[i] = true;
            dfs(pos + 1);
            path.pop(); // 恢复现场（回溯）
            used[i] = false;
        }
    }

    dfs(0);
    return ans;
};