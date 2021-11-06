export function createElement(type, attributes, ...children) {
    let element;
    if (typeof type === 'string') {
        element = new ElementWrapper(type);
    } else {
        element = new type();
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

export class Component {
    constructor(type) {
        // this.root = this.render(type);
    }
    setAttribute(name, value) {
        this.root.setAttribute(name, value);
    }
    appendChild(child) {
        child.mountTo(this.root);
    }
    mountTo(parent) {
        parent.appendChild(this.root);
    }
}
class ElementWrapper extends Component {
    render(type) {
        this.root = document.createElement(type);
        // return document.createElement(type);
    }
}
class TextWrapper extends Component {
    render(content) {
        this.root = document.createTextNode(content);
        // return document.createTextNode(content);
    }
}