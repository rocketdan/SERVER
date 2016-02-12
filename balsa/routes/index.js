var express = require('express');
var uuid = require('uuid');
var fs = require('fs');
var data = require('../data.js');
var router = express.Router();
router.get('/', function(req, res, next) {
	res.render('index.html', {
		title : 'Express'
	});
});
router.get('/company_info_list', function(req, res, next) {

	var id = req.param("id");
	var sql = 'select * from company_info';
	console.log(id);
	if (id != undefined && id != "") {
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
router.post('/company_info_list/insert', function(req, res, next) {
	var params = {};
	var tempParam = null;
	var paramNames = [ "company_name", "sub_id", "ceo_name", "company_num", "company2_num", "tour_num", "sub_num", "type", "company_reg_date", "tel_num", "tel2_num", "fax_num", "fax2_num", "post_address", "address", "work_location" ];

	for (var i = 0, nPlen = paramNames.length; i < nPlen; i++) {
		tempParam = req.param(paramNames[i]);
		if(tempParam === undefined) continue;
		params[paramNames[i]] = tempParam;
	};

	if (params.company_name != undefined && params.company_name.trim() != "") {
		params['mod_date'] = params['reg_date'] = new Date();
		data.insertQuery('insert into company_info set ?', params, function(err, id) {
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
			error : "can't find company_name"
		};
		res.send(result);
	}

});

router.post('/company_info_list/delete', function(req, res, next) {
	var id = req.param("id");
	if (id != undefined && id.trim() != "") {
		data.deleteQuery("delete from company_info where seq_id = " + data.escape(id), function(err, change) {
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
router.post('/company_info_list/update', function(req, res, next) {
	var id = req.param("id");
	if (id != undefined && id.trim() != "") {
		var params = {};
		var tempParam = null;
		var paramNames = [ "company_name", "sub_id", "ceo_name", "company_num", "company2_num", "tour_num", "sub_num", "type", "company_reg_date", "tel_num", "tel2_num", "fax_num", "fax2_num", "post_address", "address", "work_location" ];
		for (name in paramNames) {
			tempParam = req.param(name);
			if (tempParam !== undefined) {
				params[name] = tempParam;
				tempParam = null
			}
		}
		params['mod_date'] = new Date();
		data.updateQuery('update company_info set ? where seq_id = ?', [ params, id ], function(err, change) {
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

var async = require('async');
var fstools = require('fs-tools');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var formidable = require('formidable');

router.post('/upload', function(req, res) {
	var baseImageDir = __dirname + '/../public/uploadImage/';
	// 안드로이드앱과 같은 모바일 애플리케이션에서의 요청의 인코딩 방식을 확인하기 위해 아래와 같이 검사구문 추가
	if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
		// 모바일 업로드 요청
	} else {// multipart/form-data
		// 일반 웹페이지 업로드 요청
	}

	var form = new formidable.IncomingForm();
	form.uploadDir = path.normalize(__dirname + "/../uploads"); // 업로드 디렉토리
	form.keepExtensions = true; // 파일 확장자 유지
	form.multiples = true; // multiple upload
	form.parse(req, function(err, fields, files) {
		var category = null;

		category = fields.category

		// console.log(fields);
		// console.log(files.uploaddata);
		// 이 미들웨어는 멀티파트 요청을 파싱하기 위해 form.parse를 사용하는데
		// form.parse의 콜백함수의 매개변수(fields, files)로 폼의 필드 정보들과 파일 정보들이 전달된다.

		// 여러개의 파일을 업로드하는 경우
		if (files.uploaddata instanceof Array) {
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
					if (err) {
						cb(err);
					} else {
						var tempData = {
							file_uuid : uuidName,
							file_category : category,
							file_name : file.name
						};
						data.push(tempData);
						cb();
					}
				})
			}, function(err) {
				// 최종 처리 콜백 함
				if (err) {
					err.status(500);
					next(err);
				} // 에러가 아니면 성공여부 전달
				else {
					res.status(200);
					res.json({
						error : null,
						data : data
					});
				}
			});
		}
		// 파일을 선택하지 않았을때
		else {
			if (!files.uploaddata.name) {

				// 파일 선택하지 않았을 경우 업로드 과정에서 생긴 크기가 0인 파일을 삭제한다.
				fstools.remove(files.uploaddata.path, function(err) {
					if (err) {
						err.status(500);
						next(err);
					} else {
						res.status(200);
						res.json({
							error : null,
							data : 'Upload successful'
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
					if (err) {
						err.status(500);
						next(err);
					} else {
						var data = {
							file_uuid : uuidName,
							file_category : category,
							file_name : files.uploaddata.name
						};
						res.status(200);
						res.json({
							error : null,
							data : [ data ]
						});
					}
				});
			}
		}
	});
	form.on('progress', function(receivedBytes, expectedBytes) {
		console.log(((receivedBytes / expectedBytes) * 100).toFixed(1) + '% received');
	});
});
module.exports = router;