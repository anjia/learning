/**
 * @param {string[]} cpdomains
 * @return {string[]}
 * 
 * 数据结构：无序映射表
 * 时间复杂度：O(n). 语句执行的最多次数是 3n 忽略常数即 O(n)
 * 空间复杂度：O(n)
 * https://leetcode-cn.com/problems/subdomain-visit-count/
 */
var subdomainVisits = function (cpdomains) {
    let map = new Map();
    for (let d of cpdomains) {
        let t = d.split(' ');
        let count = parseInt(t[0]); // 提取次数
        // 以域名为 key，存次数
        let arr = t[1].split('.');
        for (let i = arr.length - 1, k = ''; i >= 0; i--) {
            k = k ? (arr[i] + '.' + k) : arr[i]; // 拼接域名
            if (map.has(k)) map.set(k, count + map.get(k));
            else map.set(k, count);
        }
    }
    // 将 map 改为答案的形式
    let ans = [];
    map.forEach((item, key) => ans.push(item + ' ' + key));
    return ans;
};