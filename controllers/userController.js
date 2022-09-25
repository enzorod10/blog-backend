let bcrypt = require('bcryptjs');
let User = require('../models/user.js');

exports.sign_up_post = function(req, res, next){
    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        if (err){
          console.log('Error: Something went wrong')
        } else {
          const user = new User({
            username: req.body.username,
            password: hashedPassword,
            admin_status: true
          }).save(err => {
            if (err) { 
              return next(err);
            }
            res.redirect("/");
          });
        }
      })
};

exports.sign_out_post = function(req, res, next){
  req.logout(function(err){
    if (err) { return next(err) }
    res.send({message: 'Successfully signed out'})
  });
};