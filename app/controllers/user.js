const User = require('../models/user.js');
exports.login = (req, res) => {
    const _user = req.body.user;
    const name = _user.name;
    const password = _user.password;
    User.findOne({ name: name }, (err, user) => {
        if (err) {
            console.log(err);
        }
        if (!user) {
            return res.json({ error: -1, data: '用户名与密码不匹配!' });
        }
        const isMatch = user.comparePassword(password);
        if (isMatch) {
            req.session.user = user;
            return res.json({ success: 1, data: '登录成功！', user: user.name });
        } else {
            return res.json({ error: -1, data: '用户名与密码不匹配!' });
        }
    })
};
//logout
exports.logout = (req, res) => {
    delete req.session.user;
    res.redirect('/');
};
exports.showLogin = (req, res) => {
    res.render('login', {
        title: '登录'
    })
};
//midware for user
exports.loginRequire = (req, res, next) => {
    const user = req.session.user;
    if (!user) {
        if (req.path.indexOf('/admin/article/list') > -1) {
            res.redirect('/login');
        }
        return res.json({ error: -2, data: '未登录，请登陆后操作!' });
    }
    next();
};
//midware for user
exports.adminRequire = (req, res, next) => {
    const user = req.session.user;
    if (user.role <= 10) {
        return res.redirect('/login');
    }
    next();
};
//注册
exports.signup = (req, res) => {
    const _user = req.body.user;//user对象 中间件bodyParser将数据格式化为对象
    //req.param('user')  express的实现
    User.findOne({ name: _user.name }, (err, user) => {
        if (err) {
            console.log(err);//404 500
        }
        if (user) {
            res.redirect('/login');//用户名已存在
        } else {
            user = new User(_user);
            user.save((err, user) => {
                if (err) {
                    console.log(err);
                }
                res.redirect('/');
            })
        }
    })
}