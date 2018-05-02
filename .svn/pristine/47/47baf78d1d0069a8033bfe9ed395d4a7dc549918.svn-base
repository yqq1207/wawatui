var express = require('express');
var router = express.Router();

var Response = require('../../common/Response.js');
var ErrorCode = require('../../common/errorCode.js').ErrCode;
var logic = require('./logic.js');

router.get('/getAllPlayer', function (req, res, next) {
    var start = req.query.start;
    var limit = req.query.limit;
    var pageIndex = req.query.pageIndex;
    var startDate = req.query.startDate;
    var endDate = req.query.endDate;
    var userId = req.query.userId;
    var nickName =req.query.nickname;

    if (!start || !limit) {
        Response.resp(ErrorCode.WRONGPARAMS.msg, res, ErrorCode.WRONGPARAMS.code);
        return;
    }

    if (userId) {
        logic.getPlayerInfo(userId, res);
        return;
    }

    if (nickName) {
        logic.getUserByNickName(start, limit, nickName, res);
        return ;
    }

    logic.getAllPlayer(start, limit, res);
});

router.get('/getPlayer', function (req, res, next) {
    var userId = req.query.userId;

    if (!userId) {
        Response.resp(ErrorCode.WRONGPARAMS.msg, res, ErrorCode.WRONGPARAMS.code);
        return;
    }

    logic.getPlayerInfo(userId, res);
});

router.post('/addGold', function(req, res, next) {
    var userId = req.body.userId;
    var addGold = req.body.addGold;
    var gold = req.body.gold;
    var operUser = req.body.operUser;
    var operDetail = req.body.operDetail;

    logic.addGold(userId, gold, addGold, operUser, operDetail, res);
});

router.get('/getAddGoldResult', function (req, res, next) {
    var userId = req.query.userId;
    var start = req.query.start;
    var limit = req.query.limit;

    logic.getAddGoldResult(userId, start, limit, res);
});

router.get('/getChargeOrder', function(req, res, next) {
    var start = req.query.start;
    var limit = req.query.limit;
    var startDate = req.query.startDate;
    var endDate = req.query.endDate;

    var startSec = 0;
    var endSec = 0;

    startDate = new Date(startDate);
    startDate.setHours(0);
    startDate.setMinutes(0);
    startDate.setSeconds(0);

    endDate = new Date(endDate);
    endDate.setHours(0);
    endDate.setMinutes(0);
    endDate.setSeconds(0);

    startSec = Math.floor(startDate.getTime() / 1000);
    endSec = Math.floor(endDate.getTime() / 1000);


    logic.getChargeOrder(startSec, endSec, start, limit, res);
});

router.get('/changerOrderByState', function(req, res, next) {
    var type = req.query.type;
    var start = req.query.start;
    var limit = req.query.limit;

    logic.changeOrderByState(start, limit, type, res);
});
module.exports = router;