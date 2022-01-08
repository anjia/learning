let http = require('http');
// let fs = require('fs'); // fileSystem
let archiver = require('archiver');
let child_process = require('child_process');
let querystring = require('querystring');

/**
 * 1. publish-tool 打开 https://github.com/login/oauth/authorize
 *    获取用户的ID
 * 2. publish-server 的 auth 路由，接收code
 *    用code + client_id + client_secret 换 token
 * 3. publish-tool 创建server，接受token后点击发布
 * 4. publish-server 的 publish 路由，用 token 获取用户信息，进而检查权限
 */

// step1. 发送请求获取用户授权
child_process.exec(`open https://github.com/login/oauth/authorize?client_id=Iv1.7e381dff2e7cb9ce`);

// step3. 创建server，接受token后点击发布
http.createServer(function (request, response) {
    let query = querystring.parse(request.url.match(/^\/\?([\s\S]+)$/)[1]);
    // token: 'ghu_UYIvFSGb2B6s6zIkQjKitDUWKe2YoX3ZItnM'
    // console.log(query);
    publish(query.token);
}).listen(8083);


function publish(token) {
    let request = http.request({
        // hostname: "47.104.17.105",
        hostname: "127.0.0.1",
        port: 8082,
        method: 'POST',
        path: '/publish?token=' + token,
        headers: {
            'Content-Type': 'application/octet-stream'  // 该字段可看HTTP的RFC标准
            // 'Content-Length': stats.size
        }
    }, response => {
        console.log(response); // 流式
    });

    const archive = archiver('zip', {
        zlib: { level: 9 } // 压缩级别
    });
    archive.directory('./sample/', false);
    archive.finalize();
    archive.pipe(request);

    request.end();
}



//// test: 单文件
// fs.stat("./sample.html", (err, stats) => {
// let file = fs.createReadStream('./sample.html');
// file.pipe(request);
// });

// let request = http.request({
//     // hostname: "47.104.17.105",
//     hostname: "127.0.0.1",
//     port: 8082,
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/octet-stream'  // 该字段可看HTTP的RFC标准
//     }
// }, response => {
//     console.log(response); // 流式
// });

// let file = fs.createReadStream('./sample.html');
// readFile 回调型API

// file.pipe(request);

// file.on('data', chunk => {
//     console.log(chunk.toString());
//     request.write(chunk); // 把文件内容放到request里
// });
// file.on('end', chunk => {
//     console.log('read finished');
//     request.end(chunk);
// });

// // 发出请求（流式数据）
// request.end();