白屏时间:指浏览器从响应用户输入网址地址，到浏览器开始显示内容的世间。performance.timing.responseStart - performance.timing.navigationStart
首屏时间:指浏览器从响应用户输入网址地址，到首屏内容渲染完成的事件，此时整个网页不一定要全部渲染完成，但在当前视窗的内容需要。
document.addEventListener('DOMContentLoaded', (event) => {
    console.log('first contentful painting')
})
或者
performance.getEntriesByName('first-contentful-paint')[0]

FP(first paint)：首次渲染
FCP(first contentful paint)：首次有内容的渲染,当一些有内容的东西(如文字、图像、canvas)第一次被渲染花的时间。但经常捕获没有意义的渲染，如头部和导航栏
FMP(first meaningful paint)：首次有意义的渲染,当页面的主要内容出现在屏幕上花的时间。这个指标浏览器没有规范，毕竟很难统一一个标准来定义网站的主体内容。
LCP(largest contentful paint)：最大内容渲染,用于监控网页可视区内“渲染面积”最大的元素开始呈现在屏幕上的时间点。
谓绘制面积可以理解为每个元素在屏幕上的 “占地面积”，如果元素延伸到屏幕外，或者元素被裁切了一部分，被裁切的部分不算入在内，只有真正显示在屏幕里的才算数。
图片元素的面积计算方式稍微有点不同，因为可以通过CSS将图片扩大或缩小显示，也就是说，图片有两个面积：“渲染面积”与“真实面积”。在LCP的计算中，图片的绘制面积将获取较小的数值。例如：当“渲染面积”小于“真实面积”时，“绘制面积”为“渲染面积”，反之亦然。
页面在加载过程中，是线性的，元素是一个一个渲染到屏幕上的，而不是一瞬间全渲染到屏幕上，所以“渲染面积”最大的元素随时在发生变化。如果使用 PerformanceObserver 去捕获LCP，会发现每当出现“渲染面积”更大的元素，就会捕获出一条新的性能条目。
如果元素被删除，LCP算法将不再考虑该元素，如果被删除的元素刚好是 “绘制面积” 最大的元素，则使用新的 “绘制面积” 最大的元素创建一个新的性能条目。
该过程将持续到用户第一次滚动页面或第一次用户输入（鼠标点击，键盘按键等），也就是说，一旦用户与页面开始产生交互，则停止报告新的性能条目。
DOMContentLoad Event:dom加载完毕
onLLoad Event:页面所有内容(包括图片/flash/iframe等)加载完毕

