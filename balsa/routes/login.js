var express = require('express');
var uuid = require('uuid');
var fs = require('fs');
var data = require('../data.js');
var app = require('../app.js');
// 암호화모듈.
var crypto = require('crypto');

// var pass = hmac.update('TestHmac').digest('hex');
var router = express.Router();
router.all('/', function(req, res, next) {
	// 로그인 페이지 없이 로그인 루트로 접속시 로그인페이지로 이동.
	res.redirect('./login.page');
});
// 로그인 페이지 및 인증 이루어지는 루틴.
router.all('/login.page', function(req, res, next) {
	// 세션이 있고 세션에 로그인이 되어 잇으면 페이지를 뒤로 이동 시킴.
	if (req.session !== undefined && req.session.login !== undefined) {
		res.redirect("back");
	} else {
		// 포스트로 데이터 넘어 오면 로그인 작업을 함.
		if (req.method == "POST") {
			var id = req.param('id');
			var pw = req.param('pw');
			console.log(id, pw);
			// 아이디 패스워드 두개 존재 할때만 쿼리함.
			if (id !== undefined && pw !== undefined) {
				pw = crypto.createHmac('sha256', 'rocket launch').update(pw).digest('hex')
				var sql = 'select * from employee_info';
				sql = sql + " where user_id = " + data.escape(id) + " AND user_pw= " + data.escape(pw);
				data.selectQuery(sql, function(err, rows) {
					if (err) {
						console.log(err);
						// 로그인 실패시 로그인페이지 보여줌.
						res.render('login.html', {
							error : err
						});
						// result.error = err;
					} else {
						if (rows.length == 1) { // 로그인 성공시 루트페이지 이동.
							req.session.login = true;
							// var userInfo = rows[0];
							// for ( var name in userInfo) {
							// req.session[name] = userInfo[name];
							// }
							// result.data = "succes";
							res.redirect("/");
						} else {
							// 아이디 혹은 패스워드 틀려 로그인 실패시 로그인페이지 이동.
							res.render('login.html', {
								id : id
							});
						}
					}
				});
			}
		} else {
			res.render('login.html');
		}
	}
});
module.exports = router;
