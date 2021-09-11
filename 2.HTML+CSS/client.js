const Request = require('./util/HTTP/Request'); // 自己写的一个HTTP请求的类
const parser = require('./util/HTML/parser');   // 解析HTML→DOM树

void async function(){
    let request = new Request({
        method: 'POST',     // HTTP层
        host: '127.0.0.1',  // IP层
        port: '8888',       // TCP层
        path: '/',          // HTTP层
        headers: {          // HTTP层
            ['X-Foo2']: 'customed'
        },
        body: {
            name: 'Jack',
            age: 18
        }
    });
    let response = await request.send();
    console.log('\n====== client.js ======');
    // console.log('\n------ The response is:')
    // console.log(response);

    // 简化版（真实情况是逐段返回，所以需做成异步分段处理）
    let dom = parser.parseHTML(response.body); 
    // console.log('\n------ The DOM is:');
    // console.log(dom);
}();