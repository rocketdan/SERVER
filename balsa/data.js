var mysql = require('mysql');
var db_config = {
	host: "rocketdan.duckdns.org",
	port: 3306,
	user: "rocketdan",
	password: "rocketdan!@#",
	database: 'rocket',
	// db : "rocket",
};
var connection;

function handleDisconnect() {
	var aws = process.env.aws;
	if(aws != undefined && aws != "") {
		db_config.host = "localhost";
	}
	connection = mysql.createConnection(db_config);
	connection.connect(function(err) {
		if(err) {
			console.log('error when connecting to db:', err);
			handleDisconnect();
		}
		exports.dbconn = connection;
		console.log("sucsess connected");
	});
	connection.on('error', function(err) {
		if(err.code === 'PROTOCOL_CONNECTION_LOST') {
			handleDisconnect();
		} else {
			console.log('db error', err);
			throw err;
		}
	});
}
handleDisconnect();
exports.dbconn = connection;
exports.query = function(query, params, callback) {
		var sql = connection.query(query, params, function(err, rows) {
			if(typeof(callback) === "function") {
				callback(err, rows);
			}
		});
	}
	// select query 실행함수.
	// 콜백변수 err, 검색 결과.
exports.selectQuery = function(query, callback) {
	var sql = connection.query(query, function(err, rows) {
		// console.log(rows);
		if(typeof(callback) === "function") {
			callback(err, rows, sql.sql);
		}
	});
};
// insert query 실행함수.
// 콜백변수 err, 추가된 아이디.
exports.insertQuery = function(query, value, callback) {
	var sql = connection.query(query, value, function(err, result) {
		var id = 0;
		if(!err && result.insertId != undefined) {
			id = result.insertId;
		}
		if(typeof(callback) === "function") {
			// if(result.)
			callback(err, id, sql.sql);
		}
	});
};
// update query 실행함수.
// 콜백변수 err, 변경행수.
exports.updateQuery = function(query, value, callback) {
	var sql = connection.query(query, value, function(err, result) {
		console.log(result);
		var change = 0;
		if(!err && result.changedRows != undefined) {
			change = result.changedRows;
		}
		if(typeof(callback) === "function") {
			callback(err, change, sql.sql);
		}
	});
};
// delete query 실행함수.
// 콜백변수 err, 삭제행수.
exports.deleteQuery = function(query, value, callback) {
	var sql = connection.query(query, value, function(err, result) {
		console.log(result);
		var change = 0;
		if(!err && result.affectedRows !== undefined) {
			change = result.affectedRows;
		}
		if(typeof(callback) === "function") {
			callback(err, change, sql.sql);
		}
	});
};
exports.escape = function(data) {
	return connection.escape(data);
};
