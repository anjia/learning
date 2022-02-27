/**
 * @param {number[]} digits
 *    1 <= digits.length <= 100
 *    0 <= digits[i] <= 9
 * @return {number[]}
 */
var plusOne = function (digits) {
    let i = digits.length - 1;
    while (i >= 0) {
        if (digits[i] === 9) {
            digits[i] = 0;  // 9 有进位，本位直接赋值，进位去下个循环
        } else {
            digits[i] = digits[i] + 1; // 0~8 没进位，正常+1后退出
            break;
        }
        i--;
    }
    if (i < 0) digits.unshift(1); // 此时最高位也有进位，故在开头+1
    return digits;
};
/**
 * 算法的复杂度分析
 * 1. 时间复杂度：O(n), 因为有一次循环
 *    - 最好情况 O(1), 此时最低位直接+1 没进位
 *    - 最坏情况 O(n), 此时每位都是9 直接进位到最高位
 *    - 平均情况 O(n), (1+2+3+...+n)/n = (1+n)/2
 * 2. 空间复杂度：O(1), 有个迭代的变量i记录最高位是否有进位
 *
 * https://leetcode-cn.com/problems/plus-one/
 */