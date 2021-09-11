/**
 * 词法分析：token解析，属性解析
 * 语法分析：token→DOM树（入栈/合并text节点 + 出栈）
 *    简化版直接用栈来实现，不用考虑各种情况eg.标签自动闭合/是否能相互嵌套等
 *    简化版“不用对使用者友好，只用对实现者友好”（这句很萌）
 */
const tokenization = require('./tokenization');

module.exports.parseHTML = function parseHTML(html){
    console.log('====== util/HTML/parser.js ======');
    // console.log(html);
    let state = tokenization.data; // HTML标准里叫data
    for(let c of html){
        if(typeof state === 'function'){
            state = state(c);
        }
    }
    state = state(tokenization.EOF);  // 读取的是文件也需要写
    return tokenization.stack[0];
}