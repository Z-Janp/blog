var Jose = (function () {
    var myMoudle = {};
    myMoudle.$Id = function (id) {
        return document.getElementById(id);
    };
    myMoudle.$All = function (selector) {
        return document.querySelectorAll(selector);
    };
    myMoudle.getFirstElement = function (parent) {
        if (parent.firstElementChild) {
            return parent.firstElementChild;
        } else {
            var el = parent.firstChild;
            while (el && el.nodeType !== 1) {
                el = el.nextSibling;
            }
            return el;
        }
    };
    myMoudle.addHandler = function (element, type, handler, useCapture) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, useCapture);
        } else if (element.attachEvent) {
            element.attachEvent("on" + type, handler);
        } else {
            element["on" + type] = null;
        }
    };
    /*var _skillFilter = function (node) {
     return (node.tagName.toLowerCase() === "li" && (node.getAttribute("data-filter")==='true')) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
     };
     var _skillWalker = document.createTreeWalker(myMoudle.$All(".skill_list")[0], NodeFilter.SHOW_ELEMENT, _skillFilter, false);
     var _skillWalkerNode = _skillWalker.nextNode();
     //遍历li，取其第一个子元素id属性和data-level自定义属性，画圆
     while (_skillWalkerNode !== null) {
     var _skillRing = myMoudle.getFirstElement(_skillWalkerNode);
     _drawSkillRing(_skillRing.getAttribute("id").substring(6, 7), _skillRing.getAttribute("data-level"));
     _skillWalkerNode = _skillWalker.nextNode();
     }*/
    (function () {
        var skill = [{
            title: 'HTML&CSS',
            level: 7,
            detail: ['HTML、CSS代码编写规范，能合理设计结构兼容主流浏览器；', '编写语义化的 HTML；', '熟悉HTML5&CSS3；', '能熟练使用Chrome开发者工具、FireBug、Fiddler等工具辅助开发。']
        }, {
                title: 'JavaScript',
                level: 7,
                detail: ['熟悉JavaScript，能使用原生JS进行简易开发；', '能运用模块化、面向对象的方式编程；', '熟悉jQ框架']
            }, {
                title: 'Node.js',
                level: 3,
                detail: ['能构建简易Web应用；', '了解express,MongoDB,Jade,Markdown']
            }, {
                title: 'C#&Java',
                level: 2,
                detail: ['了解C#,Java，能配合后台工作。']
            }];
        var html = '', list = '';
        for (var i = 0, len = skill.length; i < len; i++) {
            for (var j = 0, l = skill[i].detail.length; j < l; j++) {
                list += '<li>' + skill[i].detail[j] + '</li>'
            }
            html += '<li class="skill_' + i + ' skill_list_item"><div class="skill_part" id="skill_' + i + '" data-level="' + skill[i].level + '"></div><h4 class="skill">' + skill[i].title + '</h4><div class="skill_part_detail fade"><ul class="list">' + list + '</ul></div></li>';
            list = '';
        }
        myMoudle.$All('.skill_list')[0].innerHTML = html;
        //圆环技能展示
        var _drawSkillRing = function (id, level) {
            myMoudle.$Id("skill_" + id).innerHTML = "<div class='percent'></div><div id='slice'" + (level > 5 ? " class='gt50'" : "") + "><div class='pie'></div>" + (level > 5 ? "<div class='pie fill'></div>" : "") + "</div>";
            var deg = 360 / 10 * level;
            myMoudle.$All("#skill_" + id + " #slice .pie")[0].style.cssText = "-moz-transform:rotate(" + deg + "deg);-webkit-transform:rotate(" + deg + "deg);-o-transform:rotate(" + deg + "deg);transform:rotate(" + deg + "deg);";
            myMoudle.$All("#skill_" + id + " .percent")[0].innerHTML = "<span class='int'>" + level + "</span>";
        };
        var _skillItem = myMoudle.$All('.skill_list>li.skill_list_item');
        for (var i = 0, len = _skillItem.length, skillRing; i < len; i++) {
            skillRing = myMoudle.getFirstElement(_skillItem[i]);
            //_drawSkillRing(skillRing.getAttribute('id').slice(-1), skillRing.getAttribute('data-level'));
            _drawSkillRing(/\d+/.exec(skillRing.getAttribute('id'))[0], skillRing.getAttribute('data-level'));
        }
    })();
    return myMoudle;
})();
//编码联系方式
if (window.atob) {
    Jose.$Id("phone").appendChild(document.createTextNode(window.atob('MTgwMTE3ODQ2NTM=')));
}
if (/phone/i.test(window.location.search)) {
    Jose.$Id("phone").style.display = '';
}
Jose.$Id("email").appendChild(document.createTextNode(['com', '163', 'zhang_Janp'].reverse().join('.').replace('.', '@')));