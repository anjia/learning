const log = require('./test/ab.js');

/**
 * 非状态机版本：在字符串中找到 'ab'，返回下标
 */
function findAB(str){
    let len = str.length;
    for(let i=0, max=len-1; i<max; i++){
        if(str.charAt(i)==='a' && str.charAt(i+1)==='b'){
            return i;
        }
    }
    return -1;
}
log(findAB, 'indexOf');
// console.log(i, typeof i); // 0 string
// let next = 1+i;  // string
// let next = parseInt(i) + 1; 
// console.log(next, typeof next); // 1 number
//-------
// `+i+1`  string转整数
// 循环到 <len-1


/**
 * 状态机版本：在字符串中找到 'ab'，返回布尔值
 */
function matchAB(str){
    let foundA = false;
    for(let c of str){
        if(c==='a'){
            foundA = true;
        }else if(foundA && c==='b'){
            return true;
        }else{
            foundA = false;
        }
    }
    return false;
}
log(matchAB, 'includes');