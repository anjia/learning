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
        ['AssignmentExpression']
    ],
    AssignmentExpression: [
        // ['LeftHandsideExpression', '=', 'RightHandsideExpression'], // 左值表达式 一定是 右值表达式，即能出现在左边的就一定能出现在右边
        // ['RightHandsideExpression'], // 所以JS里没有定义RightHandsideExpression
        // ['LeftHandsideExpression', '=', 'AdditiveExpression'],  // 在JS标准中，LeftHandsideExpression的优先级是高于PrimaryExpression的。简化处理 LeftHandsideExpression 目前只支持 Identifier（不支持member）
        // ['Identifier', '=', 'AdditiveExpression'],
        // ['LeftHandsideExpression', '=', 'AssignmentExpression'],  // 右递归暂不支持（=是右结合的），所以暂时不支持连等了 a=b=1（语法上支持，但是不推荐这么用）
        // ['AdditiveExpression'],
        ['LeftHandsideExpression', '=', 'LogicalORExpression'],   // 这里永远放优先级最低的
        ['LogicalORExpression']
    ],
    LogicalORExpression: [
        ['LogicalANDExpression'],
        ['LogicalORExpression', '||', 'LogicalANDExpression']
    ],
    LogicalANDExpression: [
        ['AdditiveExpression'],
        ['LogicalANDExpression', '&&', 'AdditiveExpression']
    ],
    AdditiveExpression: [
        ['MultiplicativeExpression'],
        ['AdditiveExpression', '+', 'MultiplicativeExpression'],
        ['AdditiveExpression', '-', 'MultiplicativeExpression']
    ],
    MultiplicativeExpression: [
        ['LeftHandsideExpression'],   // PrimaryExpression -> LeftHandsideExpression
        ['MultiplicativeExpression', '*', 'LeftHandsideExpression'],
        ['MultiplicativeExpression', '/', 'LeftHandsideExpression']
    ],
    // 需要关注它们3个的优先级：（其它语言class是不能用变量的，所以这是JS特有的问题）
    //     new f()();
    //     new f().a();
    //     new f().a().a;
    // 标准里的new是分布在这三者之间（new运算是最复杂的一种运算）
    //     MemberExpression >
    // call和new是同一优先级的
    LeftHandsideExpression: [
        ['CallExpression'],
        ['NewExpression']
    ],
    CallExpression: [
        ['MemberExpression', 'Arguments'],  // 必须要有Arguments(和函数一起做)
        ['CallExpression', 'Arguments']
    ], // new a();
    NewExpression: [
        ['MemberExpression'],
        ['new', 'NewExpression']  // 暂不能带参数 new a(1,2)
    ], // new a;
    MemberExpression: [
        ['PrimaryExpression'],
        ['PrimaryExpression', '.', 'Identifier'],
        ['PrimaryExpression', '[', 'Expression', ']']
    ], // new a.b();
    PrimaryExpression: [
        ['(', 'Expression', ')'],
        ['Literal'],
        ['Identifier'] /*IdentifierName 是个复杂的东西，这里简化为Identifier（早期是叫Identifier 会导致属性不能叫new class等--所以HTML里只能叫 clasName，当然这是JS3.0之前的问题）*/
        /*Identifier 存哪？C和C++会直接操作OS存在栈/堆上, JS会存在ExecutionContext*/
    ],
    Literal: [
        ['NumberLiteral'],
        ['StringLiteral'],
        ['BooleanLiteral'],
        ['NullLiteral'],
        ['RegularExpressionLiteral'], /*需要词法和语法的配合 / */
        ['ObjectLiteral'], /* {} */
        ['ArrayLiteral']  /* [] */
    ],
    ObjectLiteral: [
        ['{', '}'],  /*是否允许空-在编译器领域也是划分流派的*/  /* {}和空语句块的冲突(语句时) */
        ['{', 'PropertyList', '}']
    ],
    PropertyList: [
        ['Property'],
        ['PropertyList', ',', 'Property']
    ],
    Property: [
        ['StringLiteral', ':', 'Expression'],  /* Expression 不用;的（需要;的是ExpressionStatement） */
        ['Identifier', ':', 'Expression']   // AdditiveExpression
    ]
};