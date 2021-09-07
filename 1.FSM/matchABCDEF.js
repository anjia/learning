const log = require('./test/abcdef.js');

/**
 * 使用状态机：在一个字符串中，找到字符 'abcdef'
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
    return start(c);  // reconsume 重新使用 
}
function foundC(c){
    if(c==='d'){
        return foundD;
    }
    return start(c);
}
function foundD(c){
    if(c==='e'){
        return foundE;
    }
    return start(c);
}
function foundE(c){
    if(c==='f'){
        return end;
    }
    return start(c);
}
function end(c){
    return end; // 有用，还得调用。这个状态是个trap（陷阱）再也不会进入别的状态了
}

log(match);