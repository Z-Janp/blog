'use strict'
const _ = require('underscore');
const marked = require('marked');
const Article = require('../models/article.js');
const Category = require('../models/category.js');
// const Highlight = require("highlight").Highlight;
exports.detail = (req, res, next) => {
    const id = req.params.id;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        Article.findById(id, (err, article) => {
            if (err) {
                console.log(err);
            }//处理null
            if (article) {
                article.content = marked(article.content);
                res.render('article', {
                    title: article.title,
                    article: article
                })
            } else {
                next();
            }
        })
    } else {
        next();
    }
    // if (id.match(/^[0-9a-fA-F]{24}$/)) {
    //     Category
    //         .find({}, { 'name': 1, 'articles': 1, _id: 0 })
    //         .populate({ path: 'articles', select: '_id title', options: { sort: { 'meta.createAt': -1 } } })
    //         .exec((err, categories) => {
    //             if (err) {
    //                 console.log(err);
    //             }
    //             Article.findById(id, (err, article) => {
    //                 if (err) {
    //                     console.log(err);
    //                 }
    //                 if (article) {
    //                     article.content = marked(article.content);
    //                     res.render('article', {
    //                         title: article.title,
    //                         categories: categories,
    //                         article: article
    //                     })
    //                 } else {
    //                     // res.render('index', {
    //                     //     title: '文章不存在',
    //                     //     categories: categories
    //                     // })
    //                     next();
    //                 }
    //             })
    //         })
    // } else {
    //     next();
    // }
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
exports.xhrdetail = (req, res, next) => {
    const id = req.params.id;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        Article.findById(id, (err, article) => {
            if (err) {
                console.log(err);
            }//处理null
            article.content = marked(article.content);
            res.json({ success: true, article: article });
        })
    } else {
        next();
    }
};
exports.edit = (req, res) => {
    Category
        .find({})
        .exec((err, categories) => {
            if (err) {
                console.log(err);
            }
            res.render('editor', {
                title: '撰写文章',
                categories: categories
            })
        })
};
exports.deleteArticle = (req, res) => {
    const id = req.query.id;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        Article.remove({ _id: id }, (err, article) => {
            if (err) {
                console.log(err);
            } else {
                res.json({ success: 1 });
            }
        })
    }
};

exports.update = (req, res) => {
    const id = req.params.id;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        Article.findById(id, (err, article) => {
            Category.find({}, (err, categories) => {
                if (err) {
                    console.log(err);
                } if (article === null) {
                    res.redirect('/editor');
                }
                res.render('editor', {
                    title: '更新文章',
                    article: article,
                    categories: categories
                })
            })
        })
    } else {
        res.redirect('/editor');
    }
};
exports.list = (req, res) => {
    Article
        .find({ author: req.session.user.name }, { 'content': 0 })
        .populate({ path: 'category', select: 'name', })
        .sort({ 'meta.createAt': -1 })
        .exec((err, articles) => {
            if (err) {
                console.log(err);
            }
            res.render('list', {
                title: '文章列表',
                articles: articles
            })
        })
};
exports.save = (req, res) => {
    const articleObj = req.body.article;
    const id = req.body.article._id;
    let _article;
    if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
        Article.findById(id, (err, article) => {
            if (err) {
                console.log(err);
            }
            _article = _.extend(article, articleObj);
            //调用数据库实例的save,数据将存储到数据库。
            _article.save((err, article) => {
                if (err) {
                    res.json({ err: '_article保存失败~' });
                    console.log(err);
                }
                //res.redirect('/article/' + id);
                res.json({ success: 1, id: id });
            })
        })
    } else {
        _article = new Article(articleObj);
        _article.author = req.session.user.name;
        const categoryId = articleObj.category;
        const categoryName = articleObj.categoryName;
        _article.save((err, article) => {
            if (err) {
                res.json({ err: '_article保存失败~' });
                console.log(err);
            }
            if (categoryName) {
                const category = new Category({
                    name: categoryName,
                    articles: [article._id]
                });
                category.save((err, category) => {
                    if (err) {
                        res.json({ err: 'category保存失败~' });
                        console.log(err);
                    }
                    article.category = category._id;
                    article.save((err, article) => {
                        if (err) {
                            res.json({ err: 'article保存失败~' });
                            console.log(err);
                        }
                        //res.redirect('/article/' + article._id);
                        res.json({ success: 1, id: article._id });
                    })
                })
            } else if (categoryId) {
                //根据id找到对应文章分类文档，往此文档的articles字段push数据
                Category.findById(categoryId, (err, category) => {
                    if (err) {
                        res.json({ err: '查找失败~' })
                        console.log(err);
                    }
                    category.articles.push(_article._id);
                    category.save((err, category) => {
                        if (err) {
                            res.json({ err: 'category保存失败~' });
                            console.log(err);
                        }
                        //res.redirect('/article/' + article._id);
                        res.json({ success: 1, id: article._id });
                    })
                })
            }
        })
    };
}