function createElement(type, attributes, ...children) {
    let element;
    if (typeof type === 'string') {
        element = document.createElement(type);
    } else {
        element = new type;
    }
    for (let name in attributes) {
        element.setAttribute(name, attributes[name]);
    }
    for (let child of children) {
        if (typeof child === 'string') {
            child = document.createTextNode(child);
        }
        element.appendChild(child);
    }

    return element;
}
// 如何让 class 表现得像普通的 HTML 元素一样操作，在新版的标准里可以，注册下Div（WebComponent）
class Div {
    constructor() {
        this.root = document.createElement('div');
    }
    setAttribute(name, value) {
        this.root.setAttribute(name, value);
    }
    appendChild(child) {
        this.root.appendChild(child);
    }
    mountTo(parent) {
        parent.appendChild(this.root);
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

document.body.appendChild(a);
document.body.appendChild(b);
// document.body.appendChild(c);
c.mountTo(document.body);