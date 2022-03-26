/**
 * @param {number[]} weights
 * @param {number} days
 * @return {number}
 *
 * https://leetcode-cn.com/problems/capacity-to-ship-packages-within-d-days/
 */
var shipWithinDays = function (weights, days) {
    // 0/1 二分的条件判定：载重w，能否在 days 天内装完货物？
    const isValid = function (w) {
        let needDays = 1; // 需要的天数
        let total = 0; // 当天内的包裹总重 
        for (let weight of weights) {
            // 如果加上当前的重量就超过了w，则意味着装不下了，此时当天的船舶即刻出发
            if (total + weight > w) {
                needDays++;
                total = 0;
                if (needDays > days) return false;
            }
            total += weight;
        }
        return needDays <= days;
    }

    // 确定二分查找的左右边界
    let left = Math.max(...weights); // 最小载重 = 最大的那个（确保每个都能上船）
    let right = weights.reduce((a, b) => a + b); // 最大载重 = 之和（一次运完）

    // 二分查找：从左到右，找第一个能装完货物的载重
    while (left < right) {
        let mid = parseInt((left + right) / 2);
        if (isValid(mid)) right = mid;
        else left = mid + 1;
    }
    return right;
};