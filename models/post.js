'use strict';

var mongoose = require('mongoose');

var PostSchema = mongoose.Schema({

    image: String,
    title: String,
    favorites: Number,
    user_id: mongoose.Schema.Types.ObjectId

});

var PostModel = mongoose.model('Post', PostSchema);

module.exports = PostModel;
