var express = require('express');
var uuid = require('uuid');
var fs = require('fs');
var data = require('../data.js');
var app = require('../app.js');
var dbconn = data.dbconn;
var router = express.Router();
router.get('/', function(req, res, next) {
	res.redirect('/pages/companyInput.html')
});
var queryList = {
	"company_info_list": "select * from company_info",
	"company_info_list_count": "select count(*) as count from company_info",
	"company_info_insert": "insert into company_info set ?",
	"company_account_insert": "insert into company_account set ?",
	"company_info_delete": "delete from company_info where seq_id = ?",
	"company_info_update": "update company_info set ? where seq_id = ?",
	"company_account_delete": "delete from company_account where company_id = ?"
}
var paramList = {
	"company_info": ["company_name", "sub_id", "ceo_name", "company_num", "company2_num", "tour_num", "sub_num", "type", "company_reg_date", "tel_num", "tel2_num", "fax_num", "fax2_num", "post_address", "address", "work_location"],
	"company_account": ["company_id", "bank_name", "account_num", "account_auth", "note"]
}
router.get('/company_info_list', function(req, res, next) {
	var id = req.query.id;
	var page = req.query.page;
	var count = req.query.count;
	var sql = queryList.company_info_list;
	if(id != undefined && id != "") {
		sql = sql + " where seq_id = " + data.escape(id);
	} else if(page != undefined && page != "") {
		var viewNum = req.body["viewNum"];
		viewNum = Number(viewNum);
		page = Number(page);
		if(!isNaN(page) && page != 0) {
			if(isNaN(viewNum) || viewNum == 0) {
				viewNum = 10;
			}
			var start = (page - 1) * viewNum;
			sql = sql + " limit " + start + "," + viewNum;
		}
	} else if(count != undefined && count == "true") {
		sql = queryList.company_info_list_count;
	}
	data.selectQuery(sql, function(err, rows, query) {
		app.logger.info(query);
		var result = {
			data: [],
			error: null,
		};
		if(err) {
			app.logger.error(err);
			result.error = err;
		} else {
			result.data = rows;
		}
		res.send(result);
	});
});

function rollback(err, res, dbconn) {
	app.logger.error(err);
	dbconn.rollback(function() {
		var result = {
			data: [],
			error: err,
		};
		res.send(result);
	});
}

function getAccountParams(data) {
	// 계좌정보 파라미터 만드는 루틴.
	var datas = [];
	if(data !== undefined) {
		var tempAccountData = [];
		try {
			tempAccountData = JSON.parse(data);
			for(var i = 0; i < tempAccountData.length; i++) {
				var tempParams = {};
				for(var name of paramList.company_account) {
					tempParams[name] = tempAccountData[i][name];
					if(tempParams[name] === undefined) continue;
				}
				if(Object.keys(tempParams).length > 0) {
					datas.push(tempParams);
				}
			}
		} catch(err) {
			app.logger.info(err);
			tempAccountData = [];
		}
	}
	return datas;
}

