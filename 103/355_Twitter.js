/** 
 * 二叉堆的结点
 */
class Node {
    constructor(time, id, k, i) {
        // 固定字段 key，二叉堆按它来排序
        this.key = time;
        // 其余信息可依据上下文自定义
        this.id = id;
        this.k = k;  // 第k个数组的第i个元素
        this.i = i;
    }
}
/** 
 * 二叉堆
 */
class BinaryHeap {
    heap = [new Node()]; // 下标从1开始（父子的下标关系更舒服些），所以位置0放个空结点
    type = "max"; // 默认大根堆
    gt = (a, b) => a.key > b.key; // greater than

    constructor(type) {
        // 若是小根堆，则重写 greater than 函数
        if (type === "min") {
            this.type = type;
            this.gt = (a, b) => a.key < b.key;
        }
    }
    empty() {
        return this.heap.length === 1;
    }
    push(node) {
        this.heap.push(node);
        this.heapifyUp(this.heap.length - 1); // 向上调整
    }
    pop() {
        if (this.empty()) return null;
        const root = Object.assign({}, this.heap[1]);
        this.heap[1] = this.heap[this.heap.length - 1];
        this.heap.pop();
        this.heapifyDown(1); // 向下调整
        return root;
    }
    getRoot() {
        return this.empty() ? null : this.heap[1];
    }
    // 带参数可兼容任意位置
    heapifyUp(child) {
        while (child > 1) {
            let p = parseInt(child / 2); // parent
            // 若父亲已经比孩子大了，则退出
            if (this.gt(this.heap[p], this.heap[child])) break;
            // 否则，交换位置，继续上调
            [this.heap[p], this.heap[child]] = [this.heap[child], this.heap[p]];
            child = p;
        }
    }
    heapifyDown(p) {
        const size = this.heap.length;
        let l = p * 2; // leftChild
        while (l < size) {
            // 取左右子结点中值较大的那个
            let bigger = l;
            let r = l + 1;
            if (r < size && this.gt(this.heap[r], this.heap[l])) bigger = r;
            // 若父结点已经比左右子都大了，则退出
            if (this.gt(this.heap[p], this.heap[bigger])) break;
            // 否则，交换位置，继续下调
            [this.heap[p], this.heap[bigger]] = [this.heap[bigger], this.heap[p]];
            p = bigger;
            l = p * 2;
        }
    }
}
/**************************
 *
 *  题目本身，就还用原型链了
 *  https://leetcode-cn.com/problems/design-twitter/
 *
 **************************/
var Twitter = function () {
    this.users = new Map();
    this.count = 0; // 时间戳(new Date()).getTime()会重复，所以改用计数器
};
Twitter.prototype.addUser = function (userId) {
    if (!this.users.has(userId)) {
        this.users.set(userId, {
            followList: new Set(), // 关注了谁，数据结构-集合
            tweetList: []  // 发的推文，数据结构-在头部插入
        });
    }
}
/** 
 * @param {number} userId 
 * @param {number} tweetId
 * @return {void}
 */
Twitter.prototype.postTweet = function (userId, tweetId) {
    if (!this.users.has(userId)) this.addUser(userId);
    // 推文格式 [counter, id]，在头部插入
    this.users.get(userId).tweetList.unshift([this.count++, tweetId]);
};

/** 
 * @param {number} userId
 * @return {number[]}
 */
Twitter.prototype.getNewsFeed = function (userId) {
    if (!this.users.has(userId)) return [];

    // 推文list：放入自己的、关注列表的
    const list = [];
    const self = this.users.get(userId);
    self.tweetList.length && list.push(self.tweetList);
    self.followList.forEach(uid => {
        if (this.users.has(uid)) {
            let tweet = this.users.get(uid).tweetList;
            tweet.length && list.push(tweet);
        }
    });

    // 思路：n个降序数组，归并排序，只要前10个元素
    const n = list.length;
    const maxHeap = new BinaryHeap(); // 大根堆
    for (let k = 0; k < n; k++) {
        maxHeap.push(new Node(...list[k][0], k, 0)); // list[k][0] 即第k个数组的第0个元素
    }
    let ans = [];
    while (!maxHeap.empty()) {
        if (ans.length === 10) break;
        let max = maxHeap.pop();
        ans.push(max.id);
        const k = max.k; // 第k个数组的第i个元素，即 list[k][i]
        const i = max.i;
        let next = i + 1;   // 若此数组还有更多元素，则入堆
        if (next < list[k].length) {
            maxHeap.push(new Node(...list[k][next], k, next));
        }
    }
    return ans;
};

/** 
 * @param {number} followerId 
 * @param {number} followeeId
 * @return {void}
 */
Twitter.prototype.follow = function (followerId, followeeId) {
    if (!this.users.has(followerId)) this.addUser(followerId);
    if (!this.users.has(followeeId)) this.addUser(followeeId);
    this.users.get(followerId).followList.add(followeeId);
};

/** 
 * @param {number} followerId 
 * @param {number} followeeId
 * @return {void}
 */
Twitter.prototype.unfollow = function (followerId, followeeId) {
    if (this.users.has(followerId))
        this.users.get(followerId).followList.delete(followeeId);
};

/**
 * Your Twitter object will be instantiated and called as such:
 * var obj = new Twitter()
 * obj.postTweet(userId,tweetId)
 * var param_2 = obj.getNewsFeed(userId)
 * obj.follow(followerId,followeeId)
 * obj.unfollow(followerId,followeeId)
 */