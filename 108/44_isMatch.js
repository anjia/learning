/**
 * @param {string} s
 * @param {string} p
 * @return {boolean}
 * 
 * https://leetcode-cn.com/problems/wildcard-matching/
 */
var isMatch = function (s, p) {
    s = ' ' + s;
    p = ' ' + p;
    const m = p.length;
    const n = s.length;

    // opt[i][j] 表示模式 p[0,i] 是否能匹配成功字符串 s[0,j]
    let opt = new Array(m);
    for (let i = 0; i < m; i++) opt[i] = (new Array(n)).fill(false); // 默认为false

    // 递推起点
    opt[0][0] = true;
    for (let i = 0; i < m; i++) {
        if (p[i] === '*') opt[i][0] = opt[i - 1][0];
    }

    // 开始递推
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            if (p[i] === '*') {
                opt[i][j] = opt[i - 1][j] || opt[i][j - 1]; // 不匹配 || 匹配1~N个 
            } else {
                opt[i][j] = opt[i - 1][j - 1] && (p[i] === s[j] || p[i] === '?');
            }
        }
    }

    return opt[m - 1][n - 1];
};