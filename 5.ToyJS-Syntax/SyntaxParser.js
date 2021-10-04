/**
 * 社区用的更多的是 ll 风格
 * 这里是用另外一种语法分析算法 lr
 *
 * 没直接用BNF，而是选择了替代的JSON结构，来表示基础的语法定义
 *      或：‘兄弟’数组
 *      与：‘一个’数组
 */
import { scan } from './LexParser.js';

let syntax = {
    Program: [
        ['StatementList', 'EOF']
    ],
    StatementList: [
        ['Statement'],
        ['StatementList', 'Statement']
    ],
    Statement: [
        ['ExpressionStatement'],
        ['IfStatement'],
        ['VariableDeclaration'],
        ['FunctionDeclaration']
    ],
    IfStatement: [
        ['if', '(', 'Expression', ')', 'Statement']
    ],
    VariableDeclaration: [
        ['var', 'Identifier', ';'],
        ['let', 'Identifier', ';']
    ],
    FunctionDeclaration: [
        ['function', 'Identifier', '(', ')', '{', 'StatementList', '}']
    ],
    ExpressionStatement: [
        ['Expression', ';']  /*JS有对应的规则可自动插入;*/
    ],
    Expression: [
        ['AdditiveExpression']
    ],
    AdditiveExpression: [
        ['MultiplicativeExpression'],
        ['AdditiveExpression', '+', 'MultiplicativeExpression'],
        ['AdditiveExpression', '-', 'MultiplicativeExpression']
    ],
    MultiplicativeExpression: [
        ['PrimaryExpression'],
        ['MultiplicativeExpression', '*', 'PrimaryExpression'],
        ['MultiplicativeExpression', '/', 'PrimaryExpression']
    ],
    PrimaryExpression: [
        ['(', 'Expression', ')'],
        ['Literal'],
        ['Identifier']
    ],
    Literal: [
        ['NumberLiteral'],
        ['StringLiteral'],
        ['BooleanLiteral'],
        ['NullLiteral'],
        ['RegularExpression']
    ]
};

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
console.log('hash:', hash);
console.log('广度优先展开的语法树:', start);

console.groupEnd();
// debugger;

/**
 * 下一步：将lexer产出的token流，初步处理成 terminal symbol
 * eg. Punctuator, Keywords （这是词法定义和语法定义之间的一个小差别）
 *      所以，会加一些硬逻辑来处理这种映射关系
 *      最终目标：token -> terminal symbol (就能解析出来代码的语法结构了)
 * 
 * 语法分析的过程，拿到每个symbol之后，让它在状态机里跑一圈
 * 最终输出：语法树
 */
function parse(source) {
    let stack = [start];
    let symbolStack = [];

    // non-terminal symbol 是要靠 terminal symbol 产生的
    // 当一条规则走完了，比如 let a; 我们就需要将它合并成一个非终结符
    // 合成什么呢？在编译原理里，就称之为 reduce
    /**
     * reduce to a non-terminal symbol
     * 两个要素：
     *      1. reduce的个数 + 完了之后退回去
     *      2. reduce什么样的symbol
     */
    function reduce() {
        let state = stack[stack.length - 1];
        if (state.$reduceType) {
            let children = []; //被reduce的就是子元素，为了不浪费把它们存起来
            for (let i = 0; i < state.$reduceLength; i++) {
                stack.pop();
                children.push(symbolStack.pop());
            }
            // console.warn('reduce() nonTerminalSymbol:', state.$reduceType);
            // 移入一个新的symbol
            // create a non-terminal symbol and shift it
            return {
                type: state.$reduceType,
                children: children.reverse()
            };
        } else {
            throw new Error('unexpected token');
        }
    }
    function shift(symbol) {
        let state = stack[stack.length - 1];
        if (symbol.type in state) {
            // console.log('shift() terminalSymbol:', symbol);
            stack.push(state[symbol.type]);
            symbolStack.push(symbol);
        } else {
            // reduce to non-terminal symbols
            shift(reduce());
            shift(symbol);
            // console.warn('shift() nonTerminalSymbol:', symbol);
        }
    }

    for (let symbol/*terminal symbols*/ of scan(source)) {
        console.log('terminal symbol:', symbol);
        shift(symbol);
    }

    let tree = reduce();
    console.log('语法树：', tree);
    return tree;
}

console.group('2.将lexer产生的token流 -> terminal symbols -> 在状态机里跑一圈 -> 语法树');
let source = `
    1;
    var name;
    let age;
    if (age) 2;
    function foo() { let sex; }
    //1+2; //bug: Expression.（TODO.表达式时）
`;
// debugger;
// parse(source);
let tree = parse(source);
console.groupEnd();

/**
 * 下一步：逐级地执行语法树
 */
let evaluator = {
    Program(node) {
        return evaluate(node.children[0]);
        // return evaluate(node.children[1]);
    },
    StatementList(node) {
        if (node.children.length === 1) {
            return evaluate(node.children[0]);
        } else {
            evaluate(node.children[0]);
            return evaluate(node.children[1]);
        }
    },
    Statement(node) {
        return evaluate(node.children[0]);
    },
    VariableDeclaration(node) {
        // 变量存储在哪里，以什么形式来存储
        // Environment 执行时的环节
        console.log('Declare Variable:', node.children[1].name);
    },
    FunctionDeclaration(node) {
        console.log(node.type, ':', node.children[1].name);
    },
    IfStatement(node) {
        console.log('IfStatement ');
        return evaluate(node.children[2]);
        // evaluate(node.children[2]);
        // return evaluate(node.children[4]);
    },
    ExpressionStatement(node) {
        return evaluate(node.children[0]);
    },
    Expression(node) {
        return evaluate(node.children[0]);
    },
    AdditiveExpression(node) {
        return evaluate(node.children[0]);
    },
    MultiplicativeExpression(node) {
        return evaluate(node.children[0]);
    },
    PrimaryExpression(node) {
        return evaluate(node.children[0]);
    },
    Identifier(node) {
        console.log(node.type, ':', node.name);
    },
    Literal(node) {
        return evaluate(node.children[0]);
    },
    NumberLiteral(node) {
        console.log(node.type, ':', node.value);
    },
    EOF() {
        return null;
    }
};
function evaluate(node) {
    if (evaluator[node.type]) {
        return evaluator[node.type](node);
    }
}

console.group('3.逐级执行语法树');
evaluate(tree);
console.groupEnd();