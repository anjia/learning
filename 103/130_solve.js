/**
 * @param {character[][]} board
 * @return {void} Do not return anything, modify board in-place instead.
 *
 * https://leetcode-cn.com/problems/surrounded-regions/
 */
var solve = function (board) {
    const m = board.length;
    const n = board[0].length;

    // 二维数组 m*n：是否被访问
    let visited = new Array(m);
    for (let i = 0; i < m; i++)
        visited[i] = (new Array(n)).fill(false);

    // 方向数组
    const dx = [0, 1, 0, -1];
    const dy = [1, 0, -1, 0];

    // 广度优先遍历 (startX, startY)
    const bfs = function (sx, sy) {
        // 记录本次通路
        const path = []; // 路径
        let isEdge = false; // 是否有点在边界上（在边界意味着没被'X'包围）

        const queue = []; // (队列+已访问)
        queue.push([sx, sy]);
        visited[sx][sy] = true;
        while (queue.length) {
            // 取队头
            let front = queue.shift();
            let x = front[0];
            let y = front[1];

            // 本层逻辑：入通路、判断此点是否在边缘
            path.push([x, y]);
            if (x === 0 || (x === m - 1) || y === 0 || (y === n - 1)) isEdge = true;

            // 遍历四个方向，没被访问的'O' 入队
            for (let i = 0; i < 4; i++) {
                let nx = x + dx[i];
                let ny = y + dy[i];
                if (nx >= 0 && nx < m && ny >= 0 && ny < n && board[nx][ny] === 'O' && !visited[nx][ny]) {
                    queue.push([nx, ny]);
                    visited[nx][ny] = true;
                }
            }
        }
        // 若没有在边缘上的（则意味着被'X'包围了），则将此路径上的对应位置设为'X'
        if (!isEdge) path.forEach(p => board[p[0]][p[1]] = 'X')
    }

    // 找一个没被访问的 'O'，作为入口，广度优先遍历
    for (let i = 0; i < m; i++)
        for (let j = 0; j < n; j++)
            if (board[i][j] === 'O' && !visited[i][j]) bfs(i, j);

    return board;
};