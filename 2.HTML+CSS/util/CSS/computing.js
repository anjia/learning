/**
 * 将CSS规则里包含的属性们应用到匹配这些选择器的元素上
 *      需要对CSS进行词法和语法分析，需要较多的编译原理的基础知识
 * 1. CSS parser 将CSS代码 -> AST抽象语法树
 * 2. 抽出CSS规则将其应用到对应的HTML元素上
 *       时机当然是越早越好
 *       有个隐形的规则就是在startTag进入的时候就能判断到（大部分规则都遵循）
 */
const css = require('css'); // CSS parser

let rules = [];
function addCSSRules(text){
    console.log('====== util/CSS/computing.js ======');
    var ast = css.parse(text);
    // console.log(JSON.stringify(ast, null, '   '));
    rules.push(...ast.stylesheet.rules);
}
/**
 * 找到能匹配当前元素的所有CSS规则
 * 1. 需要知道当前元素的所有的父元素（stack），先当前再父，即从左到右匹配
 * 2. [自己,父元素] vs 所有的CSSrules[]（遍历规则列表-规则）
 */
function computeCSS(curElement, stack){
    // console.log(rules);
    // console.log('Compute CSS for element ', curElement);

    // reverse() CSS的规则匹配是从左到右的，先当前再父
    var ancestor = stack.slice().reverse();
    if(!curElement.computedStyle){
        curElement.computedStyle = {};
    }

    // 遍历规则，找到匹配当前元素的规则 
    for(let rule of rules){
        // 不处理以,分隔的CSS选择器规则，只处理单条规则的
        // 也只处理以空格分隔的后代选择器
        // eg. .a #id img {} → [img, #id, .a]
        var selectorParts = rule.selectors[0].split(' ').reverse();
        // 先判断是否匹配“元素自己”
        if(!match(curElement, selectorParts[0])){
            continue;
        }

        // 再判断是否匹配父亲们，[父亲们] [CSS规则的级联项们]二者均是数组
        // eg. 当前元素 [div, parent, parent]
        // eg. 当前规则 [img, #id, .a]
        let matched = false;
        let j = 1;
        for(let i=0; i<ancestor.length && j<selectorParts.length; i++){
            if(match(ancestor[i], selectorParts[j])){
                j++;
            }
        }
        if(j >= selectorParts.length){
            matched = true;
        }

        if(matched){
            // 如果匹配到，则要加入真实的元素中
            console.log('------ 匹配成功：元素+规则 ------');
            // console.log('Element', curElement.tagName, curElement.attributes.join(''), 'matched rule:', rule.selectors.join(','));
            // console.log('Element', curElement);
            let sp = specificity(rule.selectors[0]);
            let computedStyle = curElement.computedStyle;
            for(let declaration of rule.declarations){
                if(!computedStyle[declaration.property]){
                    computedStyle[declaration.property] = {};
                }
                if(!computedStyle[declaration.property].specificity){
                    computedStyle[declaration.property].value = declaration.value;
                    computedStyle[declaration.property].specificity = sp;
                }else if(compare(computedStyle[declaration.property].specificity, sp) < 0){
                    computedStyle[declaration.property].value = declaration.value;
                    computedStyle[declaration.property].specificity = sp;
                    // console.log('---有覆盖', computedStyle[declaration.property]);
                }
            }
            // console.log('---最终是：');
            // console.log(curElement.computedStyle);
        }
    }
}
/**
 * 假设selector都是简单选择器
 * 即 #id .class tagName
 */
function match(element, selector){
    // eg.再没父父父了 || 文本节点
    if(!selector || !element.attributes){
        return false;
    }

    if(selector.charAt(0) === '#'){
        let attr = element.attributes.filter(attr => attr.name === 'id')[0];
        if(attr && attr.value === selector.replace('#', '')){
            return true;
        }
    }else if(selector.charAt(0) === '.'){
        let attr = element.attributes.filter(attr => attr.name === 'class')[0];
        if(attr && attr.value === selector.replace('.', '')){
            return true;
        }
    }else{
        if(element.tagName === selector){
            return true;
        }
    }
    return false;
}

/**
 * specificity 是个四元祖
 * [0,     0,  0,     0]
 * inline, id, class, tag
 * eg1. div div #id ~ [0,1,0,2]
 * eg2. div #my #id ~ [0,2,0,1]
 * 比较时，只要高位能比较出来就不比较低位了
 */
function specificity(selector){
    let p = [0, 0, 0, 0];
    let selectorParts = selector.split(' ');
    for(let part of selectorParts){
        if(part.charAt(0) === '#'){
            p[1] += 1;
        }else if(part.charAt(0) === '.'){
            p[2] += 1;
        }else{
            p[3] += 1;
        }
    }
    return p;
}
function compare(sp1, sp2){
    if(sp1[0] - sp2[0]){
        return sp1[0] - sp2[0];
    }else if(sp1[1] - sp2[1]){
        return sp1[1] - sp2[1];
    }else if(sp1[2] - sp2[2]){
        return sp1[2] - sp2[2];
    }
    return sp1[3] - sp2[3];
}


module.exports.addCSSRules = addCSSRules;
module.exports.computeCSS = computeCSS;