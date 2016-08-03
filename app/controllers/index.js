const Article = require('../models/article.js');
const Category = require('../models/category.js');
exports.index = (req, res) => {
    Category
        .find({}, { 'name': 1, 'articles': 1, _id: 0 })
        .populate({ path: 'articles', select: '_id title', options: { sort: { 'meta.createAt': -1 } } })
        .exec((err, categories) => {
            if (err) {
                console.log(err);
            }
            res.render('index', {
                title: 'blog',
                categories: categories
            })
        })
};
exports.search = (req, res) => {
    const q = req.body.search;
    const regexp = new RegExp(q + '.*', 'i');
    console.log(q);
    Article
        .find({ "$or": [{ 'title': regexp }, { 'content': regexp }] })
        .exec((err, articles) => {
            res.json({ success: true, articles: articles });
        })
}
exports.pageNotfound = (req, res) => {
    console.log('404 handler, URL' + req.originalUrl);
    res.status(404);
    res.render('404', {
        status: 404,
        title: '您欲访问的页面未找到'
    });
};
exports.showResume = (req, res) => {
    res.render('resume');
}
exports.showMusic = (req, res) => {
    res.render('music');
}