var express = require('express');
var router = express.Router();
let user_controller = require('../controllers/userController');
let post_controller = require('../controllers/postController');
let comment_controller = require('../controllers/commentController');
let category_controller = require('../controllers/categoryController')
let passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/sign-up', user_controller.sign_up_post);

router.post('/sign-out', passport.authenticate('jwt', {session: false}), user_controller.sign_out_post);

// Posts GET, POST, UPDATE & DELETE
router.get('/posts', post_controller.get_posts);

router.get('/post/:postId', post_controller.get_post);

router.post('/new-post', passport.authenticate('jwt', {session: false}), post_controller.create_post);

router.put('/post/:postId', passport.authenticate('jwt', {session: false}), post_controller.update_post);

router.delete('/post/:postId', passport.authenticate('jwt', {session: false}), post_controller.delete_post);

// Comments GET, POST & DELETE
router.get('/post/:postId/comments', comment_controller.get_comments);

router.post('/post/:postId/new-comment', comment_controller.create_comment);

router.delete('/post/:postId/comments/:commentId', comment_controller.delete_comment);

// Categories GET & POST 
router.get('/categories', category_controller.get_categories);

router.get('/categories/:categoryId', category_controller.category_detail);

router.post('/new-category', category_controller.create_category);



module.exports = router;
