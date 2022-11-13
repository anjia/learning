const images = require('images');
let TOTAL = 0;

function render(viewport, element, left, top) {
    let curLeft = left || 0;
    let curTop = top || 0;
    if (element.style) {
        console.log('===== Render.js', ++TOTAL, '<width+height, [bg(rgb)], [left+top]>', element.type, element.tagName); // element.style
        let img = images(element.style.width, element.style.height);
        let color = element.style['background-color'] || 'rgb(0,0,0)';
        color.match(/rgb\((\d+), (\d+), (\d+)\)/);
        img.fill(Number(RegExp.$1), Number(RegExp.$2), Number(RegExp.$3), 1);
        curLeft += element.style['left'] || 0;
        curTop += element.style['top'] || 0;
        viewport.draw(img, curLeft, curTop);
        // console.log(element.style['left'], element.style['top']);
        // console.log(curLeft, curTop);
    }
    if (element.children && element.children.length) {
        for (let child of element.children) {
            render(viewport, child, curLeft, curTop);
        }
    }
}

module.exports = render;