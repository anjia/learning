/**
 * @param {character[][]} grid
 * @return {number}
 * 
 * https://leetcode-cn.com/problems/number-of-islands/
 */
var numIslands = function (grid) {
    const m = grid.length;
    const n = grid[0].length;
    const size = m * n;

    // 并查集：将相邻两个陆地合并
    const fa = new Array(size);
    for (let i = 0; i < size; i++) fa[i] = i;
    const find = function (x) {
        if (fa[x] === x) return x;
        return fa[x] = find(fa[x]);
    }
    const unionSet = function (x, y) {
        x = find(x);
        y = find(y);
        if (x !== y) fa[x] = y;
    }
    const getNum = function (i, j) {
        return i * n + j;
    }

    // 依次遍历二维网格，将两个相邻的"1"进行合并
    const dx = [1, 0]; // 两个方向：向右+向下
    const dy = [0, -1];
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (grid[i][j] === '1') {
                // 遍历相邻方向，把是"1"的相互合并
                for (let k = 0; k < dx.length; k++) {
                    let nx = i + dx[k];
                    let ny = j + dy[k];
                    if (nx >= 0 && nx < m && ny >= 0 && ny < n && grid[nx][ny] === '1')
                        unionSet(getNum(nx, ny), getNum(i, j));
                }
            }
        }
    }

    // 求岛屿数量 = 求并查集中有几个陆地根
    let ans = 0;
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            // 值=='1' 且 fa[x] = x
            if (grid[i][j] === '1') {
                let x = getNum(i, j);
                if (fa[x] === x) ans++;
            }
        }
    }
    return ans;
};