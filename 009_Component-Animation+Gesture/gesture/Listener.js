export class Listener {
    constructor(element, recognizer) {
        let contexts = new Map();
        let isListeningMouse = false;

        // let pressHander;  // 逻辑关系+作用域，首先是ok的
        // let startX, startY;
        // let isPan = false, isTap = true, isPress = false;

        /**
         * mouse系列: down, move, up
         * 测试：左键、右键、左右键同时按
         */
        element.addEventListener('mousedown', event => {
            // console.log(event.button); // 鼠标：左键右键中键（前进后退）
            let context = Object.create(null);
            contexts.set('mouse' + (1 << event.button), context);  // 所以用event.button来创建一个上下文
            recognizer.start(event, context);

            let mousemove = event => {
                // move 的时候鼠标可以按键也可以不按键，所以它没有event.button
                // event.buttons 表示move时按下的键，是掩码形式
                let button = 1;  // 循环掩码的5位
                while (button <= event.buttons) {
                    // 按位与，掩码，当按键按下时
                    if (button & event.buttons) {
                        // 鼠标的右键和中键是相反的：按键的顺序 vs button的属性
                        let key;
                        if (button === 2) {
                            key = 4;
                        } else if (button === 4) {
                            key = 2;
                        } else {
                            key = button;
                        }
                        let context = contexts.get('mouse' + key);
                        recognizer.move(event, context);
                    }
                    button = button << 1;
                }
            };
            let mouseup = event => {
                let context = contexts.get('mouse' + (1 << event.button));
                recognizer.end(event, context);
                contexts.delete('mouse' + (1 << event.button));

                if (event.buttons === 0) {
                    document.removeEventListener('mousemove', mousemove);
                    document.removeEventListener('mouseup', mouseup);
                    isListeningMouse = false;
                }
            };

            // 若同时按了多个键，那事件是多绑定的
            if (!isListeningMouse) {
                document.addEventListener('mousemove', mousemove); // 可以不down就move
                document.addEventListener('mouseup', mouseup);
                isListeningMouse = true;
            }
        });

        /**
         * touch系列: 它们会在元素上自动顺序触发,所以直接“并行”写即可
         *       start, move, end
         *       start, move, cancel (以异常形式结束的eg.被系统提示中断)
         */
        element.addEventListener('touchstart', event => {
            // console.log(event.changedTouches); // 多个触点
            for (let touch of event.changedTouches) {
                // console.log('touchstart', touch.clientX, touch.clientY);
                let context = Object.create(null);
                contexts.set(touch.identifier, context);
                recognizer.start(touch, context);
            }
        });
        element.addEventListener('touchmove', event => {
            for (let touch of event.changedTouches) {
                let context = contexts.get(touch.identifier);
                recognizer.move(touch, context);
            }
        });
        element.addEventListener('touchend', event => {
            for (let touch of event.changedTouches) {
                let context = contexts.get(touch.identifier);
                recognizer.end(touch, context);
                contexts.delete(touch.identifier);
            }
        });

        // eg.touchmove的过程中有个 alert('11'); 就会触发 touchcancel
        element.addEventListener('touchcancel', event => {
            for (let touch of event.changedTouches) {
                let context = contexts.get(touch.identifier);
                recognizer.cancel(touch, context);
                contexts.delete(touch.identifier);
            }
        });
    }
}