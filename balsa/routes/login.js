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
	res.redirect('./login.page');
});
router.all('/login.page', function(req, res, next) {
	if (req.session !== undefined && req.session.login !== undefined) {
		res.redirect("back");
	} else {
		if (req.method == "POST") {
			var id = req.param('id');
			var pw = req.param('pw');
			console.log(id, pw);
			if (id !== undefined && pw !== undefined) {
				pw = crypto.createHmac('sha256', 'rocket launch').update(pw).digest('hex')
				var sql = 'select * from employee_info';
				sql = sql + " where user_id = " + data.escape(id) + " AND user_pw= " + data.escape(pw);
				data.selectQuery(sql, function(err, rows) {
					if (err) {
						console.log(err);
						res.render('login.html', {
							error : err
						});
						// result.error = err;
					} else {
						if (rows.length == 1) {
							req.session.login = true;
							// var userInfo = rows[0];
							// for ( var name in userInfo) {
							// req.session[name] = userInfo[name];
							// }
							// result.data = "succes";
							res.redirect("/");
						} else {
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
