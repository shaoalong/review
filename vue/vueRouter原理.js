概念：通过改变URL，在不重新请求页面的情况下，更新页面视图。
实现方式：更新视图但不重新请求页面，事前端路由原理的核心之一，目前在浏览器环境中这一功能的实现主要有2个方式：
    1.Hash--利用URL中的hash('#')
    2.History interface 在HTML5中新增的方法
    Vue中，他是通过mode这一参数控制路由的实现模式：
    const router = new VueRouter({
        mode: 'history',
        routes: [...]
    })

    switch (mode) {
        case 'history':
            this.history = new HTML5History(this, options.base)
            break
        case 'hash':
            this.history = new HashHistory(this, options.base, this.fallback)
            break
        case 'abstract':
            this.history = new AbstractHistory(this, options.base)
            break
        default:
            if (process.env.NODE_ENV !== 'production') {
                 assert(false, `invalid mode: ${mode}`)
            }
    }

    history.listen(route => {
        this.apps.forEach((app) => {
            app._route = route
        })
    })
    可以看到，当路由变化时，调用了Hitory中的this.cb方法，而this.cb方法是通过History.listen(cb)进行设置的

    HashHistory：hash('#')的作用是加载URL中指定网页中的位置
        特点：
            1.hash虽然出现在URL中，但不会被包括在http请求中，他是用来指导浏览器动作的，对服务器端完全无用，因此，改变hash不会重新加载页面。
            2.可以为hash的改变添加监听事件：window.addEventListener('hanshchange', fn, false)
            3.每一次改变hash，都会在浏览器访问历史中增加记录
        利用hash的以上特点，就可以实现前端路由“更新视图但不请求页面”的功能了
        HashHistory方法:push-将新路由添加到浏览器访问历史的栈顶和replace-并不是将新路由添加到浏览器访问历史的栈顶，而是替换掉当前的路由
        实现过程：
            $router.push() // 调用方法 ->
            HashHistory.push() // 根据hash模式调用，设置hash并添加到浏览器历史记录(window.location.hash=XXX) ->
            History.transitionTo() // 监听更新，更新则调用History.updateRoute() ->
            History.updateRoute() // 更新路由 ->
            app._route = route // 替换当前app路由 ->
            vm.render() // 更新视图

    HTML5History:History interface 是浏览器历史记录栈提供的接口，通过back()、forward()、go()等方法，我们可以读取浏览器历史记录栈的信息，进行各种跳转操作
        从 HTML5开始，History interface 提供了2个新的方法：pushState()、replaceState() 使得我们可以对浏览器历史记录栈进行修改：
        window.history.pushState(stateObject,title,url)
        window.history,replaceState(stateObject,title,url)
            stateObject: 当浏览器跳转到新的状态时，将触发 Popstate 事件，该事件将携带这个 stateObject 参数的副本
            title: 所添加记录的标题
            url: 所添加记录的 url
        当调用他们修改浏览器历史栈后，虽然当前url改变了，但浏览器不会立即发送请求该url，这就为单页应用前端路由，更新视图但不重新请求页面提供了基础
        监听的是popstate: window.addEventListener('popstate', fn, false)
    
    两者比较：
        1.pushState设置新的URL可以是与当前URL同源的任意URL；而hash只能修改#后面的部分，故只可是这与当同文档的URL
        2.pushState通过stateObject可以添加任意类型的数据到记录中；而hash只可添加短字符串
        3.pushState可额外设置title属性供后续使用
        4.history模式则会将URL修改的就和正常请求后端的URL一样，如后端没有配置对应的路由处理，则会返回404错误。