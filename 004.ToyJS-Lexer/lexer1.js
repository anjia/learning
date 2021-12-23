/**
 * 词法分析：工作原理
 */
function scan(str) {
    let regexp = / |\n|\/\/[^\n]*|\/\*([^*]|\*[^\/])*\*\/|[1-9][0-9]*|0/g;  // |<token>
    while (regexp.lastIndex < str.length) {
        let r = regexp.exec(str);
        // console.log(r);
        // console.log('REGEXP:', r && r[0]);
        console.log(JSON.stringify(r && r[0]));  // 输出会带双引号 ""
    }
}

scan(`
// hi
/* hello world*/
0 1 2 9
10 11 19 20 21 29 30
100 101 199
13 5 7 12200 0
/*good job*/
`);