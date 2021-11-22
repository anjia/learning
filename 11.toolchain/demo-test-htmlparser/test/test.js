const assert = require('assert');
import { parseHTML } from '../src/parser.js';

describe('------- parseHTML() -------', function () {
    it('<a></a>', function () {
        let tree = parseHTML('<a></a>');
        assert.equal(tree.children[0].tagName, 'a');
        assert.equal(tree.children[0].children.length, 0);
    });
    it('<a href="https://github.com"></a>', function () {
        let tree = parseHTML('<a href="https://github.com"></a>');
        assert.equal(tree.children[0].tagName, 'a');
        assert.equal(tree.children[0].children.length, 0);
    });
    it('<a id=\'link\' href="https://github.com"></a>', function () {
        let tree = parseHTML('<a id=\'link\' href="https://github.com"></a>');
        assert.equal(tree.children[0].tagName, 'a');
        assert.equal(tree.children[0].children.length, 0);
    });
    it('<button disabled></button>', function () {
        let tree = parseHTML('<button disabled></button>');
        assert.equal(tree.children[0].tagName, 'button');
        assert.equal(tree.children[0].children.length, 0);
    });
    it('<button id = "new" disabled></button>', function () {
        let tree = parseHTML('<button id = "new" disabled></button>');
        assert.equal(tree.children[0].tagName, 'button');
        assert.equal(tree.children[0].children.length, 0);
    });
    it('<button id disabled></button>', function () {
        let tree = parseHTML('<button id disabled></button>');
        assert.equal(tree.children[0].tagName, 'button');
        assert.equal(tree.children[0].children.length, 0);
    });
    it('<button id=reset></button>', function () {
        let tree = parseHTML('<button id=reset></button>');
        assert.equal(tree.children[0].tagName, 'button');
        assert.equal(tree.children[0].children.length, 0);
    });
    it('<button     id= reset ></button>', function () {
        let tree = parseHTML('<button   id= reset ></button>');
        assert.equal(tree.children[0].tagName, 'button');
        assert.equal(tree.children[0].children.length, 0);
    });
    it('<span>reset</span>', function () {
        let tree = parseHTML('<span>reset</span>');
        assert.equal(tree.children[0].tagName, 'span');
        assert.equal(tree.children[0].children.length, 1);
        assert.equal(tree.children[0].children[0].type, 'text');
        assert.equal(tree.children[0].children[0].content, 'reset');
    });
    it('<img src="xxx" />', function () {
        let tree = parseHTML('<img src="xxx" />');
        assert.equal(tree.children[0].tagName, 'img');
        assert.equal(tree.children[0].children.length, 0);
    });
    it('<img src="xxx"/>', function () {
        let tree = parseHTML('<img src="xxx"/>');
        assert.equal(tree.children[0].tagName, 'img');
        assert.equal(tree.children[0].children.length, 0);
    });
    it('<img src=xxx/>', function () {
        let tree = parseHTML('<img src=xxx/>');
        assert.equal(tree.children[0].tagName, 'img');
        assert.equal(tree.children[0].children.length, 0);
    });
    it('<br/>', function () {
        let tree = parseHTML('<br/>');
        assert.equal(tree.children[0].tagName, 'br');
        assert.equal(tree.children[0].children.length, 0);
    });
    it('<>', function () {
        let tree = parseHTML('<>');
        assert.equal(tree.children[0].type, 'text');
        assert.equal(tree.children[0].content, '>');
    });
    it('<div></p>', function () {
        try {
            parseHTML('<div></p>');
        } catch (e) {
            assert.equal(e.message, 'Tag start-end doesn\'t match!');
        }
    });
});