/**
 * @param {number[]} nums
 * @return {number}
 * 
 * 数据结构：无序映射
 * 时间复杂度：O(n)
 * 空间复杂度：O(n)
 * https://leetcode-cn.com/problems/degree-of-an-array/
 */
var findShortestSubArray = function (nums) {
    let map = new Map();
    for (let i = 0, len = nums.length; i < len; i++) {
        if (map.has(nums[i])) {
            let obj = map.get(nums[i])
            obj.du++;
            // obj.pos.push(i);
            obj.len = 1 + i - obj.s;
        } else {
            map.set(nums[i], {
                du: 1,
                // pos: [i],
                s: i,
                len: 1
            });
        }
    }
    // console.log(map);
    let du = 1;
    let min = nums.length;
    map.forEach((item) => {
        if (item.du > du) {
            du = item.du;
            min = item.len;
        } else if (item.du === du && item.len < min) {
            min = item.len;
        }
    });
    return min;
};