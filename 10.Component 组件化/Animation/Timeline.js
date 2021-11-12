// 避免外部不小心访问到这些属性
const TICK = Symbol('tick');
const TICK_HANDLER = Symbol('tick-handler');
const ANIMATIONS = Symbol('animations');
const ANIMATION_START_TIME = Symbol('animation-start-time');
const PAUSE_START = Symbol('pause-start');
const PAUSE_TIME = Symbol('pause-time');

/**
 * 将执行tick的操作抽象成一个概念：Timeline
 */
export class Timeline {
    constructor() {
        this.init();
        this[TICK] = () => {
            // console.group('tick');
            let now = Date.now();
            for (let animation of this[ANIMATIONS]) {
                // 兼容向 Timeline 动态添加 Animation
                let t;
                if (this[ANIMATION_START_TIME].get(animation) < this.startTime) {
                    t = now - this.startTime - animation.delay - this[PAUSE_TIME];
                } else {
                    t = now - this[ANIMATION_START_TIME].get(animation) - animation.delay - this[PAUSE_TIME];
                }

                // 让动画停止
                if (animation.duration < t) {
                    this[ANIMATIONS].delete(animation);
                    t = animation.duration;
                }

                // 加了animation.delay之后，需要判断
                if (t > 0) {
                    animation.receive(t); //传入虚拟的time
                }
            }
            this[TICK_HANDLER] = requestAnimationFrame(this[TICK]);
        };
    }
    init() {
        this.state = 'inited';
        this[ANIMATIONS] = new Set();
        this[ANIMATION_START_TIME] = new Map();
        this[PAUSE_TIME] = 0;
        this[PAUSE_START] = 0;
        this[TICK_HANDLER] = null;
    }
    start() {
        if (this.state !== 'inited') return;
        this.state = 'started';
        this.startTime = Date.now();
        this[TICK]();  // 调用
    }
    pause() {
        if (this.state !== 'started') return;
        this.state = 'pause';
        this[PAUSE_START] = Date.now();
        cancelAnimationFrame(this[TICK_HANDLER]);
    }
    resume() {
        if (this.state !== 'pause') return;
        this.state = 'started';
        this[PAUSE_TIME] += (Date.now() - this[PAUSE_START]);  // 毫秒
        this[TICK]();  // 调用
    }
    reset() {  // 重置/重启/清除操作，变成一个干净的时间线
        this.pause();
        this.init();
    }
    // set rate() {  // 播放速率，快进/慢放

    // }
    // get rate() {

    // }
    add(animation, startTime) {
        if (arguments.length < 2) {
            startTime = Date.now();
        }
        this[ANIMATIONS].add(animation);
        this[ANIMATION_START_TIME].set(animation, startTime);
    }
    // remove(){

    // }
}

/**
 * JS里处理帧的，最常见的三种方案：
 *   浏览器的刷新频率大约每秒钟60帧，所以1帧大约1/60=0.016666秒，即16毫秒
 */
/*
setInterval(() => { }, 16);

let tick1 = () => {
    setTimeout(tick1, 16);
    // setTimeout(() => { }, 16);
};

let tick2 = () => {
    let handler = requestAnimationFrame(tick2); // 它和浏览器的帧频是一致的，现代浏览器推荐用它
    // cancelAnimationFrame(handler);
};*/