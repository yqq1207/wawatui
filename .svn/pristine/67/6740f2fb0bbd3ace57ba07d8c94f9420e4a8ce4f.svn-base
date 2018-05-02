var express = require('express');
var router = express.Router();
var MysqlAPI = require('../../db/MysqlAPI.js');
var Response = require('../../common/Response.js');
var logger = require('../../common/logger.js');
var utils = require('../../common/utils.js');

router.get('/getAllMoney', function(req, res, next) {
    var time = req.query.time;
    var type = req.query.type;

    if (!time) {
        time = Math.floor(Date.now() / 1000);
    }
    if (!type) {
        type = 2;
    }
    MysqlAPI.getAllMoney(time, type, function(err, data) {
        if (data && utils.isArray(data)) {
            Response.respData(data[0], res);
        } else {
            Response.respData(0, res);
        }

    });
});

module.exports = router;