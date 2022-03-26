/**
 * @param {number[]} piles
 * @param {number} h
 * @return {number}
 *
 * https://leetcode-cn.com/problems/koko-eating-bananas/
 */
var minEatingSpeed = function (piles, h) {
    // 0/1 分段的条件判定：速度k，能否在h小时之内吃完香蕉？
    const isValid = function (k) {
        let used = 0;
        for (let pile of piles) {
            used += Math.ceil(pile / k);
            if (used > h) return false;
        }
        return true;
    };

    // 确定二分查找的左右边界
    const sum = piles.reduce((a, b) => a + b);
    let left = Math.ceil(sum / h); // 最小速度 = 平均速度（香蕉总数/H时间）
    let right = Math.max(...piles); // 最大速度 = 最大值（一小时吃一堆）

    // 二分查找：从左到右，找第一个能吃完的速度
    while (left < right) {
        let mid = parseInt((left + right) / 2);
        if (isValid(mid)) right = mid;
        else left = mid + 1;
    }
    return right;
};