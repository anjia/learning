/**
 * 下一步：逐级地执行语法树，即“语义分析”
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

export {
    evaluate as SenmanticAnalysis
};