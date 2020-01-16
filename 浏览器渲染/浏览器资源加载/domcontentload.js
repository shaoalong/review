 function ready(fn) {
     if (document.addEventListener) {
         document.addEventListener('DOMContentLoaded', function () {
             document.removeEventListener('DOMContentLoaded', arguments.callee, false);
             fn();
         }, false);
     }

     // 如果IE
     else {
         // 确保当页面是在iframe中加载时，事件依旧会被安全触发(iframe只支持onreadystatechange)
         document.attachEvent('onreadystatechange', function () {
             if (document.readyState == 'complete') {
                 document.detachEvent('onreadystatechange', arguments.callee);
                 fn();
             }
         });

         // 如果是IE且页面不在iframe中时，轮询调用doScroll 方法检测DOM是否加载完毕
         if (document.documentElement.doScroll && typeof window.frameElement === "undefined") {
             try {
                 document.documentElement.doScroll('left');
             } catch (error) {
                 return setTimeout(arguments.callee, 20);
             };
             fn();
         }
     }
 };
