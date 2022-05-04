/**
 * @param {number[][]} grid
 * @return {number}
 * 
 * https://leetcode-cn.com/problems/shortest-path-in-binary-matrix/
 */
var shortestPathBinaryMatrix = function (grid) {
    const n = grid.length;

    // 方向数组：8个方向
    const dx = [0, 1, 0, -1, 1, 1, -1, -1];
    const dy = [-1, 0, 1, 0, -1, 1, 1, -1];

    // 广度优先遍历
    const queue = [];
    const visited = new Array(n); // 已经访问过的结点（状态空间）
    for (let i = 0; i < n; i++) visited[i] = (new Array(n)).fill(false);

    // 开始BFS：从[0,0]开始，起始单元格个数为1
    if (grid[0][0] === 0) {
        queue.push([0, 0, 1]); // [x, y, 单元格总数]
        visited[0][0] = true;
        while (queue.length) {
            const [x, y, deep] = queue.shift(); // 队首元素

            // 若已到达“左下角”，则直接返回
            if (x === n - 1 && y === n - 1) return deep;

            // 遍历队首的八个方向，若为0，且没访问过，则进队列
            for (let i = 0; i < dx.length; i++) {
                let nx = x + dx[i];
                let ny = y + dy[i];
                if (nx >= 0 && nx < n && ny >= 0 && ny < n && grid[nx][ny] === 0 && !visited[nx][ny]) {
                    queue.push([nx, ny, deep + 1]);
                    visited[nx][ny] = true;
                }
            }
        }
    }
    return -1;
};