/**
 * 1. Response 的 body 可能会根据 Content-Type 有不同的结构
 *    因此，我们采用子 Parser 的结构来解决问题
 * 2. 以 TrunkedBodyParser 为例，我们同样用状态机来处理 body 的格式
 */
module.exports = class TrunkedBodyParser{
    // 一个trunk格式是：长度后面跟trunk的内容（若长度=0，则body结束）
    constructor(){
        // 定义各个状态
        this.WAITING_LENGTH = 0;
        this.WAITING_LENGTH_LINE_END = 1;
        this.READING_TRUNK = 2;  // 不是严格的Mealy状态机了
        this.WAITING_NEW_LINE = 3;
        this.WAITING_NEW_LINE_END = 4;

        this.length = 0;
        this.content = [];
        this.isFinished = false;
        this.current = this.WAITING_LENGTH;
    }
    receiveChar(char){
        // console.log('=== TrunkedBodyParser.receiveChar()');
        if(this.current === this.WAITING_LENGTH){
            if(char === '\r'){
                // 长度为0，则结束
                if(this.length === 0){
                    this.isFinished = true;
                }else{
                    this.current = this.WAITING_LENGTH_LINE_END;
                }
            }else{
                this.length *= 16; // 十六进制
                this.length += parseInt(char, 16);
            }
        }else if(this.current === this.WAITING_LENGTH_LINE_END){
            if(char === '\n'){
                this.current = this.READING_TRUNK;
            }
        }else if(this.current === this.READING_TRUNK){
            if(this.length){
                this.content.push(char);
                this.length--;
            }
            if(this.length === 0){
                this.current = this.WAITING_NEW_LINE;
            }
        }else if(this.current === this.WAITING_NEW_LINE){
            if(char === '\r'){
                this.current = this.WAITING_NEW_LINE_END;
            }
        }else if(this.current === this.WAITING_NEW_LINE_END){
            if(char === '\n'){
                this.current = this.WAITING_LENGTH;
            }
        }
    }
}