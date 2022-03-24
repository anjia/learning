/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */

/**
 * @param {TreeNode} root
 * @return {TreeNode}
 *
 * https://leetcode-cn.com/problems/convert-bst-to-greater-tree/
 */
var convertBST = function (root) {
    let sum = 0; // 共享变量（状态空间）
    // “右中左”遍历二叉搜索树
    const recur = function (root) {
        if (!root) return;
        recur(root.right); // 右子树
        //当前层
        sum += root.val;
        root.val = sum;
        recur(root.left);  // 左子树
    };
    recur(root);
    return root;
};