/**
 * 社区用的更多的是 ll 风格
 * 这里是用另外一种语法分析算法 lr
 *
 * 没直接用BNF，而是选择了替代的JSON结构，来表示基础的语法定义
 *      或：‘兄弟’数组
 *      与：‘一个’数组
 */
export let syntax = {
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