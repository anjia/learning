import {
    ExecutionContext,
    Realm,
    Reference,
    JSUndefined, // 基本类型
    JSNull,
    JSBoolean,
    JSString,
    JSNumber,
    JSObject,
    JSSymbol,
    CompletionRecord,  // 语句的执行结果
    EnvironmentRecord, // 作用域-执行记录-执行上下文
    ObjectEnvironmentRecord
} from "./runtime.js";

/**
 * 下一步：逐级地执行语法树，即“语义分析”
 * 将“语法”对应的“运行时”给添上去
 * 写一个类"执行器"，包装下代码
 */
export class Evaluator {
    constructor() {
        // 全局环境的记录
        this.realm = new Realm(); // 在JS引擎的一个新实例被建立起来的时候
        this.globalObject = new JSObject;
        this.globalObject.set('log', new JSObject);
        // 用.get()取出来，再添加call方法
        this.globalObject.get('log').call = args => {
            console.log(args);
        };
        this.ecs = [
            new ExecutionContext(
                this.realm,
                new ObjectEnvironmentRecord(this.globalObject),
                new ObjectEnvironmentRecord(this.globalObject)
            )
        ];  // 栈 ExecutionContext Stack 
    }
    // module涉及到了文件系统，需要在JS引擎之外注入
    evaluateModule(node) {
        let globalEC = this.ecs[0]; // 取globalEC
        let newEC = new ExecutionContext(
            this.realm,
            new EnvironmentRecord(globalEC.lexicalEnvironment),
            new EnvironmentRecord(globalEC.lexicalEnvironment)
        );
        this.ecs.push(newEC);
        let result = this.evaluate(node);
        this.ecs.pop();
        return result;
    }
    evaluate(node) {
        if (this[node.type]) {
            return this[node.type](node);
            // let r = this[node.type](node);
            // console.log('=== evaluate():', node, r);
            // return r;
        }
    }
    Program(node) {
        return this.evaluate(node.children[0]);
        // return this.evaluate(node.children[1]);
    }
    StatementList(node) {
        // break, continue, return, throw
        // 语句是正常的结束，还是“中断型”结束  ~~ outer/label（对应的那个外层）
        // 所以，语句的返回结果是个三元组：{类型, 返回值, label}
        if (node.children.length === 1) {
            return this.evaluate(node.children[0]);
        } else {
            let record = this.evaluate(node.children[0]);
            if (record && record.type === 'normal') {
                return this.evaluate(node.children[1]);
            } else {
                return record;
            }
        }
    }
    Statement(node) {
        return this.evaluate(node.children[0]);
    }
    VariableDeclaration(node) {
        // 变量存储在哪里，以什么形式来存储
        // Environment 执行时的环节
        // console.log('Declare Variable:', node.children[1].name);
        // debugger;
        let runningEC = this.ecs[this.ecs.length - 1];
        runningEC.lexicalEnvironment.add(node.children[1].name);

        let result = new CompletionRecord('normal', new JSUndefined, null); // 不传参，{type, value, target} 都用默认值
        console.log('    VariableDeclaration:', result);
        return result;
    }
    FunctionDeclaration(node) {
        // console.log(node.type, ':', node.children[1].name);
        let name = node.children[1].name;
        let code = node.children[node.children.length - 2];
        // 函数 = 对象 + call方法
        let func = new JSObject;
        func.call = args => {  // TODO. arguments->params
            // 执行时：会把上下文切换成它“定义”时的
            let newEC = new ExecutionContext(
                this.realm,
                new EnvironmentRecord(func.environment), // func.environment 取定义时的
                new EnvironmentRecord(func.environment)  // func.environment 取定义时的
            );
            this.ecs.push(newEC);
            this.evaluate(code);
            this.ecs.pop(); // 执行完了再pop()
        };

        // 定义：存起来（执行上下文）
        let runningEC = this.ecs[this.ecs.length - 1];
        runningEC.lexicalEnvironment.add(name);
        runningEC.lexicalEnvironment.set(name, func);
        func.environment = runningEC.lexicalEnvironment; // 作用域-存起来

        return new CompletionRecord('normal');
    }
    IfStatement(node) {
        let condition = this.evaluate(node.children[2]);
        if (condition instanceof Reference) {
            condition = condition.get();
        }
        if (condition.toBoolean().value) {
            let result = this.evaluate(node.children[4]);
            return result;
        }
    }
    WhileStatement(node) {
        while (true) {
            let condition = this.evaluate(node.children[2]);
            if (condition instanceof Reference) {
                condition = condition.get();
            }
            if (condition.toBoolean().value) {
                let record = this.evaluate(node.children[4]);
                if (record.type === 'continue') {
                    continue;
                } else if (record.type === 'break') {
                    return new CompletionRecord('normal');
                }
            } else {
                return new CompletionRecord('normal');
            }
        }
    }
    BreakStatement(node) {
        let result = new CompletionRecord('break');;
        console.log('    BreakStatement:', result);
        return result;
    }
    ContinueStatement(node) {
        let result = new CompletionRecord('continue');
        console.log('    ContinueStatement:', result);
        return result;
    }
    ExpressionStatement(node) {
        let result = this.evaluate(node.children[0]);
        if (result instanceof Reference) {
            result = result.get();
        }
        let res = new CompletionRecord('normal', result);
        console.log('    ExpressionStatement:', res);
        return res;
    }
    Expression(node) {
        return this.evaluate(node.children[0]);
    }
    AdditiveExpression(node) {
        if (node.children.length === 1) {
            return this.evaluate(node.children[0]);
        } else {
            // debugger;
            let left = this.evaluate(node.children[0]);
            let right = this.evaluate(node.children[2]);
            if (left instanceof Reference) {  // TODO. JSNumber 并不是
                left = left.get();
            }
            if (right instanceof Reference) {
                right = right.get();
            }
            if (node.children[1].type === '+') {
                return new JSNumber(left.value + right.value);
            } else if (node.children[1].type === '-') {
                return new JSNumber(left.value - right.value);
            }
        }
    }
    MultiplicativeExpression(node) {
        if (node.children.length === 1) {
            return this.evaluate(node.children[0]);
        } else {
            // TODO
        }
    }
    PrimaryExpression(node) {
        if (node.children.length === 1) {
            return this.evaluate(node.children[0]);
        } else {
            // TODO
        }
    }
    AssignmentExpression(node) {
        if (node.children.length === 1) {
            return this.evaluate(node.children[0]);
        }
        let left = this.evaluate(node.children[0]); // 一定是个Reference类型，因为语法简化成了Identifier
        let right = this.evaluate(node.children[2]);
        left.set(right);
    }
    LogicalORExpression(node) {
        if (node.children.length === 1) {
            return this.evaluate(node.children[0]);
        }
        let result = this.evaluate(node.children[0]);
        // TODO.类型转换
        if (result) {
            return result;
        } else {
            return this.evaluate(node.children[2]);
        }
    }
    LogicalANDExpression(node) {
        if (node.children.length === 1) {
            return this.evaluate(node.children[0]);
        }
        let result = this.evaluate(node.children[0]);
        // TODO.类型转换
        if (!result) {
            return result;
        } else {
            return this.evaluate(node.children[2]);
        }
    }
    LeftHandsideExpression(node) {
        return this.evaluate(node.children[0]);
    }
    NewExpression(node) {
        if (node.children.length === 1) {
            return this.evaluate(node.children[0]);
        } else if (node.children.length === 2) {
            // 创建一个新对象：创建一个空对象、执行空对象的构造函数（需要和realm有强连接）
            let cls = this.evaluate(node.children[1]);
            return cls.construct();
            /*
            //是JS所有的function所展现的一个特点，（new运算之后都发生了什么）
            let object = this.realm.Object.construct();
            let cls = this.evaluate(node.children[1]);
            let result = cls.call(object);
            if (typeof result === 'object') {
                return result;
            } else {
                return object;
            }*/
        }
    }
    CallExpression(node) {
        if (node.children.length === 1) {
            return this.evaluate(node.children[0]);
        } else if (node.children.length === 2) {
            let func = this.evaluate(node.children[0]);
            let args = this.evaluate(node.children[1]);
            if (func instanceof Reference) {
                func = func.get();
            }
            return func.call(args); // [[...]]是在底层使用的，属于对象的私有属性
            /*
            let object = this.realm.Object.construct();
            let cls = this.evaluate(node.children[1]);
            let result = cls.call(object);
            if (typeof result === 'object') {
                return result;
            } else {
                return object;
            }*/
        }
    }
    MemberExpression(node) {
        if (node.children.length === 1) {
            return this.evaluate(node.children[0]);
        } else if (node.children.length === 3) {
            let result;
            // a.b,  a[b]
            let obj = this.evaluate(node.children[0]).get();  // 是个Reference, 所以需要解引用.get()
            let prop = obj.get(node.children[2].name);  //TODO
            // let prop;
            // for (let item of obj) {
            //     // let r = item[0].get();
            //     let r = item[0].property;
            //     if (r === node.children[2].name) {
            //         prop = item[1];
            //         break;
            //     }
            // }
            if ('value' in prop) {
                result = prop.value;
            } else if ('get' in prop) {
                result = prop.get.call(obj);
            }
            console.log('  MemberExpression:', result);
            return result;
        }
    }
    Identifier(node) {
        // console.log(node.type, ':', node.name);
        // return node.name;

        // 在JS里，变量,常量,函数,对象,类都是Identifier
        // 变量要存哪？ExecutionContext
        let runningEC = this.ecs[this.ecs.length - 1]; // 从栈顶取
        // console.log('==== this.ecs.length', this.ecs.length);

        // a=b; 即Identifier是可能出现在等号左边的，所以需要返回一个引用
        // JS的整个运行时都是用对象（属性）去描述的，所以就用一个新类型把(它所在的对象+属性名/值)都存起来
        // Reference 是JS运行时真实存在的类型（JS引擎 C++）
        let result = new Reference(
            runningEC.lexicalEnvironment,  // 取变量永远从lexicalEnvironment取（声明的时候再考虑别的）
            node.name
        );
        console.log('  Identifier:', result);
        return result;
    }
    Arguments(node) {
        if (node.children.length === 2) {
            return [];
        } else if (node.children.length === 3) {
            return this.evaluate(node.children[1]);
        }
    }
    ArgumentList(node) {
        if (node.children.length === 1) {
            let result = this.evaluate(node.children[0]);
            if (result instanceof Reference) {
                result = result.get();
            }
            return [result];
        } else {
            let result = this.evaluate(node.children[2]);
            if (result instanceof Reference) {
                result = result.get();
            }
            return this.evaluate(node.children[0]).concat(result);
        }
    }
    Block(node) {
        // 块级作用域
        if (node.children.length === 2) {
            return;
        }
        let runningEC = this.ecs[this.ecs.length - 1];
        // 得到一个新的执行上下文：
        let newEC = new ExecutionContext(
            runningEC.realm,
            new EnvironmentRecord(runningEC.lexicalEnvironment),
            runningEC.variableEnvironment
        );
        this.ecs.push(newEC); //将新创建的执行上下文push进栈
        let result = this.evaluate(node.children[1]);
        this.ecs.pop(newEC); //执行完语句之后再pop()
        return result;
    }
    Literal(node) {
        return this.evaluate(node.children[0]);
    }
    NumberLiteral(node) {
        // console.log(node.type, ':', node.value);
        // 语法 -> 运行时
        let str = node.value;
        let value = 0;
        let d = 10;

        if (str.match(/^0b/)) {
            d = 2;
            str = str.slice(2);
        } else if (str.match(/^0o/)) {
            d = 8;
            str = str.slice(2);
        } else if (str.match(/^0x/)) {
            d = 16;
            str = str.slice(2);
        }

        for (let i = 0; i < str.length; i++) {
            let c = str.charCodeAt(i);
            if (c >= 'a'.charCodeAt(0)) {
                c = c - 'a'.charCodeAt(0) + 10;
            } else if (c >= 'A'.charCodeAt(0)) {
                c = c - 'A'.charCodeAt(0) + 10;
            } else if (c >= '0'.charCodeAt(0)) {
                c = c - '0'.charCodeAt(0);
            }

            value = value * d + c;
        }
        let result = new JSNumber(node.value);
        console.log('NumberLiteral:', result);
        return result;
    }
    StringLiteral(node) {
        // console.log(node.type, ':', node.value);
        /**
         * 在JS里的字符串，编码形式是UTF-16
         * 只处理了0~FFFF范围的字符, 即BMP-基本平面（用一个code unit表示的，UTF-16）
         * 单引号和双引号共用一套代码（直接去掉引号），因为单双引号是语法阶段要考虑的事情
         */
        let result = [];
        for (let i = 1; i < node.value.length - 1; i++) {
            // 转义
            if (node.value[i] === '\\') {
                i++;
                let c = node.value[i];
                let map = {
                    '\'': '\'',
                    '\"': '\"',
                    '\\': '\\',
                    '0': String.fromCharCode(0x0000), // JS有\0，C++里就没有-因为那是字符串结束的标志
                    'b': String.fromCharCode(0x0008),
                    't': String.fromCharCode(0x0009),
                    'n': String.fromCharCode(0x000A), // ???为什么不是
                    'v': String.fromCharCode(0x000B),
                    'f': String.fromCharCode(0x000C),
                    'r': String.fromCharCode(0x000D)
                };
                if (c in map) {
                    result.push(map[c]);
                } else {
                    // TODO c===u 则往后读4个
                    // TODO c===x 则往后读2个
                    result.push(c);
                }
            } else {
                result.push(node.value[i]);
            }
        }
        // console.log(result);
        // return result.join('');
        let res = new JSString(result);
        console.log('StringLiteral:', res);
        return res;
    }
    BooleanLiteral(node) {
        // console.log(node.type, ':', node.value);
        if (node.value === 'false') {
            return new JSBoolean(false);
        } else {
            return new JSBoolean(true);
        }
    }
    NullLiteral(node) {
        // console.log(node.type, ':', node.value);
        return new JSNull;
    }
    RegularExpressionLiteral(node) {
        // console.log(node.type, ':', node.value);
    }
    ObjectLiteral(node) {
        // 对象的基本实现原理
        if (node.children.length === 2) {
            console.log('ObjectLiteral: {}');
            return {};
        } else if (node.children.length === 3) {  // 再来创建对象
            let object = new JSObject; // 两大块：property属性 + prototype原型
            this.PropertyList(node.children[1], object);
            // object.prototype = ;  // Global的Object的原型 （在哪里，Realm）
            console.log('ObjectLiteral:', object);
            return object;
        }
    }
    PropertyList(node, object) {
        if (node.children.length === 1) {
            this.Property(node.children[0], object);
        } else {
            this.PropertyList(node.children[0], object);
            this.Property(node.children[2], object);
        }
    }
    Property(node, object) {
        let name;
        if (node.children[0].type === 'Identifier') {
            name = node.children[0].name;
        } else if (node.children[0].type === 'StringLiteral') {
            name = this.evaluate(node.children[0]);
        }

        // 对象里存的不是具体的值，而是 descriptor
        // let k = this.evaluate(node.children[0]);
        let v = this.evaluate(node.children[2]);
        object.set(name, {
            value: v,
            writable: true,
            enumerable: true,
            configurable: true
        });
        // console.group('Property():');
        // console.log(k);
        // console.log(v);
        // console.groupEnd();
    }
    EOF() {
        return null;
    }
}

// export {
//     evaluate as SenmanticAnalysis
// };