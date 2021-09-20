/**
 * 构建DOM树：startTag/endTag + Stack -> DOM Tree
 *    tag: 开始/自闭合+结束（Tag配对）
 *    text              （Text合并）
 **/
const css = require('../CSS/computing');
const layout = require('../Layout/layout');

let isLog = false;

let stack = [{
    type: 'document',
    children: []
}];
let currentTextNode = null;

// token 是一个一个过来的
function emit(token) {
    // if (isLog) {
    //     // if (token.type === 'startTag' || token.type === 'endTag') {
    //     if (token.type === 'endTag') {
    //         console.log('DOM token:', token.type, token.tagName);
    //     } else if (token.content != ' ' && token.content != '\n') {
    //         // console.log('DOM token:', token.type, currentTextNode && currentTextNode.content);
    //     }
    // }

    let top = stack[stack.length - 1];

    if (token.type === 'startTag') {
        let element = {
            type: 'element',  // element是抽象的概念(DOM树中的)，tag是纯文本性的'<xx>'
            tagName: token.tagName,
            children: [],
            attributes: []
        };
        for (let p in token.attributes) {
            element.attributes.push({
                name: p,
                value: token.attributes[p]
            });
        }
        // 计算的时机。
        // 所以在toy-browser里，<style>标签的位置需要靠前，
        // 即遇到startTag的时候CSS规则已经收集完毕
        css.computeCSS(element, stack);

        // 父子关系：top 是当前元素的父
        top.children.push(element);
        element.parent = top;

        // 入栈
        if (!token.isSelfClosing) {
            stack.push(element);
        }

        currentTextNode = null;

        if (token.tagName === 'body') {
            isLog = true;
        }
    } else if (token.type === 'endTag') {
        if (top.tagName != token.tagName) {
            // 正常浏览器是会自动配对/补齐/嵌套的，详见标准里的 Tree construction
            throw new Error('Tag start-end doesn\'t match!');
        } else {
            // ++++++++遇到style标签，执行添加CSS规则的操作+++++++
            // 真实的浏览器需要考虑更多情况以及网络请求和异步处理
            if (top.tagName === 'style') {
                css.addCSSRules(top.children[0].content);
            }
            // +++++++++ flex布局需要知道所有的子元素，故选到结束标签这里 ++++++++++
            layout(top);

            stack.pop(); // 出栈            
        }
        currentTextNode = null;
    } else if (token.type === 'text') {
        if (currentTextNode === null) {
            currentTextNode = {
                type: 'text',
                content: ''
            };
            top.children.push(currentTextNode);
        }
        currentTextNode.content += token.content;
    }
}

module.exports.emit = emit;
module.exports.stack = stack;