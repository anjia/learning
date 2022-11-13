import { Timeline } from './Timeline.js';
import { Animation } from './Animation.js';
import { linear, ease, easeIn, easeOut, easeInOut } from './TimingFunction.js';

let tl = new Timeline();

tl.add(new Animation(
    document.getElementById('el').style, 'transform',  // object, property,
    0, 500,  // startValue, endValue,
    2000, 0, // duration, delay,
    easeIn,  // timingFunction,
    v => `translateX(${v}px)`)); //template
tl.start();

// 与CSS动画做对比看看
let el2 = document.getElementById('el2');
el2.style.transition = 'transform 2s ease-in';
el2.style.transform = 'translateX(500px)';

document.getElementById('pause').addEventListener('click', event => {
    tl.pause();
});
document.getElementById('resume').addEventListener('click', event => {
    tl.resume();
});