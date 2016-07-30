'use strict'
const mongoose = require('mongoose');
const CategorySchema = require('../schemas/category.js');
const Category = mongoose.model('Category', CategorySchema);
module.exports = Category;