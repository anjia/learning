const Request = require('./util/HTTP/Request'); // 自己写的一个HTTP请求的类
const parser = require('./util/HTML/parser');   // 解析HTML→DOM树
const render = require('./util/Render/render');
const images = require('images');

void async function () {
    console.log('====== client.js ======');
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
    // console.log('====== client.js ======');
    // console.log('------ The response is:')
    // console.log(response);

    // 简化版（真实情况是逐段返回，所以需做成异步分段处理）
    let dom = parser.parseHTML(response.body);
    console.log('\n------ The DOM is:');
    // console.log(dom);
    // console.log(JSON.stringify(dom, null, '    '));

    // 作为绘制视口
    let viewport = images(800, 1000);
    render(viewport, dom);  // .children[0].children[3].children[1].children[3]
    viewport.save('viewport.jpg');
    console.log('\nDone! The render result is the file "viewport.jpg"');
}();