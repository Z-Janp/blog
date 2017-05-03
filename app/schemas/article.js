'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const ArticleSchema = new Schema({
    author: String,
    title: String,
    content: String,
    status: Number,
    category: { type: ObjectId, ref: "Category" },
    meta: {
        createAt: {
            type: Date,
            nowDate: Date.now()
        },
        updateAt: {
            type: Date,
            nowDate: Date.now()
        }
    }
})
//给模式添加方法,pre:每次在存储数据前调用这个方法
ArticleSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
    //调用next 进行后续存储流程
    next();
})
//这里的静态方法不会与数据库直接交互，需要经过Model编译进行实例化。
ArticleSchema.statics = {
    fetch: function (callback) {
        return this.find({}).sort({'meta.createAt':-1}).exec(callback);
    },
    findById: function (id, callback) {
        return this.findOne({ _id: id }).exec(callback);
    }
}
module.exports = ArticleSchema;