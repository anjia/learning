/**
 * 动画：属性动画、帧动画（每秒来张图）
 */
export class Animation {
    // 属性动画
    constructor(object, property, startValue, endValue, duration, delay, timingFunction, template) {
        this.object = object;
        this.property = property;
        this.startValue = startValue;
        this.endValue = endValue;
        this.duration = duration;
        this.timingFunction = timingFunction || (v => v);
        this.delay = delay;
        this.template = template || (v => v);
    }
    // 会接受一个虚拟的时间
    receive(time) {
        let range = this.endValue - this.startValue;
        let progress = this.timingFunction(time / this.duration); // 0~1的time,返回0~1的progress
        this.object[this.property] = this.template(this.startValue + range * progress); //设置属性值
        // this.object[this.property] = this.startValue + range * time / this.duration; //设置属性值

    }
}
