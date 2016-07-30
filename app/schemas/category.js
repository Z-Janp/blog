'use strict'
const mongoose = require('mongoose');
//NodeJS中的基本数据类型都属于Schema.Type，另外Mongoose还定义了自己的类型
const Schema = mongoose.Schema;
//主键，特殊类型，每个Schema都会默认配置 _id 这个属性。自定义可覆盖
const ObjectId = Schema.Types.ObjectId;
const CategorySchema = new Schema({
    name: {
        unique: true,
        type: String
    },
    //通过引用的方式存储此文章的id,指向Article这个模型
    //使用ObjectId作为字段的类型，关联文档的查询
    articles: [{ type: ObjectId, ref: "Article" }],
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
CategorySchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
    next();
})
CategorySchema.statics = {
    fetch: function (callback) {
        return this.find({}).sort({'meta.createAt':-1}).exec(callback);
    },
    findById: function (id, callback) {
        return this.findOne({ _id: id }).exec(callback);
    }
}
module.exports = CategorySchema;