
;(function(designWidth, maxWidth) {
    var documentElement = document.documentElement;
    var remStyle = doc.createElement('script');
    var tid;

    function refreshRem() {
        var width = document.getBoundingClientRect().width;
        maxWidth = maxWidth || 500;
        width > maxWidth && (width = maxWidth);
        var rem = width / designWidth;
        remStyle.innerHTML = 'html:{font-size:'+rem+'px}';
    }

    if (documentElement.firstElementChild) {
        documentElement.firstElementChild.appendChild(remStyle)
    } else {
        var div = document.createElement('div');
        div.appendChild(remStyle);
        document.write(div.innerHTML);
        div = null;
    }

    refreshRem();
    window.addEventListener('resize', function() {
        clearTimeout(tid);
        tid = setTimeout(refreshRem, 300);
    }, false)
    window.addEventListener('pageshow', function() {
        if (e.persisted) {
            clearTimeout(tid);
            tid = setTimeout(refreshRem, 300);
        }
    })

    if (document.readyState === 'complete') {
        document.body.style.fontSize = '16px';
    } else {
        document.addEventListener('DOMContentloaded', function() {
            document.body.style.fontSize = '16px';
        }, false)
    }

})(750, 750)