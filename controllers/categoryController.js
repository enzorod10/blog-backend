let Category = require('../models/category.js');
let Post = require('../models/post.js')

exports.create_category = function(req, res, next){
    const category = new Category({
        category: req.body.category,
        posts: []
    });
    category.save(err => {
        if (err) { return next(err) }
            res.redirect('/')
    })
};

exports.get_categories = function (req, res, next){
    Category.find().exec((err, result) => {  
        if (err){ next(err) }
        res.send(result)
    })
}

exports.category_detail = function(req, res, next) {
    Category.findById(req.params.categoryId, (err, categoryResult) => {
        Post.find({'category': req.params.categoryId }).exec((err, result) => {
            if (err) { return next(err); }
            const category = {category: categoryResult.category, posts: result}
            res.send(category)
        })
    });
};