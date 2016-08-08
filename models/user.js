'use strict';

var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({

    twitter_id: String,
    twitter_nickname: String,
    twitter_email: String

});

var UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
