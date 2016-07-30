'use strict'
const mongoose = require('mongoose');
const ArticleSchema = require('../schemas/article.js');
const Article = mongoose.model('Article', ArticleSchema);
module.exports = Article;
