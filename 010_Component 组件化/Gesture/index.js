/**
 * 事件：监听、识别、派发
 *      listen => recognize => dispatch
 *  eg. new Listener(new Recognizer(dispatch))
 * 
 * TODO.单元测试+代码Lint风格检查 -> 作为独立项目用npm能独立安装
 */
import { Listener } from './Listener.js';
import { Recognizer } from './Recognizer.js';
import { Dispatcher } from './Dispatcher.js';

export function enableGesture(element) {
    new Listener(
        element,
        new Recognizer(
            new Dispatcher(element)
        )
    );
}