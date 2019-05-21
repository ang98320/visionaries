var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var admin = require('firebase-admin');
var firebase = require('firebase/app');
var serviceAccount = require('./speedreader-d2816-83788023e819');
var bodyParser = require("body-parser");

var indexRouter = require('./routes/index');
var demoRouter = require('./routes/demo');
var savedRouter = require('./routes/saved');
var usersRouter = require('./routes/users');

let firebaseConfig = {
		    apiKey: "AIzaSyDYKhmDPqTGt1y52M1MI9VVnC0T6zXJML8",
		    authDomain: "speedreader-d2816.firebaseapp.com",
		    databaseURL: "https://speedreader-d2816.firebaseio.com",
		    projectId: "speedreader-d2816",
		    storageBucket: "speedreader-d2816.appspot.com",
		    messagingSenderId: "583849395371",
		    appId: "1:583849395371:web:8807a2373c849f56"
};
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://speedreader-d2816.firebaseio.com"
});

var app = express();

//let defaultStorage = firebase.database();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/demo', demoRouter);
app.use('/saved', savedRouter);

app.get('/demo-save', function(req, res, next) {
	var data = {
		name: "jim",
		email: "jjc"
	};
	var setDoc = admin.firestore().collection('users').doc('node_test').set(data);
	res.send("success");
});

app.get('/demo-speedreader', function(req, res, next) {
  res.send("This is a demo of a speed reader. You are reading at 120 WPM! That's amazing! Do we have your attention now!?");
});

// use this to check if article in home is saved
// if so, use this to star the saved articles in home
app.get('/check-if-article-saved', function(req, res, next) {
	res.send("not implemented")
});

// load saved articles from firebase
app.get('/get-articles', function(req, res, next) {
	var articles = [];
  var dbRef = admin.firestore().collection('saved-articles');
	var getDoc = dbRef.get().then(snap => {
		snap.forEach(doc => {
			console.log(doc.data());
			articles.push(doc.data());
		});
	}).then(() => {
		res.send(articles);
	}).catch(() => {
		console.log("get-articles err");
	});
});

// saves single article to firebase
// TODO check if article exists in firebase already (use url)
app.post('/save-article', function(req, res, next) {
	article = {
    "author": req.body.author,
    "content": req.body.content,
    "description": req.body.description,
    "publishedAt": req.body.publishedAt,
    "title": req.body.title,
    "url": req.body.url,
    "urlToImage": req.body.urlToImage
  };
	console.log(article);
	var setDoc = admin.firestore().collection('saved-articles').doc().set(article);
	res.send("save-article success");
});

// remove single article from firebase
app.post('/remove-article', function(req, res, next) {
	res.send("not implemented yet");
});

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
