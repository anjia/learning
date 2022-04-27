/**
 * @param {number[][]} edges
 * @return {number[]}
 * 
 * https://leetcode-cn.com/problems/redundant-connection/
 */
var findRedundantConnection = function (edges) {
    const n = edges.length; // 即结点的个数

    // 并查集：如果两个结点之间有边，那就合并它们
    const fa = new Array(n + 1);
    for (let i = 0; i <= n; i++) fa[i] = i;
    const find = function (x) {
        if (fa[x] === x) return x;
        return (fa[x] = find(fa[x]));
    }

    // 依次遍历 edges
    for (let [x, y] of edges) {
        let px = find(x);
        let py = find(y);
        // 如果边的两个结点已经在同一个集合里了，那说明它就是一条多余的边，删的就是它，直接return
        if (px === py) return [x, y];
        // 否则就合并这两个集合
        fa[px] = py;
    }
};