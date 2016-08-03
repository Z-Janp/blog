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

    app.get('/blog', Index.index);
    app.post('/result', Index.search);

    app.post('/user/login', User.login);
    app.get('/user/logout', User.logout);
    app.get('/login', User.showLogin);

    app.get('/article/:id', Article.detail);
    app.get('/editor', Article.edit);
    app.delete('/article/del', User.loginRequire, Article.deleteArticle);
    app.get('/editor/:id', Article.update);
    app.get('/admin/article/list', User.loginRequire, Article.list);
    app.post('/admin/publish', User.loginRequire, Article.save);

    app.get('/resume',Index.showResume);
    app.get('/music',Index.showMusic);

    app.get('/:id', Article.xhrdetail);

    app.get('*', Index.pageNotfound);
}