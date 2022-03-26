/**
 * @param {number[]} nums
 * @return {number}
 *
 * https://leetcode-cn.com/problems/find-minimum-in-rotated-sorted-array-ii/
 */
var findMin = function (nums) {
    // 二分查找：从左到右，找第一个 <= [right] 的
    let left = 0;
    let right = nums.length - 1;
    while (left < right) {
        let mid = parseInt((left + right) / 2);
        if (nums[mid] === nums[right]) right--; // 去重
        else if (nums[mid] < nums[right]) right = mid;
        else left = mid + 1;
    }
    return nums[right];
};