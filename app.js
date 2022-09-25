let dotenv = require('dotenv').config();
let bcrypt = require('bcryptjs');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require("express-session");
const jwt = require('jsonwebtoken');
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
let User = require('./models/user.js')
var cors = require('cors');

var indexRouter = require('./routes/index');

let MongoDBStore = require('connect-mongodb-session')(session);
let store = new MongoDBStore({
  uri: process.env.MONGODB_SESSIONS_URI
}) 

let mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true , useUnifiedTopology: true})
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({ secret: process.env.SESSION_SECRET_KEY, 
  resave: false,
  saveUninitialized: true,
  store: store
}));

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) { 
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          // passwords match! log user in
          return done(null, user)
        } else {
          // passwords do not match!
          return done(null, false, { message: "Incorrect password" })
        }
      })
    });
  })
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

app.use(passport.initialize());
app.use(passport.session());

app.post(
  "/log-in",
  function (req, res, next) {
    passport.authenticate('local', {session: false}, (err, user, info) => {
            if (err || !user) {
                return res.status(400).json({
                    message: 'Something is not right',
                    user : user
                });
            }
    
    req.login(user, {session: false}, (err) => {
               if (err) {
                   res.send(err);
               }
    // generates a signed json web token with the contents of user object and return it in the response
    const token = jwt.sign(user.toJSON(), 'your_jwt_secret');
               return res.json({user, token});
            });
        })(req, res);
});

passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey : 'your_jwt_secret'
  },
  function (jwtPayload, cb) {
    return User.findById(jwtPayload._id)
      .then(user => {
          return cb(null, user);
      })
      .catch(err => {
          return cb(err);
      });
  }
));

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;