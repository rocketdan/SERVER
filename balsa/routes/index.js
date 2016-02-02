var express = require('express');
var router = express.Router();
router.get('/', function(req, res, next) {

	res.render('index.html', {
		title : 'Express'
	});
});
router.get('/company_info_list', function(req, res, next) {
	var data = require('../data.js');
	var id = req.param("id");
	var sql = 'select * from company_info';
	console.log(id);
	data.connect();
	if (id != undefined && id != "") {
		sql = sql + " where seq_id = " + data.escape(id);
	}
	console.log(sql);
	data.selectQuery(sql, function(err, rows) {
		var result = {
			data : [],
			err : ""
		};
		if (err) {
			console.log(err);
			result.err = err;
		} else {
			result.data = rows;
		}
		res.send(result);
	});
});
router.get('/company_info_list/insert', function(req, res, next) {
	var params = {};
	var tempParam = null;
	tempParam = req.param("company_name");
	if (tempParam != undefined) {
		params['company_name'] = tempParam;
		tempParam = null
	}
	tempParam = req.param("ceo_name");
	if (tempParam != undefined) {
		params['ceo_name'] = tempParam;
		tempParam = null
	}
	tempParam = req.param("company_num");
	if (tempParam != undefined) {
		params['company_num'] = tempParam;
		tempParam = null
	}
	tempParam = req.param("company2_num");
	if (tempParam != undefined) {
		params['company2_num'] = tempParam;
		tempParam = null
	}
	tempParam = req.param("tour_num");
	if (tempParam != undefined) {
		params['tour_num'] = tempParam;
		tempParam = null
	}
	tempParam = req.param("sub_num");
	if (tempParam != undefined) {
		params['sub_num'] = tempParam;
		tempParam = null
	}
	tempParam = req.param("type");
	if (tempParam != undefined) {
		params['type'] = tempParam;
		tempParam = null
	}
	tempParam = req.param("company_reg_date");
	if (tempParam != undefined) {
		params['company_reg_date'] = tempParam;
		tempParam = null
	}
	tempParam = req.param("tel_num");
	if (tempParam != undefined) {
		params['tel_num'] = tempParam;
		tempParam = null
	}
	tempParam = req.param("tel2_num");
	if (tempParam != undefined) {
		params['tel2_num'] = tempParam;
		tempParam = null
	}
	tempParam = req.param("fax_num");
	if (tempParam != undefined) {
		params['fax_num'] = tempParam;
		tempParam = null
	}
	tempParam = req.param("fax2_num");
	if (tempParam != undefined) {
		params['fax2_num'] = tempParam;
		tempParam = null
	}
	tempParam = req.param("post_address");
	if (tempParam != undefined) {
		params['post_address'] = tempParam;
		tempParam = null
	}
	tempParam = req.param("adress");
	if (tempParam != undefined) {
		params['adress'] = tempParam;
		tempParam = null
	}
	tempParam = req.param("work_location");
	if (tempParam != undefined) {
		params['work_location'] = tempParam;
		tempParam = null
	}
	if (params.company_name != undefined && params.company_name.trim() != "") {
		var data = require('../data.js');
		data.connect();
		data.insertQuery('insert into company_info set ?', params, function(err, id) {
			var result = {
				data : []
			};
			if (err) {
				console.log(err);
				result.err = err;
			} else {
				result.data = id;
			}
			res.send(result);
		});
	} else {
		var result = {
			data : [],
			err : "can't find company_name"
		};
		res.send(result);
	}

});

router.get('/company_info_list/delete', function(req, res, next) {
	var data = require('../data.js');
	var id = req.param("id");
	if (id != undefined && id.trim() != "") {
		data.connect();
		data.selectQuery("delete from company_info where seq_id = " + data.escape(id), function(err, change) {
			var result = {
				data : [],
				err : ""
			};
			if (err) {
				console.log(err);
				result.err = err;
			} else {
				result.data = change;
			}
			res.send(result);
		});
	} else {
		var result = {
			data : [],
			err : "파라미터가 없습니다."
		};
		res.send(result);
	}
});
router.get('/company_info_list/update', function(req, res, next) {
	var id = req.param("id");
	if (id != undefined && id.trim() != "") {
		var params = {};
		var tempParam = null;
		tempParam = req.param("ceo_name");
		if (tempParam != undefined) {
			params['ceo_name'] = tempParam;
			tempParam = null
		}
		tempParam = req.param("company_num");
		if (tempParam != undefined) {
			params['company_num'] = tempParam;
			tempParam = null
		}
		tempParam = req.param("company2_num");
		if (tempParam != undefined) {
			params['company2_num'] = tempParam;
			tempParam = null
		}
		tempParam = req.param("tour_num");
		if (tempParam != undefined) {
			params['tour_num'] = tempParam;
			tempParam = null
		}
		tempParam = req.param("sub_num");
		if (tempParam != undefined) {
			params['sub_num'] = tempParam;
			tempParam = null
		}
		tempParam = req.param("type");
		if (tempParam != undefined) {
			params['type'] = tempParam;
			tempParam = null
		}
		tempParam = req.param("company_reg_date");
		if (tempParam != undefined) {
			params['company_reg_date'] = tempParam;
			tempParam = null
		}
		tempParam = req.param("tel_num");
		if (tempParam != undefined) {
			params['tel_num'] = tempParam;
			tempParam = null
		}
		tempParam = req.param("tel2_num");
		if (tempParam != undefined) {
			params['tel2_num'] = tempParam;
			tempParam = null
		}
		tempParam = req.param("fax_num");
		if (tempParam != undefined) {
			params['fax_num'] = tempParam;
			tempParam = null
		}
		tempParam = req.param("fax2_num");
		if (tempParam != undefined) {
			params['fax2_num'] = tempParam;
			tempParam = null
		}
		tempParam = req.param("post_address");
		if (tempParam != undefined) {
			params['post_address'] = tempParam;
			tempParam = null
		}
		tempParam = req.param("adress");
		if (tempParam != undefined) {
			params['adress'] = tempParam;
			tempParam = null
		}
		tempParam = req.param("work_location");
		if (tempParam != undefined) {
			params['work_location'] = tempParam;
			tempParam = null
		}

		var data = require('../data.js');
		data.connect();
		data.updateQuery('update company_info set ? where seq_id = ?', [ params, id ], function(err, change) {
			var result = {
				data : []
			};
			if (err) {
				console.log(err);
				result.err = err;
			} else {
				result.data = change;
			}
			res.send(result);
		});
	} else {
		var result = {
			data : [],
			err : "파라미터가 없습니다."
		};
		res.send(result);
	}
});
module.exports = router;
