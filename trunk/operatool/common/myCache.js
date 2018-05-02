var fs = require('fs');
var cache = require('redis');
var util = require('util');
var config = require('../config/config.js');

var logger = require('./logger');

var _cacheConnection = null;

exports.getClient = function () {
    if (!_cacheConnection) {
        var host = '127.0.0.1';
        var port = 6379;
        var password = "";

        try {
            host = config.redisConf.host;
            port = config.redisConf.port;
            password = config.redisConf.password;
        } catch (e) {
            logger.error("parse cache config error:", e);
            return;
        }

        _cacheConnection = cache.createClient(port, host);
        _cacheConnection.auth(password, function (err) {
            logger.debug('cache client on auth:', util.inspect(err), password, err);
        });
        _cacheConnection.on('error', function (err) {
            logger.error('cache client on error:', util.inspect(err));
            _cacheConnection.end();
            _cacheConnection = null;
        });
    }

    return _cacheConnection;
};
