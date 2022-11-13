const pushBtn = document.getElementById('push')
const replaceBtn = document.getElementById('replace')
const view = document.getElementById('content')

function log(src = 'console') {
    console.log('==== from ' + src)
    console.log(history)
    console.log(history.state)
}
function showView(state) {
    view.innerHTML = state.page
}
function init() {
    const routes = [
        {
            state: {
                page: 'Home #1 Page'
            },
            url: '/home#1'
        },
        {
            state: {
                page: 'Home #2 Page'
            },
            url: '/home#2'
        },
        {
            state: {
                page: 'About Page'
            },
            url: '/about'
        }
    ]
    routes.forEach(item => {
        // URL 会变，但不会触发 popstate 事件
        history.pushState(item.state, '', item.url)
    })
    // 地址栏最终显示的 URL 是 routes 的最后一个
    // history.state 也是 routes 的最后一个
}

// 依然是：只变 URL，不触发 popstate 事件
pushBtn.onclick = () => {
    history.pushState({ page: 'Push Test' }, '', '/push-test')
}
replaceBtn.onclick = () => {
    history.replaceState({ page: 'Replace Test' }, '', '/replace-test')
}

// log('init') // length:1, state:null, 默认有一个当前 URL
init()
// log('after init')

/**
 * 执行这三个方法：URL 会变，且会自动触发 popstate 事件
 *   history.back() 
 *   history.forward()
 *   history.go()
 */
window.onpopstate = (event) => {
    log('popstate')
    // console.log('onpopstate')
}

window.onhashchange = (event) => {
    console.log('hashchange')
}
