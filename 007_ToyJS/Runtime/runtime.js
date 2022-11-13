/**
 * 类型转换：toBoolean(), 
 *         toString(), toNumber()
 *         toObject()
 *
 * 语句的执行结果
 *
 * 作用域：
 *    文本意义上的：scope（语法级的概念）
 *    运行时的：scope -> environment（新版），执行上下文
 *
 * 函数：定义、声明、函数表达式、调用
 *    （函数对象不分家，函数就是带call方法的对象）
 */
// ExecutionContext 切换时机（每次函数调用时，会切换。有个栈来管理）
export class ExecutionContext {
    // 这3个是整个JS执行的基石
    constructor(realm, lexicalEnvironment, variableEnvironment) {
        this.lexicalEnvironment = lexicalEnvironment; //是个列表一样的东西
        this.variableEnvironment = variableEnvironment || lexicalEnvironment; //自从引入了let，它和lexicalEnvironment的不同之处变多了
        this.realm = realm; //全局Object的原型（内含3个）
    }
}
export class Reference {
    constructor(object, property) {
        // debugger;
        this.object = object;
        this.property = property;
    }
    set(value) {
        // debugger;
        this.object.set(this.property, value);
        // this.object[this.property] = value;
    }
    get() {
        // debugger;
        // return this.object[this.property];
        return this.object.get(this.property);
    }
}
export class Realm {
    constructor() {
        this.global = new Map();
        this.Object = new Map(); // 是个函数
        this.Object.call = function () {

        }
        this.Object_prototype = new Map();
    }
}

export class EnvironmentRecord {
    constructor(outer) {
        // this.thisValue;
        this.outer = outer || null;
        this.variables = new Map;
    }
    // 声明
    add(name) {
        this.variables.set(name, new JSUndefined);
    }
    get(name) {
        // 若本环境里没有，就去父环境里去找
        if (this.variables.has(name)) {
            return this.variables.get(name);
        } else if (this.outer) {
            return this.outer.get(name);
        } else {
            return new JSUndefined;
        }
    }
    // 设置
    set(name, value = new JSUndefined) {
        if (this.variables.has(name)) {
            return this.variables.set(name, value);
        } else if (this.outer) {
            return this.outer.set(name, value);
        } else {
            return this.variables.set(name, value);
        }
    }
}
export class ObjectEnvironmentRecord {
    constructor(object, outer) {
        this.object = object;
        this.outer = outer;
    }
    add(name) {
        this.object.set(name, new JSUndefined);
    }
    get(name) {
        return this.object.get(name);
        // TODO: with statement needs outer
    }
    set(name, value = new JSUndefined) {
        this.object.set(name, value);
        // TODO: with statement needs outer
    }
}

export class JSValue {
    get type() {
        if (this.constructor === JSNumber) {
            return 'number';
        }
        if (this.constructor === JSString) {
            return 'string';
        }
        if (this.constructor === JSBoolean) {
            return 'boolean';
        }
        if (this.constructor === JSObject) {
            return 'object';
        }
        if (this.constructor === JSNull) {
            return 'null';
        }
        if (this.constructor === JSSymbol) {
            return 'symbol';
        }
        return 'undefined';
    }
}
export class JSNumber extends JSValue {
    constructor(value) {
        super();
        this.memory = new ArrayBuffer(8); // IEEE 标准
        if (arguments.length) {
            new Float64Array(this.memory)[0] = value;  // Float64Array()
        } else {
            new Float64Array(this.memory)[0] = 0;
        }
    }
    get value() {
        return new Float64Array(this.memory)[0];
    }
    toString() {
        // TODO
    }
    toNumber() {
        return this;
    }
    toBoolean() {
        if (new Float64Array(this.memory)[0] === 0) {
            return new JSBoolean(false);
        } else {
            return new JSBoolean(true);
        }
    }
    toObject() {
        // TODO.boxing
    }
    toInt() { // 位运算

    }
}
export class JSString extends JSValue {
    constructor(characters) {
        super();
        // this.memory = new ArrayBuffer(characters.length*2); // UTF-16 编码形式
        this.characters = characters;
    }
    toNumber() {

    }
    toString() {
        return this;
    }
    toBoolean() {
        if (this.characters.length) {
            return new JSBoolean(true);
        } else {
            return new JSBoolean(false);
        }
    }
}
export class JSBoolean extends JSValue {
    constructor(value) {
        super();
        this.value = value || false;
    }
    toNumber() {
        if (this.value) {
            return new JSNumber(1);
        } else {
            return new JSNumber(0);
        }
    }
    toString() {
        if (this.value) {
            return new JSString(['t', 'r', 'u', 'e']);
        } else {
            return new JSString(['f', 'a', 'l', 's', 'e']);
        }
    }
    toBoolean() {
        return this;
    }
}
export class JSObject extends JSValue {
    constructor(proto) {
        super();
        // 正常的对象只有 properties 和 prototype
        this.properties = new Map();
        this.prototype = proto || null; // [[prototype]]
    }
    set(name, value) {
        // TODO. writable etc.
        this.setProperty(name, {
            value: value,
            writable: true,
            enumerable: true,
            configurable: true
        });
    }
    get(name) {
        // debugger;
        // TODO. prototype chain && getter
        return this.getProperty(name).value;
    }
    setProperty(name, attributes) {
        this.properties.set(name, attributes);
    }
    getProperty(name) {
        return this.properties.get(name);
    }
    setPrototype(proto) {
        this.prototype = proto;
    }
    getPrototype() {
        return this.prototype;
    }
}
export class JSNull extends JSValue {
    toNumber() {
        return new JSNumber(0);
    }
    toString() {
        return new JSString(['n', 'u', 'l', 'l']);
    }
    toBoolean() {
        return new Boolean(false);
    }
}
export class JSUndefined extends JSValue {
    toNumber() {
        return new JSNumber(NaN);
    }
    toString() {
        return new JSString(['u', 'n', 'd', 'e', 'f', 'i', 'n', 'e', 'd']);
    }
    toBoolean() {
        return new JSBoolean(false);
    }
}
export class JSSymbol extends JSValue {
    constructor(name) {
        super();
        this.name = name || '';
    }
    // 不参与类型转换
}
export class CompletionRecord {
    // 此类型：用来表示每个语句的执行结果，三元组{类型, 返回值, label}，即语句执行完的记录
    // 虽然JS的使用者不会用到这个类型，但是想要理解语句的行为，还是需要知道它的逻辑的
    constructor(type, value, target) {
        this.type = type || 'normal';  // normal, break, continue, return, throw
        this.value = value || new JSUndefined;
        this.target = target || null;
    }
}