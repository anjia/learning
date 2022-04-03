https://leetcode-cn.com/problems/triangle/

## 1. 暴力搜索（超时）

思路：自顶向下遍历，然后求和，最后取和的最小值

深度优先遍历，代码如下：

```js
/**
 * @param {number[][]} triangle
 * @return {number}
 */
var minimumTotal = function(triangle) {
  const n = triangle.length;
  const ans = [];

  // 递归：深度优先遍历
  const path = []; // 本条递归路径经过的所有点（状态空间）
  const dfs = function(sx, sy) {
    // 叶子结点，开始算和
    if (sx === n - 1) {
      let sum = path.reduce((a, b) => a + b);
      ans.push(sum);
      return;
    }

    // 走下一步，两个选择：[sx+1, sy], [sx+1, sy+1]
    for (let i = 0; i <= 1; i++) {
      let nx = sx + 1;
      let ny = sy + i;
      if (nx < n && ny < triangle[nx].length) {
        path.push(triangle[nx][ny]); // 入path
        dfs(nx, ny); // 调自己-递归
        path.pop(); // 恢复现场（回溯）
      }
    }
  };

  // 从0,0开始
  path.push(triangle[0][0]);
  dfs(0, 0);

  // 取最小值
  return Math.min(...ans);
};
```

> 执行结果：执行出错（栈溢出）

打印 log，我们可以看到递归了很多重复状态。以 `[[2],[3,4],[6,5,7],[4,1,8,3]]` 为例，二维数组表示即：

```
2
3,4
6,5,7
4,1,8,3
```

它递归了如下点：

```sh
dfs(0, 0), path= [ 2 ]
dfs(1, 0), path= [ 2, 3 ]
dfs(2, 0), path= [ 2, 3, 6 ]
dfs(3, 0), path= [ 2, 3, 6, 4 ]
dfs(3, 1), path= [ 2, 3, 6, 1 ]  A.此点经过了3次
dfs(2, 1), path= [ 2, 3, 5 ]     B.此点经过了2次
dfs(3, 1), path= [ 2, 3, 5, 1 ]  A.
dfs(3, 2), path= [ 2, 3, 5, 8 ]  C.此点经过了3次
dfs(1, 1), path= [ 2, 4 ]
dfs(2, 1), path= [ 2, 4, 5 ]     B.
dfs(3, 1), path= [ 2, 4, 5, 1 ]  A.
dfs(3, 2), path= [ 2, 4, 5, 8 ]  C.
dfs(2, 2), path= [ 2, 4, 7 ]
dfs(3, 2), path= [ 2, 4, 7, 8 ]  C.
dfs(3, 3), path= [ 2, 4, 7, 3 ]
```

也就是说从`[0,0]`出发，有些点可能会有多个到达路径。既然如此，我们就在每个位置记录下这诸多路径中和最小的那个。

自顶向下思考：从第一行开始，依次计算每个点从`[0,0]`出发到本位置的最小和，一直计算到最后一行。最后，再直接取最后一行中和最小的那个，便就是答案。

自底向上思考：从最后一行开始，依次计算每个点能到最后一行的和最小的那个，一直计算到第一行。最后，`[0,0]`位置的和，便就是答案。

## 2. 动态规划（自顶向下）

代码如下：

```js
/**
 * @param {number[][]} triangle
 * @return {number}
 */
var minimumTotal = function(triangle) {
  const n = triangle.length;

  // 状态空间，格式：[x,y] = minVal
  const minSum = new Array(n);
  for (let i = 0; i < n; i++) minSum[i] = [];

  // 初始化状态空间
  minSum[0][0] = triangle[0][0];

  // 动态规划：自顶向下
  for (let row = 1; row < n; row++)
    for (let col = 0; col < triangle[row].length; col++) {
      let prevMin = Infinity;
      if (col < minSum[row - 1].length) prevMin = minSum[row - 1][col]; // 从 [row-1][col] 来
      if (col > 0 && minSum[row - 1][col - 1] < prevMin)
        prevMin = minSum[row - 1][col - 1]; // 从 [row-1][col-1] 来
      minSum[row][col] = triangle[row][col] + prevMin; // 取最小的那个 + 再加本位置的值
    }

  return Math.min(...minSum[n - 1]); // 返回和最小的那个
};
```

## 3. 动态规划（自底向上）

代码如下：

```js
/**
 * @param {number[][]} triangle
 * @return {number}
 */
var minimumTotal = function(triangle) {
  const n = triangle.length;

  // 状态空间，格式：[x,y] = minVal
  const minSum = new Array(n);
  for (let i = 0; i < n; i++) minSum[i] = [];

  // 初始化状态空间
  for (let i = 0; i < triangle[n - 1].length; i++)
    minSum[n - 1][i] = triangle[n - 1][i];

  // 动态规划
  for (let row = n - 2; row >= 0; row--)
    for (let col = 0; col < triangle[row].length; col++)
      minSum[row][col] =
        triangle[row][col] +
        Math.min(minSum[row + 1][col], minSum[row + 1][col + 1]);

  return minSum[0][0];
};
```

## 总结

本题先从暴力搜索出发，理清了状态空间。再对状态空间进行了调整，然后就用 for 循环实现了动态规划，跳过了“记忆化搜索”那步。

与动态规划相比，记忆化搜索的代码显得繁琐和冗长，这里就没再写了。其实，暴力搜索的目的也主要是辅助我们理清状态空间，如果状态转移的递推公式一下子就能看出来，暴力搜索这步也能直接省略，直接写动态规划的代码。
