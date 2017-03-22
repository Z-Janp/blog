var janp = (function () {
    var myModule = {};
    myModule.$queryAll = function (selector) {
        return document.querySelectorAll(selector);
    };
    myModule.addHandler = function (element, type, handler, useCapture) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, useCapture);
        } else if (element.attachEvent) {
            element.attachEvent("on" + type, handler);
        } else {
            element["on" + type] = null;
        }
    };
    myModule.preventDefault = function (event) {
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    };
    myModule.createXHR = function () {
        if (typeof XMLHttpRequest != "undefined") {
            return new XMLHttpRequest();
        } else if (typeof ActiveXObject != "undefined") {
            if (typeof arguments.callee.activeXString != "string") {
                var version = ['MSXML2.XMLHttp.6.o', 'MSXML2.XMLHttp.3.0', 'MSXML2.XMLHttp'], i, len;
                for (i = 0, len = version.length; i < len; i++) {
                    try {
                        new ActiveXObject(version[i]);
                        arguments.callee.activeXString = version[i];
                        break;
                    } catch (ex) {

                    }
                }
            }
            return new ActiveXObject(arguments.callee.activeXString);
        } else {
            throw new Error('NO XHR object availavle.');
        }
    };
    return myModule;
})();
//页面顶部蓝条模拟页面位置
(function () {
    // var MutationObserver = window.MutationObserver ||
    //     window.WebKitMutationObserver ||
    //     window.MozMutationObserver;
    // var mutationObserverSupport = !!MutationObserver;
    // if (mutationObserverSupport) {
    //     var ob = new MutationObserver(callback)
    //     ob.observe(janp.$queryAll('#rightSide')[0], {
    //         childList: true,//监听子元素的变动
    //     })
    // }
    // callback();
    var $d = window.document;
    var $prog2 = janp.$queryAll('.progress-indicator-2')[0];
    var dh = $d.documentElement.clientHeight;
    var h = $d.body.clientHeight;
    var sHeight = h - dh;//不可见高度,恒定值
    janp.addHandler(window, 'scroll', function () {
        var scrollTop = window.pageYOffset || $d.documentElement.scrollTop;
        window.requestAnimationFrame(function () {
            //以滚动距离除于页面不可见高度，当页面滚动至最底部时，滚动距离值等于不可见高度，可理解为对称
            var perc = Math.max(0, Math.min(1, scrollTop / sHeight));
            updateProgress(perc);
        });
    });
    function updateProgress(perc) {
        $prog2.style.cssText = 'width:' + perc * 100 + '%';
    }
    var code = document.querySelectorAll('.art-content pre code');
    code = Array.prototype.slice.call(code);
    code.map(function (itm) {
        var worker = new Worker('/js/render-code.js');
        worker.postMessage(itm.textContent);
        worker.onmessage = function(event) { itm.innerHTML = event.data; }
    });

})();
//多说评论
var duoshuoQuery = { short_name: "dscomment" };

janp.addHandler(janp.$queryAll('.searchBtn')[0], 'click', function (event) {
    var q = janp.$queryAll('.searchTxt')[0].value;
    if (q === '') {
        return;
    }
    var xhr = janp.createXHR();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                var articles = JSON.parse(xhr.responseText).articles, i, len, html;
                //<div id="result"></div>
                for (i = 0, len = articles.length; i < len; i++) {
                    html += '<section class="result"><h3 class="r-title"><a href="/article/' + articles[i]._id + '" target="_blank">' + articles[i].title + '</a></h3><div class="r-main"><p class="r-content">' + articles[i].content + '</p><span>' + articles[i].meta.createAt + '</span></div></section>';
                }
                janp.$queryAll('#rightSide')[0].innerHTML = html;
            } else {
                console.log('Request was unsuccessful:' + xhr.status);
            }
        }
    };
    xhr.open('post', '/result', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send('search=' + q);
})
janp.addHandler(janp.$queryAll('.searchTxt')[0], 'keydown', function (event) {
    var ev = event ? event : window.event;
    if (ev.keyCode === 13) {
        console.log(this.value);
    }
})