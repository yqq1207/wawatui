var express = require('express');
var router = express.Router();

var utils = require('../../common/utils.js');
var Response = require('../../common/Response.js');
var ErrorCode = require('../../common/errorCode.js').ErrCode;
var dbMgr = require('../../db/index.js').DBMgr();
var consts = require('../../common/consts.js');
var logger = require('../../common/logger.js');

dbMgr.init(['branch']);

var branchDb = dbMgr.exec('branch');

/**
 * 登陆
 */
router.post('/addBranch', function (req, res, next) {
    var branchId = req.body.branchId;
    var branchName = req.body.branchName;

    branchDb.checkInode(branchId, function(err, data) {
        if (data && data.length > 0) {
            Response.resp(ErrorCode.SIGNFAIL.msg, res, ErrorCode.SIGNFAIL.code);
        } else {
            branchDb.insertBranch(branchId, branchName, function(err, data) {
                Response.resp(ErrorCode.SUCCESS.msg, res, ErrorCode.SUCCESS.code);
            });
        }
    });
});

module.exports = router;