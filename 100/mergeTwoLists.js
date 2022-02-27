/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} list1
 * @param {ListNode} list2
 * @return {ListNode}
 */
var mergeTwoLists = function (list1, list2) {
    if (!list1) return list2;
    if (!list2) return list1;

    let head = new ListNode(); // 保护节点，即访问入口
    let i = list1;
    let j = list2;
    let cur = head;
    while (i && j) {
        // 循环取小的
        if (i.val <= j.val) {
            cur.next = i;
            i = i.next;
        } else {
            cur.next = j;
            j = j.next;
        }
        cur = cur.next;
    }
    // 对于剩余部分，链表直接指过来即可
    if (i) cur.next = i;
    if (j) cur.next = j;

    return head.next;
};
/**
 * 算法复杂度分析
 * 1. 时间复杂度：O(n), 循环了 min(n,m) 次
 * 2. 空间复杂度：O(1), 开了个保护节点
 *
 * https://leetcode-cn.com/problems/merge-two-sorted-lists/
 */