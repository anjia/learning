import { createElement } from './framework.js';
import { Carousel } from './Carousel.js';
import { Button } from './Button.js';
import { List } from './List.js';

let data = [
    {
        img: "./imgs/cat1.jpeg",
        url: "https://time.geekbang.org/",
        title: "极客时间"
    },
    {
        img: "./imgs/cat2.jpeg",
        url: "https://juejin.cn/",
        title: "掘金"
    },
    {
        img: "./imgs/cat3.jpeg",
        url: "https://developer.mozilla.org/",
        title: "MDN"
    },
    {
        img: "./imgs/cat4.jpeg",
        url: "https://www.zhihu.com/",
        title: "知乎"
    }
];

// let myElement = <Carousel src={data}
//     onChange={event => console.log(event.detail.position)}
//     onClick={event => window.location.href = event.detail.data.url}></Carousel>

// let myElement = <Button>content</Button>;

// 模板型 children
// let myElement = <List data={data}>
//     <img src={img} />
//     <a href={url}>{title}</a>
// </List>;
let myElement = <List data={data}>
    {
        (record) => <div>
            <img src={record.img} />
            <a href={record.url}>{record.title}</a>
        </div>
    }
</List>;

myElement.mountTo(document.body);