function getCompanyParams(data) {
	var params = {};
	for(var name of paramList.company_info) {
		var tempParam = data[name];
		if(tempParam === undefined) continue;
		params[name] = tempParam;
	}
	return params;
}
// 키값중복 될때 루틴 추가 필요.
router.post('/company_info_list/insert', function(req, res, next) {
	var result = {
		data: [],
		error: null,
	};
	var params = {};
	var accountData = [];
	accountData = getAccountParams(req.body.accounts);
	// 컴페니인페니 파라미터 만드는 루틴.
	params = getCompanyParams(req.body);
	if(params.company_name != undefined && params.company_name.trim() != "") {
		params['mod_date'] = params['reg_date'] = new Date();
		// 트렌젝션 시작부분.
		dbconn.beginTransaction(function(err) {
			if(err) { // if err
				app.logger.error(err);
				result.error = err
				res.send(result);
			} else {
				// 회사정보 입력
				dbconn.query(queryList.company_info_insert, params, function(err, dbresult) {
					if(err) {
						app.logger.error(err);
						rollback(err, res, dbconn);
					} else {
						// 회사정보 입력성공하면 seq_id 받아옴.
						var insertId = dbresult.insertId;
						async.each(accountData, function(account, cb) {
							account.company_id = insertId;
							// 계좌정보 저장.
							dbconn.query(queryList.company_account_insert, account, function(err, dbresult) {
								cb(err)
							});
						}, function(err) {
							// 계좌정보 입력 시 실패하면 아래 루틴, 성공하면 커밋하고 끝.
							if(err) {
								app.logger.error(err);
								rollback(err, res, dbconn);
							} else {
								dbconn.commit(function(err) {
									if(err) {
										app.logger.error(err);
										rollback(err, dbconn);
									} // if err
									else {
										result.data = insertId;
										res.send(result);
									}
								}); // commit
							}
						});
					}
				});
			}
		});
	} else {
		result.error = "can't find company_name"
		app.logger.error(result);
		res.send(result);
	}
});
router.post('/company_info_list/delete', function(req, res, next) {
	var id = req.body["id"];
	if(id != undefined && id.trim() != "") {
		data.deleteQuery(queryList.company_info_delete, id, function(err, change) {
			var result = {
				data: [],
				error: null,
			};
			if(err) {
				app.logger.error(err);
				result.error = err;
			} else {
				result.data = change;
			}
			res.send(result);
		});
	} else {
		var result = {
			data: [],
			error: "파라미터가 없습니다."
		};
		app.logger.error(result);
		res.send(result);
	}
});
// seq_id없을시 에러 처리 필요.
router.post('/company_info_list/update', function(req, res, next) {
	var id = req.body["id"];
	var result = {
		data: [],
		error: ""
	};
	if(id != undefined && id.trim() != "") {
		var params = {};
		var accountData = [];
		accountData = getAccountParams(req.body.accounts);
		// 컴페니인페니 파라미터 만드는 루틴.
		params = getCompanyParams(req.body);
		params['mod_date'] = new Date();
		dbconn.beginTransaction(function(err) {
			if(err) { // if err
				app.logger.error(err);
				result.error = err
				res.send(result);
			} else {
				var sql = dbconn.query(queryList.company_info_update, [params, id], function(err, dbresult) {
					if(err) {
						app.logger.error(err);
						rollback(err, res, dbconn);
					} else {
						var sql = dbconn.query(queryList.company_account_delete, id, function(err) {
							if(err) {
								app.logger.error(err);
								rollback(err, res, dbconn);
							} else {
								async.each(accountData, function(account, cb) {
									account.company_id = id;
									var sql = dbconn.query(queryList.company_account_insert, account, function(err, dbresult) {
										cb(err)
									});
									app.logger.info(sql.sql);
								}, function(err) {
									if(err) {
										app.logger.error(err);
										rollback(err, res, dbconn);
									} else {
										dbconn.commit(function(err) {
											if(err) {
												app.logger.error(err);
												rollback(err, dbconn);
											} // if err
											else {
												result.data = id;
												res.send(result);
											}
										}); // commit
									}
								});
							}
						});
						app.logger.info(sql.sql);
					}
				});
				app.logger.info(sql.sql);
			}
		});
	} else {
		result.error = "파라미터가 없습니다.";
		app.logger.error(result);
		res.send(result);
	}
});
var async = require('async');
var fstools = require('fs-tools');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var formidable = require('formidable');
router.post('/upload', function(req, res) {
	var baseImageDir = __dirname + '/../public/uploadImage/';
	// 안드로이드앱과 같은 모바일 애플리케이션에서의 요청의 인코딩 방식을 확인하기 위해 아래와 같이 검사구문 추가
	if(req.headers['content-type'] === 'application/x-www-form-urlencoded') {
		// 모바일 업로드 요청
	} else { // multipart/form-data
		// 일반 웹페이지 업로드 요청
	}
	var form = new formidable.IncomingForm();
	form.uploadDir = path.normalize(__dirname + "/../uploads"); // 업로드 디렉토리
	form.keepExtensions = true; // 파일 확장자 유지
	form.multiples = true; // multiple upload
	form.parse(req, function(err, fields, files) {
		var category = null;
		category = fields.category
			// 이 미들웨어는 멀티파트 요청을 파싱하기 위해 form.parse를 사용하는데
			// form.parse의 콜백함수의 매개변수(fields, files)로 폼의 필드 정보들과 파일 정보들이 전달된다.
			// 여러개의 파일을 업로드하는 경우
		if(files.uploaddata instanceof Array) {
			var data = [];
			// async.each를 사용해 files.uploaddata배열 객체의 각각의 파일을 /images 디렉토리로 옮긴다.
			async.each(files.uploaddata, function(file, cb) {
				// 파일명만 추출후 업로드되는 파일명으로 선택하여 이미지가 저장될 경로를 더해준다.
				var uuidName = uuid.v4();
				var fileExtensions = file.name.match(/\.[^.]*$/);
				fileExtensions = fileExtensions != null ? fileExtensions[0] : "";
				uuidName += fileExtensions;
				var destPath = path.normalize(baseImageDir + path.basename(uuidName));
				// 해당 파일명을 서버로 전송처
				fstools.move(file.path, destPath, function(err) {
					if(err) {
						cb(err);
					} else {
						var tempData = {
							file_uuid: uuidName,
							file_category: category,
							file_name: file.name
						};
						data.push(tempData);
						cb();
					}
				})
			}, function(err) {
				// 최종 처리 콜백 함
				if(err) {
					app.logger.error(err);
					err.status(500);
					next(err);
				} // 에러가 아니면 성공여부 전달
				else {
					res.status(200);
					res.json({
						error: null,
						data: data
					});
				}
			});
		}
		// 파일을 선택하지 않았을때
		else {
			if(!files.uploaddata.name) {
				// 파일 선택하지 않았을 경우 업로드 과정에서 생긴 크기가 0인 파일을 삭제한다.
				fstools.remove(files.uploaddata.path, function(err) {
					if(err) {
						app.logger.error(err);
						err.status(500);
						next(err);
					} else {
						res.status(200);
						res.json({
							error: null,
							data: 'Upload successful'
						});
					}
				})
			}
			// 파일을 하나만 선택했을때
			else {
				// 업로드된 파일을(files.uploaddata) /images디렉토리로 옮긴다.
				// 업로드 되는 파일명을 추출해서 이미지가 저장될 경로를 더해준다.
				var uuidName = uuid.v4();
				var fileExtensions = files.uploaddata.name.match(/\.[^.]*$/);
				fileExtensions = fileExtensions != null ? fileExtensions[0] : "";
				uuidName += fileExtensions;
				var destPath = path.normalize(baseImageDir + path.basename(uuidName));
				// 임시 폴더에 저장된 이미지 파일을 이미지 경로로 이동시킨다.
				fstools.move(files.uploaddata.path, destPath, function(err) {
					if(err) {
						app.logger.error(err);
						err.status(500);
						next(err);
					} else {
						var data = {
							file_uuid: uuidName,
							file_category: category,
							file_name: files.uploaddata.name
						};
						res.status(200);
						res.json({
							error: null,
							data: [data]
						});
					}
				});
			}
		}
	});
	form.on('progress', function(receivedBytes, expectedBytes) {
		app.logger.info(((receivedBytes / expectedBytes) * 100).toFixed(1) + '% received');
	});
});
module.exports = router;
