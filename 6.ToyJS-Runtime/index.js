import { parseSyntaxTree } from './SyntaxParser/index.js';
import { Evaluator } from './Runtime/evaluator.js';

// 为了不受JS里“正常”转义字符的干扰，将source写到HTML里。
const textArea = document.getElementById('source');
document.getElementById('btn').addEventListener('click', e => {
    let source = textArea.value;
    let tree = parseSyntaxTree(source);
    (new Evaluator()).evaluate(tree);
});

// var name;
// let age;
// if (age) 2;
// function foo() { let sex; }
// //1+2; //bug: Expression.（TODO.表达式时）

// let source = `
//     'hello';
//     // 10;
//     // 65536;
//     // 0b1101; //13
//     // 0o777;  //511
//     // 0xfff;  //4095
//     // 0xFFFF; //65535
// `;
// let tree = parse(source);
// evaluate(tree);