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

    Post
    .find({'favorites.user_id': req.user.id})
    .exec()
    .then(postsFaved => {
        Post
        .find({'favorites.user_id': {
            $ne: req.user.id
        }})
        .exec()
        .then(posts => {
            res.render('users/profile', {postsFaved, posts});
        });
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
router.patch('/posts/favorite', onlyAuth, (req, res) => {

    let postID = req.body.postID;

    Post.findOne({_id: postID}, (err, post) => {

        if(err){ return res.status(500).end('Error'); }

        if(!post){ return res.status(404).end('Not found'); }

        /* check if the user already voted */
        for(let u of post.favorites){
            if(u.user_id.equals(req.user.id)){
                return res.status(405).end('Already voted');
            }
        }

        /* add favorite to DB */
        post.favorites.push({user_id: req.user.id});

        post.save()
        .then(doc => { res.send('OK') });

    });

});

/* through XMLHttpRequest */
router.patch('/posts/unfavorite', onlyAuth, (req, res) => {

    let postID = req.body.postID;

    Post.findOne({_id: postID, 'favorites.user_id': req.user.id})
    .exec()
    .then(post => {

        if(!post){ return res.status(404).end('Not found'); }

        /* remove the user id from the array of favorites */
        for(let i = 0; i < post.favorites.length; i++){
            if(post.favorites[i].user_id.equals(req.user.id)){
                post.favorites.splice(i, 1);
                break;
            }
        }

        post.save()
        .then(doc => {
            res.send('[OK]: Unfav');
        });

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
