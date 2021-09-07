/**
 * 在字符串中，找到字符 'a'
 */
function findChar(str, char){
    for(let i in str){
        if(str.charAt(i)===char){
            return i;
        }
    }
    return -1;
}
console.log(findChar('His name is Jack.', 'a'));     // 5
console.log(findChar('I think it is right.', 'a'));  // -1
console.log(findChar('abcd', 'a'));  // 0

/**
 * Note:
 * 1. 参数校验：先省略了，为了突出核心代码
 * 2. 区分大小
 */