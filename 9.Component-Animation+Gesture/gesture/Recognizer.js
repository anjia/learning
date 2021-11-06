/**
 * 统一抽象：在以下四个函数中分别识别是什么手势
 */
export class Recognizer {
    constructor(dispatcher) {
        this.dispatcher = dispatcher;
    }
    start(point, context) {
        // console.log('start() ', point.clientX, point.clientY);
        context.startX = point.clientX;
        context.startY = point.clientY;

        // 存多个点，以便计算移动的速度
        context.points = [{
            t: Date.now(),
            x: point.clientX,
            y: point.clientY
        }];

        // 三个值有点难维护哦。能搞成一个 gestureState 变量么？
        context.isTap = true;
        context.isPan = false;
        context.isPress = false;
        context.pressHander = setTimeout(() => {
            console.log('press (pressstart)');
            context.isTap = false;
            context.isPan = false;
            context.isPress = true;
            context.pressHander = null;
            this.dispatcher.dispatch('press', {});
        }, 500); // 按压时间超过0.5s -> press start
    }
    move(point, context) {
        let dx = point.clientX - context.startX;
        let dy = point.clientY - context.startY;

        // 移动距离>10px -> pan start
        if (!context.isPan && dx ** 2 + dy ** 2 > 100) {
            console.log('panstart');
            context.isTap = false;
            context.isPan = true;
            context.isPress = false;
            context.isVertical = Math.abs(dx) < Math.abs(dy);
            this.dispatcher.dispatch('panstart', {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY,
                isVertical: context.isVertical
            });
            clearTimeout(context.pressHander);
        }

        if (context.isPan) {
            console.log('pan', dx, dy);
            this.dispatcher.dispatch('pan', {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY,
                isVertical: context.isVertical
            });
        }

        context.points = context.points.filter(point => Date.now() - point.t < 500); // 只存储半秒内的点
        context.points.push({
            t: Date.now(),
            x: point.clientX,
            y: point.clientY
        });
    }
    end(point, context) {
        // console.log('end() ', point.clientX, point.clientY);
        if (context.isTap) {
            console.log('tap');
            this.dispatcher.dispatch('tap', {});
            clearTimeout(context.pressHander);
        }
        if (context.isPress) {
            console.log('pressend');
            this.dispatcher.dispatch('pressend', {});
        }

        context.points = context.points.filter(point => Date.now() - point.t < 500);

        let d, v;
        if (!context.points.length) {
            v = 0;
        } else {
            d = Math.sqrt((point.clientX - context.points[0].x) ** 2 + (point.clientY - context.points[0].y) ** 2);
            v = d / (Date.now() - context.points[0].t);
        }
        // console.log('v=', v);
        if (v > 1.5) {  // 像素每毫秒
            console.log('flick');
            context.isFlick = true;
            this.dispatcher.dispatch('flick', {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY,
                isVertical: context.isVertical,
                isFlick: context.isFlick,
                velocity: v
            });
        } else {
            context.isFlick = false;
        }

        if (context.isPan) {
            console.log('panend');
            this.dispatcher.dispatch('panend', {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY,
                isVertical: context.isVertical,
                isFlick: context.isFlick
            });
        }
    };
    cancel(point, context) {
        console.log('cancel() ', point.clientX, point.clientY);
        clearTimeout(context.pressHander);
        this.dispatcher.dispatch('cancel', {});
    }
}