/**
 * @param {string} s
 * @param {string} p
 * @return {number[]}
 * 
 * https://leetcode-cn.com/problems/find-all-anagrams-in-a-string/
 */
var findAnagrams = function (s, p) {
    const ns = s.length;
    const np = p.length;
    const getCharIndex = function (ch) {
        return ch.charCodeAt() - 97;
    }

    if (ns < np) return [];

    // 思路：在字符串s中，依次滑动窗口np，判断两个字符串是否相等
    // 1. 初始化字符频次
    const pH = new Array(26).fill(0); // 统计字符串的频次
    const sH = new Array(26).fill(0);
    for (let i = 0; i < np; i++) {
        pH[getCharIndex(p[i])]++;
        sH[getCharIndex(s[i])]++;
    }
    // 2. 从0开始，依次滑动窗口np
    let ans = [];
    const pHStr = pH.join('');
    if (sH.join('') === pHStr) ans.push(0);
    for (let i = 0; i < ns - np; i++) {
        // i出窗口，i+np入窗口
        sH[getCharIndex(s[i])]--;
        sH[getCharIndex(s[i + np])]++;
        if (sH.join('') === pHStr) ans.push(i + 1);
    }
    return ans;
};