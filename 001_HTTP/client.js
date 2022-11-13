// 自己写的一个HTTP请求的类
const Request = require('./util/Request');

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
    console.log('\n====== client.js ======\n------ The response is:');
    console.log(response);
}();