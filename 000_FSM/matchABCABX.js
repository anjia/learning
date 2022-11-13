const log = require('./test/abcabx.js');

/**
 * 使用状态机：在一个字符串中，找到字符 'abcabx'
 */
function match(str){
    let state = start;
    for(let c of str){
        state = state(c);
    }
    return state === end;
}

function start(c){
    if(c==='a'){
        return foundA;
    }
    return start;
}
function foundA(c){
    if(c==='b'){
        return foundB;
    }
    return start(c);
}
function foundB(c){
    if(c==='c'){
        return foundC;
    }
    return start(c);  // reConsume 单个字符
}
function foundC(c){
    if(c==='a'){
        return foundA2;
    }
    return start(c);
}
function foundA2(c){
    if(c==='b'){
        return foundB2;
    }
    return start(c);
}
function foundB2(c){
    if(c==='x'){
        return end;
    }
    return foundB(c); // 重复字符串 'ab'
}
function end(c){
    return end;
}

log(match);