'use strict';

var User = require('./../models/user');
var passport = require('passport');

module.exports = function(){

    function serializeUser(user, cb){

        cb(null, user.id);

    }

    function deserializeUser(id, cb){

        User.findOne({_id: id}, (err, user) => {

            cb(err, user);

        });

    }
    
}
