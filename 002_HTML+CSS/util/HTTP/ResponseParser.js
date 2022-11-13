/**
 * 1. Response 必须分段构造，所以我们要用一个 ResponseParser来“装配”
 *    逐步地接受 response 的文本
 * 2. ResponseParser 分段处理 ResponseText，我们用状态机来分析文本的结构
 */
const TrunkedBodyParser = require('./TrunkedBodyParser');
module.exports = class ResponseParser{
    constructor(){
        // 从性能和代码管理的角度，“函数式”的状态机
        this.WAITIGN_STATUS_LINE = 0;      // \r
        this.WAITING_STATUS_LINE_END = 1;  // \n
        this.WAITING_HEADER_NAME = 2;
        this.WAITING_HEADER_SPACE = 3;
        this.WAITING_HEADER_VALUE = 4;
        this.WAITING_HEADER_LINE_END = 5;   // \n
        this.WAITING_HEADER_BLOCK_END = 6;  // 空行 \r
        this.WAITING_BODY = 7;

        this.current = this.WAITIGN_STATUS_LINE;
        this.statusLine = '';
        this.headers = {};
        this.headerName = '';
        this.headerValue = '';
        this.bodyParser = null;
    }
    get isFinished(){
        return this.bodyParser && this.bodyParser.isFinished;
    }
    get response(){
        this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/);
        return {
            statusCode: RegExp.$1,
            statusText: RegExp.$2,
            headers: this.headers,
            body: this.bodyParser.content.join('')
        }
    }
    receive(string){
        // console.log('====== ./util/HTTP/ResponseParser.js ======');
        // console.log('------ receive()');
        for(let char of string){
            this.receiveChar(char);
        }
    }
    receiveChar(char){
        if(this.current === this.WAITIGN_STATUS_LINE){
            if(char === '\r'){
                this.current = this.WAITING_STATUS_LINE_END;
            }else{
                this.statusLine += char;
            }
        }else if(this.current === this.WAITING_STATUS_LINE_END){
            if(char === '\n'){
                this.current = this.WAITING_HEADER_NAME;
            }
        }else if(this.current === this.WAITING_HEADER_NAME){
            if(char === ':'){ //  || char === ' '
                this.current = this.WAITING_HEADER_SPACE;
            }else if(char === '\r'){  // 空行
                this.current = this.WAITING_HEADER_BLOCK_END;
                // Transfer-Encoding 可以有其它值，node的默认值是 chunked
                if(this.headers['Transfer-Encoding'] === 'chunked'){
                    this.bodyParser = new TrunkedBodyParser();
                }
            }else{
                this.headerName += char;
            }
        }else if(this.current === this.WAITING_HEADER_SPACE){
            if(char === ' '){
                this.current = this.WAITING_HEADER_VALUE;
            }
        }else if(this.current === this.WAITING_HEADER_VALUE){
            if(char === '\r'){
                this.current = this.WAITING_HEADER_LINE_END;
                this.headers[this.headerName] = this.headerValue;
                this.headerName = '';
                this.headerValue = '';
            }else{
                this.headerValue += char;
            }
        }else if(this.current === this.WAITING_HEADER_LINE_END){
            if(char === '\n'){
                this.current = this.WAITING_HEADER_NAME;
            }
        }else if(this.current === this.WAITING_HEADER_BLOCK_END){
            if(char === '\n'){
                this.current = this.WAITING_BODY;
            }
        }else if(this.current === this.WAITING_BODY){
            this.bodyParser.receiveChar(char);
        }
    }
}