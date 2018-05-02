var async = require('async');

var Response = require('../../common/Response.js');
var logger = require('../../common/logger.js');
var ErrorCode = require('../../common/errorCode.js').ErrCode;
var reyun = require('../../common/reyun.js').GetInstance();
var utils = require('../../common/utils.js');
var date = require('../../common/date.js');
var config = require('../../config/config.js');
var MongoAPI = require('../../db/MongoAPI.js');

var dbMgr = require('../../db/index.js').DBMgr();

dbMgr.init(['player']);

var playerDb = dbMgr.exec('player');

/**
 * 获取所有玩家
 * @param start
 * @param limit
 * @param res
 */
function getAllPlayer(start, limit, res) {
    var retData = {};

    retData["rows"] = [];
    retData["results"] = 0;

    MongoAPI.playerCount(function(err, total) {
        if (err) {
            Response.respData(retData, res);
        } else {
            MongoAPI.getAllPlayer(start, limit, function(err, data) {
                if (!utils.isArray(data)) {
                    retData["rows"].push(data);
                } else {
                    retData["rows"] = data;
                }

                retData["results"] = total;
                Response.respData(retData, res);
            });
        }
    });
};

/**
 * 获取玩家信息byUserid
 * @param userId
 * @param res
 */
function getPlayerInfo(userId, res) {

    var retData = {};

    retData["rows"] = [];

    MongoAPI.getPlayerInfo(userId, function(err, data) {
        if (!utils.isArray(data)) {
            retData["rows"].push(data);
        } else {
            retData["rows"] = data;
        }

        Response.respData(retData, res);
    });
};

/**
 * 获取玩家信息by昵称
 * @param start
 * @param limit
 * @param nickName
 * @param res
 */
function getUserByNickName(start, limit, nickName, res) {
    var retData = {};

    retData["rows"] = [];
    retData["results"] = 0;

    MongoAPI.playerCountByNickName(nickName, function(err, total) {
        MongoAPI.getUserByNickName(start, limit, nickName, function (err, data) {
            if (!utils.isArray(data)) {
                retData["rows"].push(data);
            } else {
                retData["rows"] = data;
            }

            retData["results"] = total;
            Response.respData(retData, res);
        });
    });
}

/**
 * 获取增加记录
 * @param userId
 * @param start
 * @param limit
 * @param res
 */
function getAddGoldResult(userId, start, limit, res) {
    var retData = {};

    retData["rows"] = [];
    retData["results"] = 0;

    playerDb.getAddGoldResultTotal(userId, function(err, total) {
        if (err) {
            Response.respData(retData, res);
        } else {
            playerDb.getAddGoldResult(userId, start, limit, function(err, data) {
                retData["rows"] = data || [];
                retData["results"] = total;
                Response.respData(retData, res);
            });
        }
    });

}

/**
 * 增加金币
 * @param userId
 * @param gold
 * @param addGold
 * @param operUser
 * @param operDetail
 * @param res
 */
function addGold(userId, gold, addGold, operUser, operDetail, res) {
    if (utils.isNull(userId) || utils.isNull(addGold)) {
        Response.resp(ErrorCode.WRONGPARAMS.msg, res, ErrorCode.WRONGPARAMS.code);
        return ;
    }

    var data = {
        givegold: parseInt(addGold)
    };

    MongoAPI.incUserData(userId, data, function(err, retData) {
        var ret = {
            userId: userId,
            gold: parseInt(addGold) + parseInt(gold)
        };
        playerDb.addGoldResult(userId, addGold, operUser, operDetail, function(err, data){
            if (err) {
                console.log("增加金币记录失败: ", err);
            } else {
                reYunEconomy(userId, "活动赠送", 1, addGold);
                console.log("增加金币记录成功");
            }

        });
        Response.respData(ret, res);
    });
};

/**
 * 热云统计
 * @param userId
 * @param name
 * @param amount
 * @param rValue
 */
function reYunEconomy(userId, name, amount, rValue) {
    MongoAPI.getPlayerInfo(userId, function (err, data) {
        if (data) {
            var logParams = {};
            logParams.deviceId = data.deviceId;
            logParams.who = userId;
            logParams.itemname = name;
            logParams.itemamount = amount;
            logParams.itemtotalprice = rValue;
            logParams.channelid = config.reyun.channelid;
            logParams.serverid = config.reyun.serverid;

            reyun.economy(logParams, function (err, lData) {
               console.log("reyun.economy : ", name, lData);
            });
        }
    });
}

/**
 * 获取充值记录
 * @param startSec
 * @param endSec
 * @param start
 * @param limit
 * @param res
 */
function getChargeOrder(startSec, endSec, start, limit, res) {
    var retData = {};

    retData["rows"] = [];
    retData["results"] = 0;

    playerDb.getChargeOrderCount(startSec, endSec, function(err, total) {
        playerDb.getChargeOrder(startSec, endSec, start, limit, function(err, data) {
            if (err) {

            } else {
                if (utils.isArray(data)) {
                    retData["rows"] = data;
                } else {
                    retData["rows"].push(data);
                }
                retData["results"] = total;
                Response.respData(retData, res);
            }
        });
    });
};

function changeOrderByState(offset, limit, type, res) {
    var retData = {};

    retData["rows"] = [];
    retData["results"] = 0;

    playerDb.changerOrderByStateCount(offset, limit, type, function(err, total) {
        playerDb.changeOrderByState(offset, limit, type, function(err, data) {
            if (err) {
            } else {
                if (utils.isArray(data)) {
                    retData["rows"] = data;
                } else {
                    retData["rows"].push(data);
                }
                retData["results"] = total;
                Response.respData(retData, res);
            }
        });
    });
};

module.exports = {
    getAllPlayer: getAllPlayer,
    getPlayerInfo: getPlayerInfo,
    getUserByNickName: getUserByNickName,
    getAddGoldResult: getAddGoldResult,
    addGold: addGold,
    getChargeOrder: getChargeOrder,
    changeOrderByState: changeOrderByState
};