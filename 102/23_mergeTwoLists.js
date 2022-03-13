/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode[]} lists
 * @return {ListNode}
 * 
 * https://leetcode-cn.com/problems/merge-k-sorted-lists/
 */
var mergeTwoLists = function (l1, l2) {
    let head = new ListNode(); // 保护结点
    let cur = head;
    while (l1 && l2) {
        if (l1.val < l2.val) {
            cur.next = l1;
            l1 = l1.next;
        } else {
            cur.next = l2;
            l2 = l2.next;
        }
        cur = cur.next;
    }
    if (l1) cur.next = l1;
    if (l2) cur.next = l2;
    return head.next;
};
var mergeKLists = function (lists) {
    const k = lists.length;
    if (k === 0) return null;
    if (k === 1) return lists[0];

    // 递归
    const recur = function (l, r) {
        if (l === r) return lists[l];
        // 分治（分两半）
        let mid = parseInt((r - l) / 2);
        return mergeTwoLists(recur(l, l + mid), recur(l + mid + 1, r));
    }

    // 调用递归
    return recur(0, k - 1);
};