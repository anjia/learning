/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {number[]} inorder
 * @param {number[]} postorder
 * @return {TreeNode}
 * 
 * https://leetcode-cn.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/
 */
var buildTree = function (inorder, postorder) {
    // 参数分别为：中序遍历的左右下标 + 后序遍历的左右下标
    const recur = function (inL, inR, postL, postR) {
        if (inL > inR || postL > postR) return;
        if (inL === inR) return new TreeNode(inorder[inL]);
        if (postL === postR) return new TreeNode(postorder[postL]);

        // 从后序里提取根节点
        let root = postorder[postR];

        // 从中序里提取左右子树
        let rootIndex = inorder.indexOf(root);
        let leftTreeLen = rootIndex - inL;  // 左子树长度
        let rightTreeLen = inR - rootIndex; // 右子树长度

        return new TreeNode(root,
            recur(inL, rootIndex - 1, postL, postL + leftTreeLen - 1), // 左侧子树
            recur(rootIndex + 1, inR, postR - rightTreeLen, postR - 1)); // 右侧子树
    }
    return recur(0, inorder.length - 1, 0, postorder.length - 1);;
};