module.exports = function log(myFunc){
    const cases = [
        'abcdef',
        'ababcdef',
        'abcdeaf',
        'abbccddeeff',
        'abcdefsdjfskdjf',
        'kkkkabcdefllll',
        'abcdeeeeeeeeee',
        'aabbccddeeffgg',
        '...',
        'The string is axbxcxdxexfx',
        '... abcdefhahhh',
        'abacdef',
        'abaccdef',
        'abcdbckakekkf',
        'abcd',
        '1234abcd',
        'abcdefqqq',
        'ppppabcdabcdabcdelllll'
    ];
    console.group(`${myFunc.name}():`);
    cases.forEach(item => {
        if(myFunc(item) === item.includes('abcdef')){
            console.log(item, 'PASS');
        }else{
            console.error('\x1b[91m%s\x1b[0m', item + ' ERROR');
        }
    });
    console.groupEnd();
}