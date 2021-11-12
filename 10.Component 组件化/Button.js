import { Component, createElement } from "./framework.js";

export class Button extends Component {
    constructor() {
        super();
    }
    render() {
        this.childContainer = <span />;  // 要级联
        this.root = (<div>{this.childContainer}</div>).render(); // JSX 所有的标签都可以自封闭
        return this.root;
        /* React 不断重复地去调用 render() 来解决 child 的问题 */
    }
    appendChild(child) { // 重载此方法，实现一种 children 的机制
        if (!this.childContainer) {
            this.render();
        }
        this.childContainer.appendChild(child);
    }
}