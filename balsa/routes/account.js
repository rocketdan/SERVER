var express = require('express');
var uuid = require('uuid');
var fs = require('fs');
var data = require('../data.js');
data.connect();

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
router.get('/insert', function(req, res, next) {
	var params = {};
	var tempParam = null;
	tempParam = req.param("company_id");
	if (tempParam !== undefined) {
		params['company_id'] = tempParam;
		tempParam = null
	}
	tempParam = req.param("bank_name");
	if (tempParam !== undefined) {
		params['bank_name'] = tempParam;
		tempParam = null
	}
	tempParam = req.param("account_num");
	if (tempParam !== undefined) {
		params['account_num'] = tempParam;
		tempParam = null
	}
	tempParam = req.param("account_auth");
	if (tempParam !== undefined) {
		params['account_auth'] = tempParam;
		tempParam = null
	}
	tempParam = req.param("note");
	if (tempParam !== undefined) {
		params['note'] = tempParam;
		tempParam = null
	}
	if (params.company_id !== undefined && params.company_id.trim() != "") {
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
router.get('/update', function(req, res, next) {
	var id = req.param("id");
	if (id !== undefined && id.trim() !== "") {
		var params = {};
		var tempParam = null;
		tempParam = req.param("company_id");
		if (tempParam !== undefined) {
			params['company_id'] = tempParam;
			tempParam = null
		}
		tempParam = req.param("bank_name");
		if (tempParam !== undefined) {
			params['bank_name'] = tempParam;
			tempParam = null
		}
		tempParam = req.param("account_num");
		if (tempParam !== undefined) {
			params['account_num'] = tempParam;
			tempParam = null
		}
		tempParam = req.param("account_auth");
		if (tempParam !== undefined) {
			params['account_auth'] = tempParam;
			tempParam = null
		}
		tempParam = req.param("note");
		if (tempParam !== undefined) {
			params['note'] = tempParam;
			tempParam = null
		}
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
router.get('/delete', function(req, res, next) {
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
