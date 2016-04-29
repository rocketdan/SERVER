var express = require('express');
var app = require('../app.js');
var router = express.Router();
var nationQueries = {
	"post": "insert into nation_info set ?",
	"get": "select seq_id, nation_name, nation_code from nation_info",
	"put": "update nation_info set ? where seq_id = ?",
	"delete": "delete from nation_info where seq_id = ?"
};
var nationParams = {
	post: ["nation_name", "nation_code", "reg_date"],
	put: ["nation_name", "nation_code", "mod_date"]
}

function getParams(data, params) {
	var result = {};
	try {
		for(var name of params) {
			var tempParam = data[name];
			if(tempParam === undefined) continue;
			result[name] = tempParam;
		}
		return result;
	} catch(err) {
		app.logger.error(err);
		return {};
	}
};
router.post('/nations', function(req, res, next) {
	var params = getParams(req.body, nationParams.post);
	app.logger.info(nationQueries.post);
	params.reg_date = new Date();
	app.logger.info(params);
	app.db.query(nationQueries.post, params, function(err, rows) {
		if(err) {
			app.logger.error(err);
			res.status(500).send(err);
		} else {
			res.send(rows)
		}
	});
});
router.get('/nations', function(req, res, next) {
	app.logger.info(nationQueries.get);
	app.db.query(nationQueries.get, function(err, rows) {
		if(err) {
			app.logger.error(err);
			res.status(500).send(err);
		} else {
			res.send(rows)
		}
	});
});
router.put('/nations', function(req, res, next) {
	console.log(req.body);
	var params = {};
	params = getParams(req.body, nationParams.put);
	var id = req.body.id;
	params.mod_date = new Date();
	app.logger.info(nationQueries.put);
	app.logger.info(params);
	app.db.query(nationQueries.put, [params, id], function(err, rows) {
		if(err) {
			app.logger.error(err);
			res.status(500).send(err);
		} else {
			res.send(rows)
		}
	});
});
router.delete('/nations', function(req, res, next) {
	var params = req.body.id;
	app.logger.info(nationQueries.delete);
	app.logger.info(params);
	app.db.query(nationQueries.delete, params, function(err, rows) {
		if(err) {
			app.logger.error(err);
			res.status(500).send(err);
		} else {
			res.send(rows)
		}
	});
});
module.exports = router;
