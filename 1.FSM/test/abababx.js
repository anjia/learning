module.exports = function log(myFunc){
    const cases = [
        'abababx',
        'ababababx',
        'aaaabbbbxxx',
        'abcabcabcabababxxxx',
        'ababxabababababababababx',
        'xxx',
        'alsaabababababxxkdl',
        'fdasababababxfdsa',
        'abcabababx',
        'abcdababadacabaaabababx'
    ];
    console.group(`${myFunc.name}():`);
    cases.forEach(item => {
        if(myFunc(item) === item.includes('abababx')){
            console.log(item, 'PASS');
        }else{
            console.error('\x1b[91m%s\x1b[0m', item + ' ERROR');
        }
    });
    console.groupEnd();
}