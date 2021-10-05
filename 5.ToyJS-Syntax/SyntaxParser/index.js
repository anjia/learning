import { scan } from '../LexParser/index.js';
import { start } from './closure.js';

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
    return tree;
}

export {
    parse as SyntaxTree
}