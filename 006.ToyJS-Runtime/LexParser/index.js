/**
 * 正则表达式的“捕获行为”，可以对正则表达式做一层封装
 * 只分组不捕获 (?:   )
 */
class XRegExp {
    constructor(source, flag, root = 'root') {
        this.table = new Map();
        this.regexp = new RegExp(this.compileRegExp(source, root, 0).source, flag);
        // console.log(this.regexp);
        // console.log(this.table);
    }
    compileRegExp(source, name, start) {
        if (source[name] instanceof RegExp) {
            return {
                source: source[name].source,
                length: 0
            };
        }
        let length = 0;

        // 确保每一层都是箭头函数，否则this的值就错了
        let regexp = source[name].replace(/\<([^>]+)\>/g, (str, $1) => {
            this.table.set(start + length, $1);
            this.table.set($1, start + length);
            length++;
            let r = this.compileRegExp(source, $1, start + length);
            length += r.length;
            return '(' + r.source + ')';
        });
        return {
            source: regexp,
            length: length
        };
    }
    // 不仅代理，有逻辑
    exec(string) {
        let r = this.regexp.exec(string);
        // 0位置是标准的值
        for (let i = 1; i < r.length; i++) {
            if (r[i] !== (void 0)) {
                // console.log('===New:', r[i], this.table.get(i - 1));
                r[this.table.get(i - 1)] = r[i];
            }
        }
        // console.log('===Result:', r);
        return r;
    }
    // getter setter 只是一个简单的代理
    get lastIndex() {
        return this.regexp.lastIndex;
    }
    set lastIndex(value) {
        return this.regexp.lastIndex = value;
    }
}

/**
 * 新特性* 函数生成器
 *   遇到 yield() 函数将暂停
 *   调用 next() 则继续执行
 */
export function* scan(str) {
    let regexp = new XRegExp({
        InputElement: "<WhiteSpace>|<LineTerminator>|<Comments>|<Token>",
        WhiteSpace: / /,
        LineTerminator: /\n/,
        Comments: "<SingleLineComment>|<MultiLineComment>",
        SingleLineComment: /\/\/[^\n]*/,
        MultiLineComment: /\/\*(?:[^*]|\*[^\/])*\*\//,
        Token: "<Literal>|<Keywords>|<Identifier>|<Punctuator>", /*Keywords要写在Identifier之前，因为它也都符合Identifier规范*/
        Literal: "<NumberLiteral>|<BooleanLiteral>|<StringLiteral>|<NullLiteral>",
        NumberLiteral: /0x[0-9a-fA-F]+|0o[0-7]+|0b[01]+|(?:[1-9][0-9]*|0)(?:\.[0-9]*)?|\.[0-9]+/,
        BooleanLiteral: /true|false/,
        StringLiteral: /"(?:[^"\n]|\\[\s\S])*"|'(?:[^'\n]|\\[\s\S])*'/,
        NullLiteral: /null/,
        Keywords: /if|else|for|while|function|let|var|new/,  /*TODO*/
        Identifier: /[a-zA-Z_$][a-zA-Z_$0-9]*/,  /*TODO*/
        Punctuator: /\|\||\&\&|\||\+|-|\*|\\|=|\<|\>|==|\?|\(|\)|\{|\}|\+\+|=>|\.|\[|\]|;|,|:/  /*词法分析时不需要关注它们的结构,语法阶段时再配对。一般情况是占得字符越多的应该写前面 */
    }, 'g', 'InputElement');

    // 返回所有的终结符 terminal symbol
    while (regexp.lastIndex < str.length) {
        let r = regexp.exec(str);

        if (r.WhiteSpace) {

        } else if (r.LineTerminator) { //会有自动加;的逻辑

        } else if (r.Comments) {

        } else if (r.NumberLiteral) {  // ?? Numberic
            yield {
                type: 'NumberLiteral',
                value: r[0]
            };
        } else if (r.BooleanLiteral) {
            yield {
                type: 'BooleanLiteral',
                value: r[0]
            };
        } else if (r.StringLiteral) {
            yield {
                type: 'StringLiteral',
                value: r[0]
            };
        } else if (r.NullLiteral) {
            yield {
                type: 'NullLiteral',
                value: null
            };
        } else if (r.Identifier) {
            yield {
                type: 'Identifier',
                name: r[0]
            };
        } else if (r.Keywords) {
            yield {
                type: r[0]
            };
        } else if (r.Punctuator) {
            yield {
                type: r[0]
            };
        } else {
            throw new Error('unexpected token: ', r[0]);
        }

        if (!r[0].length) {
            break;
        }
    }
    yield {
        type: 'EOF'
    };
}


// let source = `
// for (let i = 0; i < 3; i++) {
//     for (let j = 0; j < 3; j++) {
//         let cell = document.createElement('div');
//         cell.classList.add('cell');
//         cell.innerText = pattern[i * 3 + j] == 2 ? '❌' :
//             pattern[i * 3 + j] == 1 ? "⭕️" : "";
//         cell.addEventListener('click', () => userMove(j, i));
//         board.appendChild(cell);
//     }
//     board.appendChild(document.createElement('br'));
// }
// // hi
// /* hello world*/
// 0 1 2 9
// 10 11 19 20 21 29 30
// 100 101 199
// 13 5 7 12200 0
// 0.124 12.5 
// 3.1415926 .321
// /*good job*/
// let name = 'Jack';
// let age = 18;
// let str = "Hello~~";
// `;
// // 迭代器 iterator, 这才是它原汁原味的用法
// for (let element of scan(source)) {
//     console.log(element);
// }