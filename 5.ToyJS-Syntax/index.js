import { SyntaxTree } from './SyntaxParser/index.js';
import { SenmanticAnalysis } from './Semantic/index.js';

let source = `
    1;
    var name;
    let age;
    if (age) 2;
    function foo() { let sex; }
    //1+2; //bug: Expression.（TODO.表达式时）
`;
document.getElementById('code').innerHTML = source;

console.group('2.将lexer产生的token流 -> terminal symbols -> 在状态机里跑一圈 -> 语法树');
let tree = SyntaxTree(source);
console.log('语法树：', tree);
console.groupEnd();

console.group('3.逐级执行语法树');
SenmanticAnalysis(tree);
console.groupEnd();