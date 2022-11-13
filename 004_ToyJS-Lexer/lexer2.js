function compileRegExp(xRegExp, name) {
    if (xRegExp[name] instanceof RegExp) {
        return xRegExp[name].source;
    }
    let regexp = xRegExp[name].replace(/\<([^>]+)\>/g, function (str, $1) {
        return compileRegExp(xRegExp, $1);
    });
    return regexp;
}

function scan(str) {
    /**
     * 让正则表达式看起来像我们的产生式，方便管理
     * 每个正则表达式都可单独调试、单独写单元测试
     */
    const regExpStr = compileRegExp({
        InputElement: "<WhiteSpace>|<LineTerminator>|<Comments>|<Token>",
        WhiteSpace: / /,
        LineTerminator: /\n/,
        Comments: "<SingleLineComment>|<MultiLineComment>",
        SingleLineComment: /\/\/[^\n]*/,
        MultiLineComment: /\/\*([^*]|\*[^\/])*\*\//,
        Token: "<Literal>|<Keywords>|<Identifier>|<Punctuator>", /*Keywords要写在Identifier之前，因为它也都符合Identifier规范*/
        Literal: "<NumberLiteral>|<BooleanLiteral>|<StringLiteral>|<NullLiteral>",
        NumberLiteral: /([1-9][0-9]*|0)(\.[0-9]*)?|\.[0-9]+/,
        BooleanLiteral: /true|false/,
        StringLiteral: /"([^"\n]|\\[\s\S])*"|'([^'\n]|\\[\s\S])*'/,
        NullLiteral: /null/,
        Keywords: /if|else|for|while|function|let/,  /*TODO*/
        Identifier: /[a-zA-Z_$][a-zA-Z_$0-9]*/,  /*TODO*/
        Punctuator: /\+|-|\*|\\|=|\<|\>|==|\?|\(|\)|\{|\}|\+\+|=>|\.|\[|\]|;|,|:/  /*词法分析时不需要关注它们的结构,语法阶段时再配对 */
    }, 'InputElement');
    const regExp = new RegExp(regExpStr, 'g');
    // console.log(regExp);
    document.write('<pre>');
    while (regExp.lastIndex < str.length) {
        let r = regExp.exec(str);
        document.write(r[0]);
        // console.log(r);
        // console.log('REGEXP:', r && r[0]);
        console.log(JSON.stringify(r && r[0]));  // 输出会带双引号 ""

    }
    document.write('</pre>');
}

scan(`
for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
        let cell = document.createElement('div');
        cell.classList.add('cell');
        cell.innerText = pattern[i * 3 + j] == 2 ? '❌' :
            pattern[i * 3 + j] == 1 ? "⭕️" : "";
        cell.addEventListener('click', () => userMove(j, i));
        board.appendChild(cell);
    }
    board.appendChild(document.createElement('br'));
}
// hi
/* hello world*/
0 1 2 9
10 11 19 20 21 29 30
100 101 199
13 5 7 12200 0
0.124 12.5 
3.1415926 .321
/*good job*/
`);
