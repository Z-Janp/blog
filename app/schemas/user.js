'use strict'
const mongoose = require('mongoose');
const crypto = require('crypto');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const UserSchema = new Schema({
    name: {
        unique: true,
        type: String
    },
    password: String,
    articles: [{ type: ObjectId, ref: "Article" }],
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
});
UserSchema.pre('save', function (next) {
    const user = this;
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now()
    }
    else {
        this.meta.updateAt = Date.now()
    }
    const hash = crypto.createHash('sha1');
    hash.update(user.password);
    user.password = hash.digest('hex');;
    next();
});

UserSchema.methods = {
    comparePassword: function (_password) {
        const hash = crypto.createHash('sha1');
        hash.update(_password);
        _password = hash.digest('hex');
        if (_password === this.password) {
            return true;
        } else {
            return false;
        }
    }
};

UserSchema.statics = {
    fetch: function (cb) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb)
    },
    findById: function (id, cb) {
        return this
            .findOne({ _id: id })
            .exec(cb)
    }
};

module.exports = UserSchema