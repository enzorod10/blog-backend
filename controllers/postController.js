let Post = require('../models/post');
let Comment = require('../models/comment');

exports.create_post =[
    (req, res, next) => {
        let post = new Post({
            title: req.body.title,
            content: req.body.content,
            summary: req.body.summary,
            timestamp: new Date(),
            published_status: false,
            category: req.body.category,
            comments: []
        })
        post.save(function (err) {
            if (err) { return next(err) }
            res.redirect('/')
        });
    }
];

exports.get_posts = function (req, res, next){
    Post.find().exec((err, result) => {
        if (err) { next(err) }
        res.send(result)
    })
};

exports.get_post = function (req, res, next){
    Post.findById(req.params.postId).then(result => {
        res.send(result)
    })
    .catch(err => {
        console.log(err)
        next(err)
    })
};

exports.update_post = [
    (req, res, next) => {
        let modifiedPost = {
            title: req.body.title,
            content: req.body.content,
            summary: req.body.summary,
            published_status: req.body.published_status
        }
        Post.findByIdAndUpdate(req.params.postId, modifiedPost).then(newPost => {
            res.send(newPost);
        });
    }
];

exports.delete_post = function (req, res, next){
    Comment.deleteMany({post_origin: req.params.postId}, function removeComments(err, result){
        if (err) { return next(err) }
        Post.findByIdAndRemove(req.params.postId, function removePost(err){
            if (err) { return next(err) }
            res.send({message: 'Successfully deleted'})
        })
    });
};