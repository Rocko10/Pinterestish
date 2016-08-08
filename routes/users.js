'use strict';

var express = require('express');
var Post = require('./../models/post');

var router = express.Router();

/* TODO 1 create partial header with user info */
/* TODO 2 list on '/' all my posts */

router.use((req, res, next) => {

    res.locals.currentUser = req.user,
    res.locals.infos = req.flash('info'),
    res.locals.errors = req.flash('error')

    next();

});

router.get('/', onlyAuth, function(req, res, next) {

    res.render('users/profile');

});

router.get('/new-post', onlyAuth, (req, res, next) => {
    res.render('users/posts/new');
});

router.post('/create-post', onlyAuth, (req, res, next) => {

    let image = req.body.img.trim();
    let title = req.body.title.trim();

    if(image.length < 5 || title.length < 3){

        req.flash('error', 'Image/Title invalid');
        return res.redirect('/users/new-post');

    }

    let newPost = new Post({
        image,
        title,
        favorites: 0,
        user_id: req.user.id
    });

    newPost.save(err => {

        if(err){ return next(err); }

        req.flash('info', 'Post created successfully!');

        res.redirect('/users/');

    });


});

function onlyAuth(req, res, next){

    if(!req.isAuthenticated()){

        req.flash('error', 'Only auth people');

        return res.redirect('/');
    }

    next();

}

module.exports = router;
