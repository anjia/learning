- 词法：输入的元素（一般顶层的都叫 InputElement）
- 语法
- 语义

## 词法

输入的元素（一般顶层的都叫 InputElement）

<pre>
InputElement ::= WhiteSpace | LineTerminator | Comment | Token

WhiteSpace ::= " " | "　"
LineTerminator ::= "\n" | "\r"

Comment ::= SingleLineComment | MultilineComment
SingleLineComment ::= "/" "/" <any>*
MultilineComment ::= "/" "*" ([^*] | * [^/])* "*" "/"

Token ::= Literal | Keywords | Identifier | Punctuator
Literal ::= NumberLiteral | BooleanLiteral | StringLiteral | NullLiteral
Keywords ::= "if" | "else" | "for" | "while" | "function" | ...
Punctuator ::= "+" | "-" | "*" | "/" | "{" | "}" | ... 
</pre>

> Unicode 的空白字符，20 多个，零宽字符-好几种  
> JavaScript 的源代码是以 Unicode 来定义的

## 语法

Program

- JS 是脚本，多条语句
- var function 和 let const 行为不太一样
- 结构化程序设计，三种结构：顺序、分支、循环

<pre>
Program ::= Statement+

Statement ::= ExpressionStatement
     | IfStatement | ForStatement | WhileStatement
     | VariableDeclaration | FunctionDeclaration | ClassDeclaration
     | BreakStatement | ContinueStatement | ReturnStatement | ThrowStatement
     | TryStatement | Block

IfStatement ::= "if" "(" Expression ")" Statement
Block ::= "{" Statement "}"
TryStatement ::= "try" "{" Statement+ "}" "catch" "(" Expression ")" "{" Statement+ "}"

ExpressionStatement ::= Expression ";"
Expression ::= AdditiveExpression
AdditiveExpression ::= MultiplicativeExpression
     | AdditiveExpression ("+" | "-") MultiplicativeExpression

MultiplicativeExpression ::= UnaryExpression
     | MultiplicativeExpression ("\*" | "/") UnaryExpression

UnaryExpression ::= PrimaryExpression
     | ("+" | "-" | "typeof") PrimaryExpression

PrimaryExpression ::= "(" Expression ")" | Literal | Identifier
</pre>
<!-- 到底左递归 还是 右递归？ -->
<!-- 要消除左递归，所以：应该写右递归！！！ -->
<!-- 但是：左右递归的“结合规则”不同，eg.减法就是左结合的 -->

<!-- 我的正则不行！！！处理文本！！！ -->

注意：

1. 终结符和非终结符 `Symbol`
2. "/" "/" 可以连写"//"么？ 不可以，因为是”词法“环节-输入是单个字符
3. Object 是个语法结构，是由\*组合出来的。词法里没有。
4. 词法里也没有 UndefinedLiteral，它是全局对象上的一个属性

<!-- 视角不同：学习一个东西 vs 研究语言的实现 -->

## 更多

1. WhiteSpace ::
   - `<TAB>` 制表符
   - `<VT>` 纵向制表符，很少用
   - `<FF>` 进纸（打印机时代，打印处不动纸动）
   - `<SP>` space 空格
   - `<NBSP>` 空格-但是不影响分词断行-不断行（Non-Breaking Space）
   - `<ZWNBSP>` zero width NBSP，没宽度，feff（中间还被用来 BOM Bype-Order-Mark, 在文件流里标识数据流的编码格式）
   - `<USP>` Unicode 在空格分类下面的所有的空格
2. LineTerminator :: （在 JS 里，换行符有自己的作用-自动插入分号规则，所以换行符不能归到空白符里）
   - `<LF>` 在 ASCII 范围, Line Feed, `\n`, 换行
   - `<CR>` 在 ASCII 范围, Carriage Return, `\r`, Return/Enter(打字机的位置会到行首)
   - `<LS>` 在 Unicode 范围
   - `<PS>` 在 Unicode 范围
     > 最早 windows 下的文本格式，所有的换行都是 CR LF，\r\n
3. IdentifierName ::
   - 标识符 Name，不仅仅是标识符，还有 get, set, async, await (它们不是关键字)
4. Identifierpart ::
   - 它两可以用来做代码混淆
     - `<ZWJ>` zero width joiner
     - `<ZWNJ>` zero width no joiner
5. Punctuator
   - 有操作符、有表示程序结构的
