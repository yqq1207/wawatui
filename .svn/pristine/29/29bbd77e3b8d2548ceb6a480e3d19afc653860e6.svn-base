var mysql = require('mysql');
var config = require('../config/config.js');

var pool = mysql.createPool({
    connectionLimit: config.mysqlConf.mysql.connectionLimit,
    host: config.mysqlConf.mysql.host,
    user: config.mysqlConf.mysql.user,
    password: config.mysqlConf.mysql.password,
    database: config.mysqlConf.mysql.database,
    port: config.mysqlConf.mysql.port
});

function query(sql, inParams, callback) {
    pool.getConnection(function (err, conn) {
        if (err) {
            return callback(err);
        }

        conn.query(sql, inParams, function (err, res) {
            if (err) {
                callback(err);
            } else {
                callback(null, res);
            }
            conn.release();
        });
    });
}

function realQuery(sql, inParams, callback) {
    try {
        query(sql, inParams, callback);
    } catch (e) {
        console.log('sql:', e);
    }
}

exports.query = realQuery;
