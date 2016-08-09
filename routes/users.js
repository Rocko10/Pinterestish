'use strict';

var express = require('express');
var Post = require('./../models/post');

var router = express.Router();

router.use((req, res, next) => {

    res.locals.currentUser = req.user,
    res.locals.infos = req.flash('info'),
    res.locals.errors = req.flash('error')

    next();

});

router.get('/', onlyAuth, function(req, res, next) {

    Post.find({user_id: req.user.id}, (err, posts) => {

        if(err){ return next(err); }

        res.render('users/profile', {posts});

    });


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
        user_id: req.user.id
    });

    newPost.save(err => {

        if(err){ return next(err); }

        req.flash('info', 'Post created successfully!');

        res.redirect('/users/');

    });


});

/* through XMLHttpRequest */
router.delete('/posts/delete', onlyAuth, (req, res, next) => {

    let postID = req.body.postID;

    Post.findOne({_id: postID}, (err, post) => {

        if(err){ return res.status(500).end(err.message); }

        if(!post){ return res.status(404).end('Not founded') }

        /* no errors and post founded */
        post.remove(err => {

            if(err){ return res.status(500).end(err.message); }

            res.end('Done');

        });

    });

});

/* through XMLHttpRequest */
router.patch('/posts/favorite', (req, res) => {

    console.log('FAVORITING...');
    console.log(req.body);

    res.end('FAVS')

});

function onlyAuth(req, res, next){

    if(!req.isAuthenticated()){

        req.flash('error', 'Only auth people');

        return res.redirect('/');
    }

    next();

}

module.exports = router;
