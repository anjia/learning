const log = require('./test/abcdef.js');

/**
 * 非状态机版本1：在一个字符串中，找到字符 'abcdef'
 */
function match(str){
    let foundA = false;
    let foundB = false;
    let foundC = false;
    let foundD = false;
    let foundE = false;

    for(let c of str){
        if(c==='a'){
            foundA = true;
            foundB = false;
            foundC = false;
            foundD = false;
            foundE = false;
        }else if(foundA && c==='b'){
            foundA = false;
            foundB = true;
        }else if(foundB && c==='c'){
            foundB = false;
            foundC = true;
        }else if(foundC && c==='d'){
            foundC = false;
            foundD = true;
        }else if(foundD && c==='e'){
            foundD = false;
            foundE = true;
        }else if(foundE && c==='f'){
            return true;
        }else {
            foundA = false;
            foundB = false;
            foundC = false;
            foundD = false;
            foundE = false;
        }
    }
    return false;
}
log(match);


/**
 * 非状态机版本2：在一个字符串中，找到字符 'abcdef'
 */
function match2(str){
    const target = 'abcdef';
    const max = str.length - target.length;
    // i<=max
    for(let i=0; i<=max; i++){
        if(str.charAt(i)==='a' &&
           str.charAt(i+1)==='b' &&
           str.charAt(i+2)==='c' &&
           str.charAt(i+3)==='d' &&
           str.charAt(i+4)==='e' &&
           str.charAt(i+5)==='f'){
               return true;
           }
    }
    return false;
}
log(match2);


/**
 * 非状态机版本3：在一个字符串中，找到字符 'abcdef'
 */
function match3(str){
    const target = 'abcdef';
    const targetLen = target.length;
    let index = 0;
    for(let i in str){
        if(str.charAt(i)===target.charAt(index)){
            if(++index === targetLen){
                return true;
            }
        }else{
            index = 0;
            // reconsume
            if(str.charAt(i)===target.charAt(index)){
                index++;
            }
        }
    }
    return false;
}
log(match3);