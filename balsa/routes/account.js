var express = require('express');
var uuid = require('uuid');
var fs = require('fs');
var data = require('../data.js');

var router = express.Router();
router.get('/list', function(req, res, next) {
	var id = req.param("id");
	var sql = 'select * from company_account';
	console.log(id);
	if (id !== undefined && id !== "") {
		sql = sql + " where seq_id = " + data.escape(id);
	}
	console.log(sql);
	data.selectQuery(sql, function(err, rows) {
		var result = {
			data : [],
			error : null,
		};
		if (err) {
			console.log(err);
			result.error = err;
		} else {
			result.data = rows;
		}
		res.send(result);
	});
});
router.post('/insert', function(req, res, next) {
	var params = {};
	var tempParam = null;
	var paramNames = [ "company_id", "bank_name", "account_num", "account_auth", "note" ];
	for (var name of paramNames) {
		console.log(name);
		tempParam = req.param(name);
		if(tempParam === undefined) continue;
		params[name] = tempParam;
	}
	if (params.company_id !== undefined && params.company_id.trim() != "") {
		params['mod_date'] = params['reg_date'] = new Date();
		data.insertQuery('insert into company_account set ?', params, function(err, id) {
			var result = {
				data : [],
				error : null,
			};
			if (err) {
				console.log(err);
				result.error = err;
			} else {
				result.data = id;
			}
			res.send(result);
		});
	} else {
		var result = {
			data : [],
			error : "can't find company_id"
		};
		res.send(result);
	}
});
router.post('/update', function(req, res, next) {
	var id = req.param("id");
	if (id !== undefined && id.trim() !== "") {
		var params = {};
		var tempParam = null;
		var paramNames = [ "company_id", "bank_name", "account_num", "account_auth", "note" ];
		for (var name of paramNames) {
			console.log(name);
			tempParam = req.param(name);
			if(tempParam === undefined) continue;
			params[name] = tempParam;
		}
		params['mod_date'] = new Date();
		data.updateQuery('update company_account set ? where seq_id = ?', [ params, id ], function(err, change) {
			var result = {
				data : [],
				error : null,
			};
			if (err) {
				console.log(err);
				result.error = err;
			} else {
				result.data = change;
			}
			res.send(result);
		});
	} else {
		var result = {
			data : [],
			error : "파라미터가 없습니다."
		};
		res.send(result);
	}
});
router.post('/delete', function(req, res, next) {
	var id = req.param("id");
	if (id !== undefined && id.trim() !== "") {
		data.deleteQuery("delete from company_account where seq_id = " + data.escape(id), function(err, change) {
			var result = {
				data : [],
				error : null,
			};
			if (err) {
				console.log(err);
				result.error = err;
			} else {
				result.data = change;
			}
			res.send(result);
		});
	} else {
		var result = {
			data : [],
			error : "파라미터가 없습니다."
		};
		res.send(result);
	}
});
module.exports = router;
