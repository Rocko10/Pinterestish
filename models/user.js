'use strict';

var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({

    twitter_id: String,
    twitter_username: String,
    twitter_photo: String

});

var UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
