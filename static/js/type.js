(function () {
    var type = document.getElementsByClassName('info')[0];
    var info = [{
        msg: '嗨，欢迎您来到站点，我叫建平，Web前端实习生，目前尚未就职~喜欢踢球，',
        del: false
    }, {
            msg: '人称“进攻终结者”',
            del: true
        }, {
            msg: '我的位置是边后卫。',
            del: false
        }];
    var index = 0,
        letterIndex = 1,
        tmp = '';
    function TypeText() {
        var msg = info[index].msg;
        type.innerHTML = tmp + msg.slice(0, letterIndex++);
        if (letterIndex > msg.length) {//此条输完
            if (info[index].del) {
                setTimeout(deleteText, 500);
                letterIndex = msg.length;
                return;
            } else {
                letterIndex = 1;
                tmp += msg;
            }
            index++;
            if (index >= info.length) {
                return;
            }
        }
        setTimeout(TypeText, 200);
    }
    function deleteText() {
        var msg = info[index].msg;
        type.innerHTML = tmp + msg.slice(0, letterIndex-- - 1);
        if (letterIndex === 0) {
            index++;
            TypeText()
        } else {
            setTimeout(deleteText, 70);//每70ms清除一个字符
        }
    }
    TypeText();
})();