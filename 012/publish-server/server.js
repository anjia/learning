let http = require('http');
let https = require('https');
// let fs = require('fs');
let unzipper = require('unzipper');
let querystring = require('querystring');


// step2. 接收code，用code + client_id + client_secret 换 token
function auth(request, response) {
    let query = querystring.parse(request.url.match(/^\/auth\?([\s\S]+)$/)[1]);
    console.log('auth()', query); // json 格式
    getToken(query.code, function (info) {
        // access_token: "ghu_UYIvFSGb2B6s6zIkQjKitDUWKe2YoX3ZItnM"
        // expires_in: "28800"
        // refresh_token: "ghr_5T1XSzc7IPOloY2Dj5bzCsEJEKQjrN7iYwIJQmzsYXYpVTnNPAP6T07FYsigT2rK6tZ8io2YIoxW"
        // refresh_token_expires_in: "15638400"
        // scope: ""
        // token_type: "bearer"
        console.log('getToken callback:', info);
        // response.write(JSON.stringify(info));
        response.write(`<a href="http://localhost:8083/?token=${info.access_token}">publish</a>`);
        response.end();
    });
}

function getToken(code, callback) {
    let request = https.request({
        hostname: 'github.com',
        path: `/login/oauth/access_token?code=${code}&client_id=Iv1.7e381dff2e7cb9ce&client_secret=3720ed56bfbb13f5844e975ccb957b8b440abc7c`,
        port: 443,
        method: 'POST'
    }, function (response) {
        console.log('getToken() response:', response);
        let body = '';
        response.on('data', chunk => {
            body += chunk.toString();
        });
        response.on('end', chunk => {
            callback(querystring.parse(body));
        });
    });
    request.end();
}

// step4: 用 token 获取用户信息，进而检查权限，最后发布
function publish(request, response) {

    let query = querystring.parse(request.url.match(/^\/publish\?([\s\S]+)$/)[1]);
    if (query.token) {
        getUser(query.token, info => {
            // 线上环境大约是接入个权限系统
            if (info.login === 'anjia') {
                request.pipe(unzipper.Extract({ path: '../server/public/' }));
                request.on('end', () => {
                    console.log('request end()');
                    response.end('hello publish-server: received a file');
                });
            }
        });
    }
}
function getUser(token, callback) {
    let request = https.request({
        hostname: 'api.github.com',
        path: `/user`,
        port: 443,
        headers: {
            'Authorization': `token ${token}`,
            'User-Agent': 'publish-publish-publish'
        }
    }, response => {
        console.log('getUser() response:', response);
        let body = '';
        response.on('data', chunk => {
            body += chunk.toString();
        });
        response.on('end', () => {
            // console.log(body);
            callback(JSON.parse(body));
        });
    });
    request.end();
}

/**
 * 用node启动一个server（一个非常薄弱的server）
 */
http.createServer(function (request, response) {
    console.log('http://localhost:8082/');
    console.log(request);

    // auth 路由：接收code，用code + client_id + client_secret 换 token
    // publish 路由：再用 token 获取用户信息，进而检查权限，最后发布
    if (request.url.match(/^\/auth\?/)) {  // url: "/auth?code=b8a821d28c44e20d832a"
        return auth(request, response);
    } else if (request.url.match(/^\/publish\?/)) {
        return publish(request, response);
    }
    // console.log(request.headers);

    // ../server/public/index.html
    // let outFile = fs.createWriteStream('../server/public/tmp.zip');
    // request.pipe(outFile);
    // request.pipe(unzipper.Extract({ path: '../server/public/' }));

    // request.on('data', chunk => {
    //     // console.log(chunk.toString());
    //     outFile.write(chunk.toString());
    // });
    // request.on('end', () => {
    //     console.log('request end()');
    //     response.end('hello publish-server: received a file');
    //     // outFile.end();
    //     // outFile.end(chunk.toString());
    // });
}).listen(8082);