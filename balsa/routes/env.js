var express = require('express');
var app = require('../app.js');
var router = express.Router();
var data = require('../data.js');
var nationQueries = {
	"post": "insert into nation_info set ?",
	"get": "select seq_id, nation_name, nation_code from nation_info",
	"put": "update nation_info set ? where seq_id = ?",
	"delete": "delete from nation_info where seq_id = ?"
};
var nationParams = {
	"post": ["nation_name", "nation_code", "reg_date"],
	"put": ["nation_name", "nation_code", "mod_date"]
}
var regionQueries = {
	"post": "insert region_info set ?",
	"put": "update region_info set ? where seq_id = ?",
	"delete": "delete from region_info where seq_id = ?"
}
var regionParams = {
	"post": ["nation_id", "region_code", "region_name", "land_erp_use", "land_report_use", "tour_erp_use", "tour_report_use", "reg_date"],
	"put": ["region_name", "land_erp_use", "land_report_use", "tour_erp_use", "tour_report_use", "mod_date"]
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
router.all('/nation', function(req, res, next) {
	var params = [];
	var query = "";
	switch(req.method) {
		case "GET":
			query = nationQueries.get + " where seq_id  = ?";
			params.push(req.query.id);
			break;
		case "POST":
			params.push(getParams(req.body, nationParams.post));
			params[0].reg_date = new Date();
			query = nationQueries.post;
			break;
		case "PULL":
			params.push(getParams(req.body, nationParams.put));
			params[0].mod_date = new Date();
			query = nationQueries.pull;
			params.push(req.body.id);
			break;
		case "DELETE":
			query = nationQueries.delete;
			params.push(req.body.id);
			break;
	}
	if(query != "") {
		app.db.query(query, params, function(err, rows) {
			app.logger.info(this.sql);
			app.logger.info(this.values);
			if(err) {
				app.logger.error(err);
				res.status(500).send(err);
			} else {
				res.send(rows)
			}
		});
	} else {
		next();
	}
});
router.all('/region', function(req, res, next) {
	var params = [];
	var query = "";
	switch(req.method) {
		case "POST":
			params.push(getParams(req.body, regionParams.post));
			params[0].reg_date = new Date();
			query = regionQueries.post;
			break;
		case "PULL":
			params.push(getParams(req.body, regionParams.put));
			params[0].mod_date = new Date();
			query = regionQueries.pull;
			params.push(req.body.id);
			break;
		case "DELETE":
			query = regionQueries.delete;
			params.push(req.body.id);
			break;
	}
	if(query != "") {
		app.db.query(query, params, function(err, rows) {
			app.logger.info(this.sql);
			app.logger.info(this.values);
			if(err) {
				app.logger.error(err);
				res.status(500).send(err);
			} else {
				res.send(rows)
			}
		});
	} else {
		next();
	}
});
router.all('/nations/regions', function(req, res, next) {
	if(req.method == 'GET') {
		app.db.query(nationQueries.get, function(err, rows) {
			try {
				if(err) {
					throw err;
				} else {
					var nations = {};
					if(rows.length > 0) {
						for(var nation of rows) {
							var id = nation.seq_id;
							delete(nation.seq_id);
							nation.region = [];
							nations[id] = nation;
						}
						app.db.query(regionQueries.get, function(err, rows) {
							try {
								if(err) {
									throw err;
								} else {
									for(var region of rows) {
										var id = region.nation_id;
										if(nations[id] != undefined) {
											delete(region.nation_id);
											nations[id]['region'].push(region);
										}
									}
									res.send(nations);
								}
							} catch(e) {
								app.logger.error(e);
								res.status(500).send(e);
							}
						});
					} else {
						res.send({});
					}
				}
			} catch(e) {
				app.logger.error(e);
				res.status(500).send(e);
			}
		});
	} else {
		res.status(500).send();
	}
});
module.exports = router;
