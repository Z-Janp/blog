var janp = (function () {
    var myModule = {};
    var toggler = {};
    var minH = 17, step = 2, ms = 10;
    myModule.showOrHide = function (ev) {
        var ele = ev.srcElement ? ev.srcElement : ev.target;
        switch (ele.className) {
            case 'cat-list-item':
                if (!ele.tid) {
                    ele.tid = '_' + Math.random() * 100;
                }
                //对每个点击li生成不同的对象，存储相关的信息，防止点击不同对象取得相同的值
                if (!toggler[ele.tid]) {
                    toggler[ele.tid] = {
                        obj: ele,
                        firstEle: ele.firstElementChild,
                        timer: null,
                        action: -1
                    };
                }
                toggler[ele.tid].action *= -1;
                toggler[ele.tid].timer = setTimeout(function () {
                    if (toggler[ele.tid].action < 0) {
                        if (toggler[ele.tid].obj.offsetHeight <= minH) {
                            clearTimeout(toggler[ele.tid].timer);
                            return;
                        }
                    } else {
                        if (toggler[ele.tid].obj.offsetHeight >= toggler[ele.tid].firstEle.offsetHeight + minH) {
                            clearTimeout(toggler[ele.tid].timer);
                            return;
                        }
                    }
                    toggler[ele.tid].obj.style.height = (parseInt(toggler[ele.tid].obj.style.height, 10) + toggler[ele.tid].action * step) + "px";
                    timer = setTimeout(arguments.callee, ms);
                }, ms);
                break;
            default:
                return;
        }

    };
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
//文章目录隐藏和展示
janp.addHandler(janp.$queryAll('.cat-body')[0], 'click', janp.showOrHide, false);

//动态显示文章
janp.addHandler(janp.$queryAll('.cat-body')[0], 'click', function (event) {
    var event = event ? event : window.event;
    var ele = event.target || event.srcElement;
    janp.preventDefault(event);
    switch (ele.tagName.toLowerCase()) {
        case 'a':
            //创建XMLHttpRequest对象
            var xhr = janp.createXHR();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                        //json字符串转json对象
                        var jsonResponse = JSON.parse(xhr.responseText);
                        var title = jsonResponse.article.title;
                        var html = '<h1 class="art-title">' + title + '</h1><div class="art-meta"><p class="art-author">作者:<span>' + jsonResponse.article.author + '</span></p><p class="art-updateAt">更新时间:<span>' + jsonResponse.article.meta.updateAt.slice(0, 10) + '</span></p>' + '<section class="art-content">' + jsonResponse.article.content + '</section>' +
                            '<section id="comment" class="art-comment"></section>';
                        janp.$queryAll('#rightSide')[0].innerHTML = html;
                        janp.$queryAll('#edit a')[0].href = '/editor/' + jsonResponse.article._id;
                        document.title = title;
                        toggleDuoshuoComments(janp.$queryAll('.art-comment')[0], jsonResponse);
                    } else {
                        console.log('Request was unsuccessful:' + xhr.status);
                    }
                }
            };
            xhr.open('get', ele.href, false);
            xhr.send(null);
    }
}, false);
//页面顶部蓝条模拟页面位置
(function () {
    var MutationObserver = window.MutationObserver ||
        window.WebKitMutationObserver ||
        window.MozMutationObserver;
    var mutationObserverSupport = !!MutationObserver;
    if (mutationObserverSupport) {
        var ob = new MutationObserver(callback)
        ob.observe(janp.$queryAll('#rightSide')[0], {
            childList: true,//监听子元素的变动
        })
    }
    callback();
    function callback(records) {
        var $d = window.document;
        var $prog2 = janp.$queryAll('.progress-indicator-2')[0];
        var dh = $d.documentElement.clientHeight;
        var h = $d.body.clientHeight;
        var sHeight = h - dh;//不可见高度,恒定值
        janp.addHandler(window, 'scroll', function () {
            var scrollTop = window.pageYOffset || $d.documentElement.scrollTop
            window.requestAnimationFrame(function () {
                //以滚动距离除于页面不可见高度，当页面滚动至最底部时，滚动距离值等于不可见高度，可理解为对称
                var perc = Math.max(0, Math.min(1, scrollTop / sHeight));
                updateProgress(perc);
            });
        });
        function updateProgress(perc) {
            $prog2.style.cssText = 'width:' + perc * 100 + '%';
        }
    }
})();
var duoshuoQuery = { short_name: "dscomment" };
//动态加载多说评论框
function toggleDuoshuoComments(container, data) {
    var el = document.createElement('div');//该div不需要设置class="ds-thread"
    el.setAttribute('data-thread-key', data.article._id);//必选参数
    el.setAttribute('data-title', data.article.title);//必选参数
    el.setAttribute('data-url', window.location.href.indexOf('/article/') > -1 ? window.location.href : window.location.href + '/article/' + data.article._id);//必选参数
    //el.setAttribute('data-author-key', '作者的本地用户ID');//可选参数
    DUOSHUO.EmbedThread(el);
    container.appendChild(el);
}
(function () {
    document.write(unescape('%3Cdiv id="bdcs"%3E%3C/div%3E'));
    var bdcs = document.createElement('script');
    bdcs.type = 'text/javascript';
    bdcs.async = true;
    bdcs.src = 'http://znsv.baidu.com/customer_search/api/js?sid=9406139824929975242' + '&plate_url=' + encodeURIComponent(window.location.href) + '&t=' + Math.ceil(new Date() / 3600000);
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(bdcs, s);
})();
//search
// janp.addHandler(janp.$queryAll('#searchBtn')[0], 'click', function (event) {
//     var q = janp.$queryAll('#searchTxt')[0].value;
//     console.log(q);
//     if (q === '') {
//         return;
//     }
//     var xhr = janp.createXHR();
//     xhr.onreadystatechange = function () {
//         if (xhr.readyState == 4) {
//             if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
//                 var articles = JSON.parse(xhr.responseText).articles, i, len, html;
//                 //<div id="result"></div>
//                 for (i = 0, len = articles.length; i < len; i++) {
//                     html += '<article class="result"><h3 class="r-title"><a href="/article/' + articles[i]._id + '" target="_blank">' + articles[i].title + '</a></h3><div class="r-main"><p class="r-content">' + articles[i].content + '</p><span>' + articles[i].meta.createAt + '</span></div></article>';
//                 }
//                 janp.$queryAll('#rightSide')[0].innerHTML = html;
//                 console.log(articles);
//             } else {
//                 console.log('Request was unsuccessful:' + xhr.status);
//             }
//         }
//     };
//     xhr.open('post', '/result', true);
//     xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
//     xhr.send('search=' + q);
// })
// janp.addHandler(janp.$queryAll('#searchTxt')[0], 'keydown', function (event) {
//     var ev = event ? event : window.event;
//     if (ev.keyCode === 13) {
//         console.log(this.value);
//     }
// })