/**
 * 三代排版技术/布局：
 *   第一代：正常流，display, position, float
 * * 第二代：flex
 *   第三代：grid
 */
function getStyle(element) {
    // TODO: style 可以换个更合适的名字
    if (!element.style) {
        element.style = {};
    }
    for (let prop in element.computedStyle) {
        let v = element.computedStyle[prop].value;
        // TODO.CSS里有 undefined: undefined;
        if (!prop || !v) {
            continue;
        }
        element.style[prop] = v;

        // 转成纯数字 || 纯数字的需要转换下类型
        let p = element.style[prop].toString();
        if (p.match(/px$/) || p.match(/^[0-9\.]+$/)) {
            element.style[prop] = parseInt(element.style[prop]);
        }
    }
    return element.style;
}

function layout(element) {
    // Fixed. 判断对象是空 {}
    if (Object.keys(element.computedStyle).length === 0) {
        return;
    }

    // 预处理：搞成style属性，让它看起来更像CSS
    let curElementStyle = getStyle(element);

    // 目前只处理flex
    if (curElementStyle.display !== 'flex') {
        return;
    }
    let flexElementStyle = curElementStyle;

    // 只接收element类型的，过滤掉文本节点 type='text'
    let flexItems = element.children.filter(e => e.type === 'element');
    flexItems.sort((a, b) => {
        return (a.order || 0) - (b.order || 0);
    });

    ['width', 'height'].forEach(size => {
        if (flexElementStyle[size] === 'auto' || flexElementStyle[size] === '') {
            flexElementStyle[size] = null;
        }
    });
    /**
     * 父属性处理了5个：
     *      flex-direction
     *      flex-wrap
     *      justify-content
     *      align-items
     *      align-content
     * 省略了4个：
     *      flex-flow（缩写式）
     *      gap, row-gap, column-gap
     */

    // 设置默认值
    if (!flexElementStyle['flex-direction'] || flexElementStyle['flex-direction'] === 'auto') {
        flexElementStyle['flex-direction'] = 'row';
    }
    if (!flexElementStyle['flex-wrap'] || flexElementStyle['flex-wrap'] === 'auto') {
        flexElementStyle['flex-wrap'] = 'nowrap';
    }
    if (!flexElementStyle['justify-content'] || flexElementStyle['justify-content'] === 'auto') {
        flexElementStyle['justify-content'] = 'flex-start';
    }
    if (!flexElementStyle['align-items'] || flexElementStyle['align-items'] === 'auto') {
        flexElementStyle['align-items'] = 'stretch';
    }
    if (!flexElementStyle['align-content'] || flexElementStyle['align-content'] === 'auto') {
        flexElementStyle['align-content'] = 'stretch'; // 浏览器默认是 normal
    }

    const flexDirection = {
        'row': ['width', 'left', 'right', +1, 0, 'height', 'top', 'bottom'],
        'row-reverse': ['width', 'right', 'left', -1, flexElementStyle.width, 'height', 'top', 'bottom'],
        'column': ['height', 'top', 'bottom', +1, 0, 'width', 'left', 'right'],
        'column-reverse': ['height', 'bottom', 'top', -1, flexElementStyle.height, 'width', 'left', 'right'],
    };
    let [mainSize, mainStart, mainEnd, mainSign, mainBase, crossSize, crossStart, crossEnd] = flexDirection[flexElementStyle['flex-direction']];

    let crossSign, crossBase;
    if (flexElementStyle['flex-wrap'] === 'wrap-reverse') {
        [crossStart, crossEnd] = [crossEnd, crossStart];  // 交换位置
        crossSign = -1;
    } else {
        crossBase = 0;
        crossSign = 1;
    }

    //++++ 2.分行：根据主轴尺寸，把元素分进行 ++++++++
    //++++      若设置了no-wrap，则强行分配进第一行  ++++
    let isAutoMainSize = false;
    // 若元素没有设置主轴尺寸
    if (!flexElementStyle[mainSize]) { // auto sizing
        flexElementStyle[mainSize] = 0;
        flexItems.forEach(item => {
            let itemStyle = getStyle(item);
            if (itemStyle[mainSize] !== null || itemStyle[mainSize] !== (void 0)) {
                // 尺寸被子元素们撑开
                flexElementStyle[mainSize] += (itemStyle[mainSize] || 0);
            }
        });
        isAutoMainSize = true;
    }

    // 将元素收集进“行” hang
    let flexLine = [];
    let flexLines = [flexLine];

    let mainSpace = flexElementStyle[mainSize];
    let crossSpace = 0;
    for (let i = 0; i < flexItems.length; i++) {
        let item = flexItems[i];
        let itemStyle = getStyle(item);

        if (!itemStyle[mainSize]) {
            itemStyle[mainSize] = 0; // 呃...如果没设置，就设置为0
        }

        // 可伸缩的子元素，直接入行
        if (itemStyle['flex']) {
            flexLine.push(item);

        } else if (flexElementStyle['flex-wrap'] === 'nowrap' && isAutoMainSize) {
            // 只能放一行的
            mainSpace -= itemStyle[mainSize];
            if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) {
                crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
            }
            flexLine.push(item);
        } else {
            // 多行时 (TODO.未必是多行，因为可能是 nowrap 但是设置了主轴尺寸的 )
            if (itemStyle[mainSize] > flexElementStyle[mainSize]) {
                itemStyle[mainSize] = flexElementStyle[mainSize];
            }
            // 不够，则换行
            if (mainSpace < itemStyle[mainSize]) {
                flexLine.mainSpace = mainSpace;
                flexLine.crossSpace = crossSpace;
                flexLine = [item]; // 创建新行
                flexLines.push(flexLine);
                mainSpace = flexElementStyle[mainSize];
                crossSpace = 0;
            } else {
                flexLine.push(item);
            }
            if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) {
                crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
            }
            mainSpace -= itemStyle[mainSize];
        }
    }
    flexLine.mainSpace = mainSpace;

    // ++++ 3.计算主轴方向：找出所有flex元素 ++++
    // ++++            把主轴方向的剩余尺寸按比例分配给这些元素 ++++
    // ++++            若剩余空间为负数，所有flex元素为0，等比压缩剩余元素 ++++
    if (flexElementStyle['flex-wrap'] === 'nowrap' || isAutoMainSize) {
        flexLine.crossSpace = (flexElementStyle[crossSize] !== (void 0)) ? flexElementStyle[crossSize] : crossSpace;
    } else {
        flexLine.crossSpace = crossSpace;
    }

    // 剩余空间不足，等比压缩（单行时）
    if (mainSpace < 0) {
        let scale = flexElementStyle[mainSize] / (flexElementStyle[mainSize] - mainSpace);
        let currentMain = mainBase;
        for (let i = 0; i < flexItems.length; i++) {
            let item = flexItems[i];
            let itemStyle = getStyle(item);

            // flex元素不参与等比压缩
            if (itemStyle.flex) {
                itemStyle[mainSize] = 0;
            }
            itemStyle[mainSize] = itemStyle[mainSize] * scale;

            itemStyle[mainStart] = currentMain;
            itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
            currentMain = itemStyle[mainEnd];
        }
    } else {
        // 处理每个flex行
        flexLines.forEach(items => {
            let mainSpace = items.mainSpace;
            let flexTotal = 0;
            for (let i = 0; i < items.length; i++) {
                let item = items[i];
                let itemStyle = getStyle(item);
                if ((itemStyle['flex'] !== null) && (itemStyle['flex'] !== (void 0))) {
                    flexTotal += itemStyle['flex'];
                    continue;
                }
            }

            // 有flex元素，均匀分布
            if (flexTotal > 0) {
                let currentMain = mainBase;
                for (let i = 0; i < items.length; i++) {
                    let item = items[i];
                    let itemStyle = getStyle(item);
                    if (itemStyle['flex']) {
                        itemStyle[mainSize] = (mainSpace / flexTotal) * itemStyle['flex'];
                    }
                    itemStyle[mainStart] = currentMain;
                    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
                    currentMain = itemStyle[mainEnd];
                }

            } else {
                // debugger;
                // 若没有flex子元素，那就按 justifyContent 分配剩余空间
                let currentMain, step;
                if (flexElementStyle['justify-content'] === 'flex-start') {
                    currentMain = mainBase;
                    step = 0;
                } else if (flexElementStyle['justify-content'] === 'flex-end') {
                    currentMain = mainSpace * mainSign + mainBase;
                    step = 0;
                } else if (flexElementStyle['justify-content'] === 'center') {
                    currentMain = mainSpace / 2 * mainSign + mainBase;
                    step = 0;
                } else if (flexElementStyle['justify-content'] === 'space-between') {
                    step = mainSpace / (items.length - 1) * mainSign;
                    currentMain = mainBase;
                } else if (flexElementStyle['justify-content'] === 'space-around') {
                    step = mainSpace / items.length * mainSign;
                    currentMain = step / 2 + mainBase;
                }

                for (let i = 0; i < items.length; i++) {
                    let itemStyle = items[i].style;
                    itemStyle[mainStart] = currentMain;
                    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
                    currentMain = itemStyle[mainEnd] + step;
                }
            }
        });
    }

    // ++++ 计算交叉轴方向 ++++
    // ++++ 1.根据每行中的最大元素尺寸计算行高 ++++
    // ++++ 2.根据行高flex-align和item-align,确定元素具体位置 ++++

    // auto sizing
    if (!flexElementStyle[crossSize]) {
        crossSpace = 0;
        flexElementStyle[crossSize] = 0;
        // 撑开高度
        for (let i = 0; i < flexLines.length; i++) {
            flexElementStyle[crossSize] += flexLines[i].crossSpace;
        }
    } else {
        crossSpace = flexElementStyle[crossSize];
        for (let i = 0; i < flexLines.length; i++) {
            crossSpace -= flexLines[i].crossSpace;
        }
    }

    if (flexElementStyle['flex-wrap'] === 'wrap-reverse') {
        crossBase = flexElementStyle[crossSize];
    } else {
        crossBase = 0;
    }
    let lineSize = flexElementStyle[crossSize] / flexLines.length;

    let step;
    if (flexElementStyle['align-content'] === 'flex-start') {
        crossBase += 0;
        step = 0;
    } else if (flexElementStyle['align-content'] === 'flex-end') {
        crossBase += crossSign * crossSpace;
        step = 0;
    } else if (flexElementStyle['align-content'] === 'center') {
        crossBase += crossSign * crossSpace / 2;
        step = 0;
    } else if (flexElementStyle['align-content'] === 'space-between') {
        crossBase += 0;
        step = crossSpace / (flexLines.length - 1);
    } else if (flexElementStyle['align-content'] === 'space-around') {
        step = crossSpace / flexLines.length;
        crossBase += crossSign * step / 2;
    } else if (flexElementStyle['align-content'] === 'stretch') {
        crossBase += 0;
        step = 0;
    }
    flexLines.forEach(items => {
        let lineCrossSize = flexElementStyle['align-content'] === 'stretch' ?
            items.crossSpace + crossSpace / flexLines.length :
            items.crossSpace;
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            let itemStyle = getStyle(item);
            let align = itemStyle['align-self'] || flexElementStyle['align-items']; // 子 || 父
            if (itemStyle[crossSize] === null) {
                itemStyle[crossSize] = (align === 'stretch') ? lineCrossSize : 0;
            }

            if (align === 'flex-start') {
                itemStyle[crossStart] = crossBase;
                itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
            } else if (align === 'flex-end') {
                itemStyle[crossStart] = crossBase + crossSign * lineCrossSize;
                itemStyle[crossEnd] = itemStyle[crossEnd] - crossSign * itemStyle[crossSize];
            } else if (align === 'center') {
                itemStyle[crossStart] = crossBase + crossSign * (lineCrossSize - itemStyle[crossSize]) / 2;
                itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
            } else if (align === 'stretch') {
                itemStyle[crossStart] = crossBase;
                itemStyle[crossEnd] = crossBase + crossSign * (
                    (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) ?
                        itemStyle[crossSize] :
                        lineCrossSize);
                itemStyle[crossSize] = crossSign * (itemStyle[crossEnd] - itemStyle[crossStart]);
            }
        }
        crossBase += crossSign * (lineCrossSize + step);
    });

    console.log('===== Layout Flex Done.  ======');
    // console.log(flexItems);
}

module.exports = layout;