export function createElement(type, attributes, ...children) {
    // console.log('type:', type);
    let element;
    if (typeof type === 'string') {
        element = new ElementWrapper(type);
    } else {
        element = new type();
    }
    for (let name in attributes) {
        element.setAttribute(name, attributes[name]);
    }

    // 若要处理数组
    let processChildren = (children) => {
        for (let child of children) {
            // console.log('child:', child);
            if (typeof child === 'object' && child instanceof Array) {
                processChildren(child); // 递归调用
                continue;
            }
            if (typeof child === 'string') {
                child = new TextWrapper(child);
            }
            element.appendChild(child);
        }
    };
    processChildren(children);

    return element;
}

export const ATTRIBUTE = Symbol('attribute');
export const STATE = Symbol('state'); // 像类继承语言里的protected
export class Component {
    constructor() {
        this[ATTRIBUTE] = Object.create(null);
        this[STATE] = Object.create(null);
    }
    render() {
        return this.root;
    }
    setAttribute(name, value) {
        this[ATTRIBUTE][name] = value;
        // this.root.setAttribute(name, value);
    }
    appendChild(child) {
        child.mountTo(this.root);
    }
    mountTo(parent) {
        if (!this.root) {
            this.render();
        }
        parent.appendChild(this.root);
    }
    triggerEvent(type, args) {  // 事件机制
        this[ATTRIBUTE]['on' + type.replace(/^[\s\S]/, s => s.toUpperCase())](new CustomEvent(type, { detail: args }));
    }
}
class ElementWrapper extends Component {
    constructor(type) {
        super(); // 加了继承关系之后，需要调super() 否则找不到 this
        this.root = document.createElement(type);
    }
    setAttribute(name, value) {
        // this[ATTRIBUTE][name] = value;
        this.root.setAttribute(name, value);
    }
}
class TextWrapper extends Component {
    constructor(content) {
        super();
        this.root = document.createTextNode(content);
    }
    setAttribute(name, value) {
        // this[ATTRIBUTE][name] = value;
        this.root.setAttribute(name, value);
    }
}