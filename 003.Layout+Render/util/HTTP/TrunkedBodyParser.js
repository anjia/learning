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

        console.log('====== ./util/HTTP/TrunkedBodyParser.js ======');
        console.log('------ receiveChar()');
    }
    receiveChar(char){
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

                // TODO：若是中文汉字，长度-3
                //       若是中文标点符号 。；，：“”（）、？《》！【】￥ 等..
                if(/^[\u4e00-\u9fa5]$/.test(char) ||
                  /^[\u3002\uff1b\uff0c\uff1a\u201c\u201d\uff08\uff09\u3001\uff1f\u300a\u300b\uff01\u3010\u3011\uffe5]$/.test(char)){
                    // console.log('汉字-3:', char);
                    this.length = this.length - 3;
                }else{
                    this.length--;
                }
            }
            // 到 </html> length 刚好为0
            // if(this.length <= 20){
            //     console.log('===Length:', this.length, char);
            // }
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