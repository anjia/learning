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
        // this.object.set(this.property, value);
        this.object[this.property] = value;
    }
    get() {
        // debugger;
        return this.object[this.property];
        // return this.object.get(this.property);
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

// export class EnvironmentRecord {
//     constructor(outer) {
//         // this.thisValue;
//         this.outer = outer || null;
//         this.variables = new Map();
//     }
//     add(name) {
//         this.variables.set(name, new JSUndefined);
//     }
//     get(name) {
//         if (this.variables.has(name)) {
//             return this.variables.get(name);
//         } else if (this.outer) {
//             return this.outer.get(name);
//         } else {
//             return JSUndefined;
//         }
//     }
//     set(name, value = new JSUndefined) {
//         if (this.variables.has(name)) {
//             return this.variables.set(name, value);
//         } else if (this.outer) {
//             return this.outer.set(name, value);
//         } else {
//             return this.variables.set(name, value);
//         }
//     }
// }
// export class ObjectEnvironmentRecord {
//     constructor() {

//     }
//     add() {

//     }
//     get() {

//     }
//     set() {

//     }
// }

// export class JSValue {
//     get type() {
//         // TODO.补全
//         if (this.constructor === JSObject) {
//             return 'object';
//         }
//         return 'undefined';
//     }
// }
// export class JSNumber extends JSValue {

// }
// export class JSString extends JSValue {

// }
// export class JSBoolean extends JSValue {

// }
// export class JSObject extends JSValue {
//     constructor(proto) {
//         super();
//         this.properties = new Map();
//         this.prototype = proto || null;
//     }
//     set(name, value) {
//         // TODO. writable etc.
//         this.setProperty(name, {
//             value: value,
//             writable: true,
//             enumerable: true,
//             configable: true
//         });
//     }
//     get(name) {
//         // TODO. prototype chain && getter
//         return this.getProperty(name).value;
//     }
//     setProperty(name, attributes) {
//         this.properties.set(name, attributes);
//     }
//     getProperty(name) {
//         return this.properties.get(name);
//     }
//     setPrototype(proto) {
//         this.prototype = proto;
//     }
//     getPrototype() {
//         return this.prototype;
//     }
// }
// export class JSNull extends JSValue {

// }
// export class JSUndefined extends JSValue {

// }
// export class JSSymbol extends JSValue {

// }
// export class CompletionRecord {

// }