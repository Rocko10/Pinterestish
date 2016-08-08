'use strict';

var User = require('./../models/user');
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;

module.exports = function(){

    passport.serializeUser((user, cb) => {

        cb(null, user.id);

    });

    passport.deserializeUser((id, cb) => {

        User.findOne({_id: id}, (err, user) => {

            cb(err, user);

        });
    });

    /* twitter strategy */
    passport.use(new TwitterStrategy({

        consumerKey: process.env.TWITTER_CONSUMER_KEY,
        consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
        callbackURL: 'http://127.0.0.1:3000/auth/twitter/callback'

    }, (token, tokenSecret, profile, cb) => {

        User.findOne({twitter_id: profile.id}, (err, user) => {

            if(err){ return cb(err); }

            if(user){ return cb(null, user); }

            /* create and save in DB */
            let newUser = new User({

                twitter_id: profile.id,
                twitter_username: profile.username,
                twitter_photo: profile.photos[0].value,

            });

            newUser.save(err => {

                if(err){ return cb(err); }

                return cb(null, newUser);
            });

        });

    }));

}
