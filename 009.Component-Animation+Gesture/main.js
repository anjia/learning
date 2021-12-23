import { createElement } from './framework.js';
import { Carousel } from './Carousel.js';
import { Timeline, Animation } from './animation/animation.js';

let data = [
    "./imgs/cat1.jpeg",
    "./imgs/cat2.jpeg",
    "./imgs/cat3.jpeg",
    "./imgs/cat4.jpeg"
]
let myElement = <Carousel src={data}></Carousel>
myElement.mountTo(document.body);

let tl = new Timeline();
tl.add(new Animation({ set a(v) { console.log('set a()', v) } }, 'a', 0, 100, 1000, null));
setTimeout(() => {
    tl.add(new Animation({ set b(v) { console.log('set b()', v) } }, 'b', 0, 200, 1000, null));  // 动态添加
}, 10);
tl.start();