/**
 * mocha 最早也是针对 nodejs 的测试框架。所以在使用webpack+babel之前只支持 require('')
 * 所以，可以webpack之后，再测试dist目录。（但是“测试不应该依赖build”，以及code coverage时数据）
 * 所以，可以用 @babel/register (安装 @babel/core @babel/register)
 * 
 * 执行命令：
 *    mocha --require @babel/register 会报错“MODULE_NOT_FOUND” 因为mocha用的是全局的。所以改用本地的mocha
 *    ./node_modules/.bin/mocha --require @babel/register
 * 所以最佳实践永远是调本项目的local环境，而不是globle依赖当前机器的环境
 *    写在package.json里的“scripts”里，会自动加前缀  ./node_modules/.bin/，所以就可以直接写 mocha --require @babel/register
 * 
 * code coverage: nyc, https://www.npmjs.com/package/nyc
 * 插件：babel-plugin-istanbul  https://www.npmjs.com/package/@istanbuljs/nyc-config-babel
 */
const assert = require('assert');
// const add = require('../add.js');
import { add, mul } from '../add.js';

console.log('== import() ==');

describe('add()', function () {
    it('1+2=3', function () {
        assert.equal(add(1, 2), 3);
    });

    it('-6+2=-4', function () {
        assert.equal(add(-6, 2), -4);
    });
});

describe('mul()', function () {
    it('2*3=6', function () {
        assert.equal(mul(2, 3), 6);
    });

    it('-6*2=-12', function () {
        assert.equal(mul(-6, 2), -12);
    });

    it('-6*-2=12', function () {
        assert.equal(mul(-6, -2), 12);
    });
});