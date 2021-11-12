import { Component, STATE, ATTRIBUTE } from './framework.js';
import { enableGesture } from './Gesture/index.js';
import { Timeline, Animation, ease } from './Animation/index.js';

export { STATE, ATTRIBUTE } from './framework.js';

export class Carousel extends Component {
    constructor() {
        super();
    }
    render() {
        this.root = document.createElement('div');
        this.root.classList.add('carousel');
        for (let record of this[ATTRIBUTE]['src']) {
            let child = document.createElement('div');
            child.style.backgroundImage = `url('${record.img}')`;
            this.root.appendChild(child);
        }

        enableGesture(this.root);
        let timeline = new Timeline();
        timeline.start();

        let handler = null;

        let children = this.root.children; // 不希望外部来使用

        this[STATE].position = 0; // let position = 0; // 局部变量充当state

        // 不同事件之间通讯使用的一些局部状态
        let t = 0; // 动画/拖拽开始的时间
        let ax = 0; // 动画造成的位移

        this.root.addEventListener('start', event => {
            // console.log('start event trigger!');
            timeline.pause();
            clearInterval(handler);
            if (Date.now() - t < 500) {
                let progress = (Date.now() - t) / 500;  // 动画播放的进度
                ax = ease(progress) * 500 - 500;
            } else {
                ax = 0;
            }
        });

        this.root.addEventListener('tap', event => {
            this.triggerEvent('click', {
                position: this[STATE].position,
                data: this[ATTRIBUTE].src[this[STATE].position]
            });
        });

        this.root.addEventListener('pan', event => {
            let x = event.clientX - event.startX - ax;
            let current = this[STATE].position - ((x - x % 500) / 500);
            for (let offset of [-1, 0, 1]) {  // [-2, -1, 0, 1, 2]
                let pos = current + offset;
                pos = (pos % children.length + children.length) % children.length;
                children[pos].style.transition = 'none';
                children[pos].style.transform = `translateX(${- pos * 500 + offset * 500 + x % 500}px)`;
            }
        });

        this.root.addEventListener('end', event => {
            timeline.reset();
            timeline.start();
            handler = setInterval(nextPicture, 3000);

            let x = event.clientX - event.startX - ax;
            let current = this[STATE].position - ((x - x % 500) / 500);

            let direction = Math.round((x % 500) / 500);  // -1, 0, 1

            if (event.isFlick) {
                console.log('end is triggered! event.isFlick, v=', event.velocity);
                if (event.velocity < 0) {
                    direction = Math.ceil((x % 500) / 500);
                } else {
                    direction = Math.floor((x % 500) / 500);
                }
            }

            for (let offset of [-1, 0, 1]) {
                let pos = current + offset;
                pos = (pos % children.length + children.length) % children.length;

                children[pos].style.transition = 'none';
                timeline.add(new Animation(
                    children[pos].style, 'transform',  // object, property,
                    - pos * 500 + offset * 500 + x % 500, // startValue
                    - pos * 500 + offset * 500 + direction * 500,  // endValue,
                    500, 0,  // duration, delay,
                    ease,    // timingFunction,
                    v => `translateX(${v}px)`  //template
                ));
            }

            this[STATE].position = this[STATE].position - ((x - x % 500) / 500) - direction;
            this[STATE].position = (this[STATE].position % children.length + children.length) % children.length;  // 负→正
            this.triggerEvent('change', { position: this[STATE].position });
        });


        let nextPicture = () => {
            let children = this.root.children;
            let nextIndex = (this[STATE].position + 1) % children.length;

            let current = children[this[STATE].position];
            let next = children[nextIndex];

            t = Date.now();

            timeline.add(new Animation(
                current.style, 'transform',  // object, property,
                -this[STATE].position * 500, -500 - this[STATE].position * 500,  // startValue, endValue,
                500, 0,  // duration, delay,
                ease,    // timingFunction,
                v => `translateX(${v}px)`  //template
            ));
            timeline.add(new Animation(
                next.style, 'transform',  // object, property,
                500 - nextIndex * 500, - nextIndex * 500,  // startValue, endValue,
                500, 0,  // duration, delay,
                ease,    // timingFunction,
                v => `translateX(${v}px)`  //template
            ));

            this[STATE].position = nextIndex;
            this.triggerEvent('change', { position: this[STATE].position });
        };

        handler = setInterval(nextPicture, 3000);
        return this.root;
    }
}
