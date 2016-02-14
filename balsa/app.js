var uuid = require('uuid');
// 웹프레임웍
var express = require('express');
var path = require('path');
// html 렌더 모듈
var ejs = require('ejs');
var favicon = require('serve-favicon');
var logger = require('morgan');
// 쿠키파서.
var cookieParser = require('cookie-parser');
// 바디 데이터 파서.
var bodyParser = require('body-parser');
// 세션관리자.
var session = require('express-session');
// 세션메모리관리 redis연동 모듈.
var RedisStore = require('connect-redis')(session);

var routes = require('./routes/index');
var account = require('./routes/account');
var login = require('./routes/login');
var users = require('./routes/users');

var compression = require('compression');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', '/img/white-image.png')));
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended : false
}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// 세션 저장 변수.
var store = new RedisStore({
	host : process.env.aws !== undefined ? 'localhost' : 'rocketdan.duckdns.org', // 로컬하고 aws 구분.
	port : 6379,
})
// 새션 생성 미들웨어 루틴.
app.use(session({
	store : store,
	name : "session",
	genid : function() {
		return uuid.v4();
	},
	secret : 'na-ong',
	cookie : {
		maxAge : 60000
	},
	resave : true,
	saveUninitialized : true
}));

// 로그인 필터링 옵션 로그인 되지 않으면 로그인페이지 이동, 로그인 되면 루트페이지 이동.
app.use(function(req, res, next) {
	var path = req.path;
	// console.log(req.session);
	if ((req.session === undefined || req.session.login === undefined) 
		&& path != "/login/login.page" && path != "/login/loginProcess") {
		// req.session.login = true;
		// console.log(path);
		res.redirect("/login/login.page");
	} else {
		next();
	}

	// store.client.keys("sess:*", function(error, keys) {
	// // console.log("Number of active sessions: ", keys.length);
	// // console.log(keys);
	// })
});
app.use('/login', login);
app.use('/', routes);
app.use('/account', account);
app.use('/users', users);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message : err.message,
			error : err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	console.log(err);
	res.status(err.status || 500);
	res.render('error', {
		message : err.message,
		error : {}
	});
});
exports.store = store;
module.exports = app;
