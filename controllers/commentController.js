let Comment = require('../models/comment');
let Post = require('../models/post');

exports.create_comment = [
    (req, res, next) => {
        if (req.body.author === '' || req.body.content === ''){
            res.send('Fields can not be left empty')
        } else {
            let comment = new Comment({
                author: req.body.author,
                content: req.body.content,
                post_origin: req.params.postId,
                timestamp: new Date()
            });
            comment.save(err => {
                if (err) { return next(err); }
            });
            Post.find({ _id: req.params.postId }).exec((err, originalPost) => {
                let modifiedPost = {
                    ...originalPost,
                    comments: [comment, ...originalPost[0].comments]
                }
                Post.findByIdAndUpdate(req.params.postId, modifiedPost, {}, function(err, result){
                    res.send('Success')                 
                });
            });
        }
    }
];

exports.get_comments = (req, res, next) => {
    Post.findById(req.params.postId).exec(function(err, post){
        Comment.find({ post_origin: post._id }).sort( { timestamp: -1 }).exec(function(err, result){
            if (err) { return next(err); }
            res.send(result);
        });
    })
};

exports.delete_comment = (req, res, next) => {
    Post.find({ _id: req.params.postId }).exec((err, post) => {
        let newComments = post[0].comments.filter(comment => comment._id !== req.params.commentId)
        let modifiedPost = {
            ...newComments,
            comments: newComments
        }
        Post.findByIdAndUpdate(req.params.postId, modifiedPost, {}, function(err, modifiedPost){
        });
    })

    Comment.findByIdAndRemove(req.params.commentId, function deleteComment(err){
        if (err) { return next(err) }
        res.send({message: 'Successfully deleted'})
    });
};
