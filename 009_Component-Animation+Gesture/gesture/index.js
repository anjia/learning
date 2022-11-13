/**
 * 事件：监听、识别、派发
 *      listen => recognize => dispatch
 *  eg. new Listener(new Recognizer(dispatch))
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