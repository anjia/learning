/**
 * 1. 在 Request 的构造器中收集必要的信息
 * 2. 设计一个 send 函数，把请求真实发送到服务器
 * 3. send 函数应该是异步的，所以返回 Promise
 */
const net = require('net');
const ResponseParser = require('./ResponseParser');

module.exports = class Request {
    constructor(options){
        this.method = options.method || 'GET';
        this.host = options.host;
        this.port = options.port || 80;
        this.path = options.path || '/';
        this.body = options.body || {};
        this.headers = options.headers || {};

        // 必须项Content-Type，它决定了body的格式
        if(!this.headers['Content-Type']){
            this.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        }
        // 常见的Content-Type
        if(this.headers['Content-Type'] === 'application/json'){
            this.bodyText = JSON.stringify(this.body);
        }else if(this.headers['Content-Type'] === 'application/x-www-form-urlencoded'){
            this.bodyText = Object.keys(this.body).map(key => 
                `${key}=${encodeURIComponent(this.body[key])}`
            ).join('&');
        }
        this.headers['Content-Length'] = this.bodyText.length;
    }

    /**
     * 1. 设计支持已有的 connection 或者自己新建 connection 
     * 2. 收到数据传给 parser
     * 3. 根据 parser 的状态 resolve Promise
     */
    send(connection){
        return new Promise((resolve, reject) => {
            const parser = new ResponseParser; // 
            if(connection){
                connection.write(this.toString());
            }else{
                // 创建TCP连接
                connection = net.createConnection({
                    host: this.host,
                    port: this.port
                }, () => {
                    connection.write(this.toString());
                });
            }
            connection.on('data', (data) => {
                // console.log('====== ./util/HTTP/Request.js ======\n------ send()\n------ The data received is:');
                // console.log(data.toString());
                parser.receive(data.toString());
                if(parser.isFinished){
                    resolve(parser.response);
                }
                connection.end();
            });
            connection.on('error', (err) => {
                reject(err);
                connection.end();
            });
        }).catch(err => {
            console.error(err);
        });
    }

    toString(){
        return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}\r
\r
${this.bodyText}`;
    }
}