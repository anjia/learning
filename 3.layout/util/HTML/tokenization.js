/**
 * 词法分析：token解析、属性解析
 * 
 * 解析HTML这类文本结构一定会用到状态机
 * 创建状态机之前，要先知道 HTML 的语法，13.2.5 Tokenization
 *      https://html.spec.whatwg.org/multipage  
 * 标准里已经规定好了HTML的状态
 *      状态+状态迁移+状态里的计算(即业务逻辑)
 */

const dom = require('./dom'); // 语法分析：token→DOM树
const emit = dom.emit;
const stack = dom.stack;

const EOF = Symbol('EOF'); // EOF: End of File

let currentToken = null; // tag不论多么复杂是当成一个token来处理的（同时存了 tagName 和 attributes ）
let currentAttribute = null;

function data (c){
    if(c === '<'){
        return tagOpen;
    }else if(c === EOF){
        emit({
            type: 'EOF'
        });
        return;
    }else{
        emit({
            type: 'text',
            content: c  // tokenizition时会一个字符一个字符，在构造树时会再拼起来
        });
        return data; // 先处理tag，其它的忽略
    }
}

/**
 * tag：开始标签、结束标签、自封闭标签
 */
function tagOpen(c){
    // /html>
    if(c === '/'){
        return endTagOpen;
    // html>, br/>
    }else if(c.match(/^[a-zA-Z]$/)){
        currentToken = {
            type: 'startTag',
            tagName: ''
            // isSelfClosing: false,  // 用属性来标识是自封闭标签
        };
        return tagName(c);
    }else{
        emit({
            type: 'text',
            content: c
        });
        return;
    }
}
function endTagOpen(c){
    if(c.match(/^[a-zA-Z]$/)){
        currentToken = {
            type: 'endTag',
            tagName: ''
        };
        return tagName(c);
    }else if(c === '>'){
        // 报错
    }else if(c === EOF){
        // 报错
    }else{

    }
}
function tagName(c){
    // 4种有效的空白符
    if(c.match(/^[\t\n\f ]$/)){
        return beforeAttributeName;
    }else if(c === '/'){  // 自封闭标签
        return selfClosingStartTag;
    }else if(c.match(/^[a-zA-Z]$/)){
        currentToken.tagName += c;
        return tagName;
    }else if(c === '>'){  // 开始/结束标签，再回到data
        emit(currentToken);
        return data;
    }else{
        currentToken.tagName += c;
        return tagName;
    }
}
function selfClosingStartTag(c){
    // 只有'>'是有效的，其余都报错
    if(c === '>'){
        currentToken.isSelfClosing = true;
        emit(currentToken);
        return data;
    }else if(c === EOF){

    }else{

    }
}

/**
 * 以下为：解析属性
 */
function beforeAttributeName(c){
    if(c.match(/^[\t\n\f ]$/)){
        return beforeAttributeName;
    }else if(c === '/' || c === '>' || c === EOF){
        return afterAttributeName(c);
    }else if(c === '='){
        // 错误
    }else{
        currentAttribute = {
            name: '',
            value: ''
        };
        return attributeName(c); 
    }
}
function afterAttributeName(c){
    if(c.match(/^[\t\n\f ]$/)){
        return afterAttributeName;
    }else if(c==='/'){
        return selfClosingStartTag;
    }else if(c==='='){
        return beforeAttributeValue;
    }else if(c==='>'){
        setTokenAttributeNameAndValue();
        emit(currentToken);
        return data;
    }else if(c===EOF){

    }else{
        setTokenAttributeNameAndValue();
        currentAttribute = {
            'name': '',
            'value': ''
        };
        return attributeName(c);
    }
}
function attributeName(c){
    if(c.match(/^[\t\n\f ]$/) || c==='/' || c==='>' || c===EOF){
        return afterAttributeName(c);
    }else if(c==='='){
        return beforeAttributeValue;
    }else if(c==='\u0000'){

    }else if(c==='"' || c==='\'' || c==='<'){

    }else{
        currentAttribute.name += c;
        return attributeName;
    }
}
function beforeAttributeValue(c){
    if(c.match(/^[\t\n\f ]$/) || c==='/' || c==='>' || c===EOF){
        return beforeAttributeValue;
    }else if(c === '"'){
        return doubleQuotedAttributeValue;
    }else if(c === '\''){
        return singleQuotedAttributeValue;
    }else if(c === '>'){
        // return data;
    }else{
        return UnquotedAttributeValue(c);
    }
}
function doubleQuotedAttributeValue(c){
    if(c==='"'){
        setTokenAttributeNameAndValue();
        return afterQuotedAttributeValue;
    }else if(c==='\u0000'){

    }else if(c===EOF){

    }else{
        currentAttribute.value += c;
        return doubleQuotedAttributeValue;
    }
}
function singleQuotedAttributeValue(c){
    if(c==='\''){
        setTokenAttributeNameAndValue();
        return afterQuotedAttributeValue;
    }else if(c==='\u0000'){

    }else if(c===EOF){

    }else{
        currentAttribute.value += c;
        return singleQuotedAttributeValue; // ???
    }
}
function UnquotedAttributeValue(c){
    if(c.match(/^[\t\n\f ]$/)){
        setTokenAttributeNameAndValue();
        return beforeAttributeName;
    }else if(c==='/'){
        setTokenAttributeNameAndValue();
        return selfClosingStartTag;
    }else if(c==='>'){
        setTokenAttributeNameAndValue();
        emit(currentToken);
        return data;
    }else if(c==='\u0000'){

    }else if(c==='"' || c==='\'' || c==='<' || c==='=' || c==='`'){

    }else if(c===EOF){

    }else{
        currentAttribute.value += c;
        return UnquotedAttributeValue;
    }
}
function afterQuotedAttributeValue(c){
    if(c.match(/^[\t\n\f ]$/)){
        return beforeAttributeName;
    }else if(c==='/'){
        return selfClosingStartTag;
    }else if(c==='>'){
        setTokenAttributeNameAndValue();
        emit(currentToken);
        return data;
    }else if(c===EOF){
    
    }else{
        currentAttribute.value += c;
        return doubleQuotedAttributeValue; // ???
    }
}

/**
 * helpers
 */
function setTokenAttributeNameAndValue(){
    // 以防和自定义的重名，故加一层专门放属性
    if(!currentToken.attributes){
        currentToken.attributes = {};
    }
    currentToken.attributes[currentAttribute.name] = currentAttribute.value;
}

module.exports.data = data;
module.exports.EOF = EOF;
module.exports.stack = stack;