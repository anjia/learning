module.exports = function log(myFunc){
    const cases = [
        'abcabx',
        'abcabcabx',
        'abcabcaby',
        'ababcabcabcx',
        'abbccaabbxx',
        'abcabxsdjfskdjf'
    ];
    console.group(`${myFunc.name}():`);
    cases.forEach(item => {
        if(myFunc(item) === item.includes('abcabx')){
            console.log(item, 'PASS');
        }else{
            console.error('\x1b[91m%s\x1b[0m', item + ' ERROR');
        }
    });
    console.groupEnd();
}