/**
 * @param {number} k
 */
var MyCircularDeque = function (k) {
    this.queue = new Array(k); // []
    this.MAX_LEN = k;
    this.size = 0; // 元素的真实长度
    this.head = 0; // 始终指向有效元素的头部
    this.tail = 0; // 始终指向有效元素的尾部
};
// 移动下标的两个函数
MyCircularDeque.prototype.indexForward = function (i) {
    return i === 0 ? (this.MAX_LEN - 1) : (i - 1);
}
MyCircularDeque.prototype.indexBackward = function (i) {
    return i === this.MAX_LEN - 1 ? 0 : (i + 1);
}

/** 
 * @param {number} value
 * @return {boolean}
 */
MyCircularDeque.prototype.insertFront = function (value) {
    if (this.isFull()) return false;
    if (!this.isEmpty()) this.head = this.indexForward(this.head); // this.head 向前移动一位
    this.queue[this.head] = value;
    this.size++;
    return true;
};

/** 
 * @param {number} value
 * @return {boolean}
 */
MyCircularDeque.prototype.insertLast = function (value) {
    if (this.isFull()) return false;
    if (!this.isEmpty()) this.tail = this.indexBackward(this.tail); // this.tail 向后移动一位
    this.queue[this.tail] = value;
    this.size++;
    return true;
};

/**
 * @return {boolean}
 */
MyCircularDeque.prototype.deleteFront = function () {
    if (this.isEmpty()) return false;
    this.queue[this.head] = (void 0); // 即 undefined
    this.size--;
    if (!this.isEmpty()) this.head = this.indexBackward(this.head); // this.head 向后移动一位
    return true;
};

/**
 * @return {boolean}
 */
MyCircularDeque.prototype.deleteLast = function () {
    if (this.isEmpty()) return false;
    this.queue[this.tail] = (void 0);
    this.size--;
    if (!this.isEmpty()) this.tail = this.indexForward(this.tail); // this.tail 向前移动一位
    return true;
};

/**
 * @return {number}
 */
MyCircularDeque.prototype.getFront = function () {
    if (this.isEmpty()) return -1;
    return this.queue[this.head];
};

/**
 * @return {number}
 */
MyCircularDeque.prototype.getRear = function () {
    if (this.isEmpty()) return -1;
    return this.queue[this.tail];
};

/**
 * @return {boolean}
 */
MyCircularDeque.prototype.isEmpty = function () {
    return this.size === 0;
};

/**
 * @return {boolean}
 */
MyCircularDeque.prototype.isFull = function () {
    return this.size === this.MAX_LEN;
};

/**
 * Your MyCircularDeque object will be instantiated and called as such:
 * var obj = new MyCircularDeque(k)
 * var param_1 = obj.insertFront(value)
 * var param_2 = obj.insertLast(value)
 * var param_3 = obj.deleteFront()
 * var param_4 = obj.deleteLast()
 * var param_5 = obj.getFront()
 * var param_6 = obj.getRear()
 * var param_7 = obj.isEmpty()
 * var param_8 = obj.isFull()
 */

/**
 * 算法复杂度分析
 * 1. 时间复杂度 O(1), 包括构造函数及原型链上的各种方法
 * 2. 空间复杂度 O(n), 即双端队列的数据大小
 *
 * https://leetcode-cn.com/problems/design-circular-deque/
 */