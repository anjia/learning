import { Component, createElement, ATTRIBUTE } from "./framework.js";

export class List extends Component {
    constructor() {
        super();
    }
    render() {
        this.children = this[ATTRIBUTE].data.map(this.template); // map()之后会变成数组
        this.root = (<div>{this.children}</div>).render();
        return this.root;
    }
    appendChild(child) {
        this.template = child;
        this.render();
    }
}