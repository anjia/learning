import { syntax } from './syntax.js';

/**
 * 下一步：用语法树来分析token
 * 思考：我们能接受的第一个token是什么？
 *      所以，需要展开语法树（即求closure），以得到所有能接受的非终结符
 *      此时，广度优先搜索
 * 目前是对语法树进行处理，构造一个状态机（让它能帮我们处理语法分析）
 */
let hash = {};
/* 求 closure */
function closure(state) {
    hash[JSON.stringify(state)] = state; // 备用。已经被展开的，就不再展开了，直接“环”起来

    // 先将state里的symbol的名字塞进queue里
    let queue = [];
    for (let symbol in state) {
        if (symbol.match(/^\$/)) {
            return;
        }
        queue.push(symbol);
    }
    // 广度优先
    while (queue.length) {
        // push() pop()能用数组模拟栈，入栈出栈
        // push() shift() 就能像队列一样使用数组，入队出队
        let symbol = queue.shift();
        // console.log(symbol);
        // 只展开 non-terminal symbol
        if (syntax[symbol]) {
            for (let rule of syntax[symbol]) {
                // 只push非递归的
                if (!state[rule[0]]) {
                    queue.push(rule[0]);
                }
                let current = state;
                for (let part of rule) {
                    if (!current[part]) {
                        current[part] = {}; // 新state
                    }
                    current = current[part];
                }
                current.$isRuleEnd = true;
                // current.$reduce = true;
                // current.$reduceState = state;
                current.$reduceType = symbol;
                current.$reduceLength = rule.length; // 往前走几个
            }
        }
    }
    // 此时：第一层symbol已经被展开了
    for (let symbol in state) {
        if (symbol.match(/^\$/)) {
            return;
        }
        // 让状态机里：有环
        if (hash[JSON.stringify(state[symbol])]) {
            state[symbol] = hash[JSON.stringify(state[symbol])];
        } else {
            // 若没处理过，再递归展开
            closure(state[symbol]);
        }
    }
}
// 两个状态：初始状态+结束状态
// 大思路：将整个分析过程看成一个状态迁移，从 start → end
let end = {
    $isEnd: true
};
let start = {
    'Program': end   // Program, IfStatement, VariableDeclaration, ExpressionStatement
};

console.group('1.展开语法树/广度优先/求closure -> 所有能接受的non-terminal symbol -> 状态机');
// 求closure，将start状态里的'Program'展开
closure(start);
// console.log('hash:', hash);
console.log('广度优先展开的语法树:', start);

console.groupEnd();
// debugger;

export { start };