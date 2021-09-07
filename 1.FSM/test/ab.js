module.exports = function log(myFunc, builtInFuncName){
    const test = [
        'a',
        'ab',
        'abc',
        'aab',
        'ababc',
        'akdabc',
        'qwerabdskfajdskfj',
        'qwerty'
    ];

    console.group(`${myFunc.name}():`);
    test.forEach(item => {
        // 和内置函数的执行结果，进行对比
        console.log(myFunc(item) === item[builtInFuncName]('ab'));
    });
    console.groupEnd();
}