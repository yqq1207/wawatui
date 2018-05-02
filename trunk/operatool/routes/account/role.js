var express = require('express');
var router = express.Router();

var utils = require('../../common/utils.js');
var Response = require('../../common/Response.js');
var ErrorCode = require('../../common/errorCode.js').ErrCode;
var dbMgr = require('../../db/index.js').DBMgr();

dbMgr.init(['role']);

var roleDb = dbMgr.exec('role');

router.get('/getRoles', function(req, res, next) {

});

module.exports = router;