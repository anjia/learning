function createElement(type, attributes, ...children) {
    let element;
    if (typeof type === 'string') {
        element = new ElementWrapper(type);
    } else {
        element = new type;
    }
    for (let name in attributes) {
        element.setAttribute(name, attributes[name]);
    }
    for (let child of children) {
        if (typeof child === 'string') {
            child = new TextWrapper(child);
        }
        element.appendChild(child);
    }

    return element;
}

class BaseWrapper {
    constructor() {
        this.root = null;
    }
    setAttribute(name, value) {
        this.root.setAttribute(name, value);
    }
    appendChild(child) {
        child.mountTo(this.root);
        // this.root.appendChild(child);
    }
    mountTo(parent) {
        parent.appendChild(this.root);
    }
}
class ElementWrapper extends BaseWrapper {
    constructor(type) {
        super();
        this.root = document.createElement(type);
    }
}
class TextWrapper extends BaseWrapper {
    constructor(content) {
        super();
        this.root = document.createTextNode(content);
    }
}
class Div extends BaseWrapper {
    constructor() {
        super();
        this.root = document.createElement('div');
    }
}

let a = <div id="a">
    Hello world!
</div>;

let b = <div id="b">
    <span>1</span>
    <span>2</span>
    <span>3</span>
</div>;

let c = <Div id="c">
    Hello world!
    <span>1</span>
    <span>2</span>
    <span>3</span>
</Div>

// document.body.appendChild(a);
// document.body.appendChild(b);
// document.body.appendChild(c);
a.mountTo(document.body);
b.mountTo(document.body);
c.mountTo(document.body);