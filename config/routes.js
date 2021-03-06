const Article = require('../app/controllers/article.js');
const Index = require('../app/controllers/index.js');
const User = require('../app/controllers/user.js');
//const Category = require('../app/controllers/category.js');
module.exports = (app) => {
    app.use((req, res, next) => {
        app.locals.user = req.session.user;
        //重新修改session的过期时间
        req.session._garbage = Date();
        req.session.touch();
        next();
    })

    app.get('/', Index.index);

    app.post('/user/login', User.login);
    app.get('/user/logout', User.logout);
    app.get('/login', User.showLogin);

    app.get('/article/:id', Article.detail);
    app.post('/result', Article.search);
    app.get('/editor', Article.edit);
    app.post('/article/toggleStatus', User.loginRequire, Article.toggleStatus);
    app.get('/editor/:id', Article.update);
    app.get('/admin/article/list', User.loginRequire, Article.list);
    app.post('/admin/publish', User.loginRequire, Article.save);
    app.get('/admin/createUptoken', Article.createUptoken);

    app.get('/about', Index.showAbout);
    app.get('/resume', Index.showResume);

    app.get('/baidu_verify_QQZp53BYMW.html', function (req, res) {
        res.sendfile("baidu_verify_QQZp53BYMW.html");
    });

    app.get('/music', Index.showMusic);
    app.get('/api/request/music', Index.sentMusic);

    //app.get('/:id', Article.xhrdetail);

    app.get('*', Index.pageNotfound);
}