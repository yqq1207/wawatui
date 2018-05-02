var express = require('express');
var router = express.Router();

var async = require('async');

var Response = require('../../common/Response.js');
var ErrorCode = require('../../common/errorCode.js').ErrCode;
var modelMsg = require('../../common/sendTempPlateMessage.js');
var logger = require('../../common/logger.js');
var utils = require('../../common/utils.js');
var consts = require('../../common/consts.js');
var tempMsg = require('../../common/sendTempPlateMessage.js');
var tencentMsg = require('../../common/sendTenxunMessage.js');
var mongoApi = require('../../db/MongoAPI.js');
var DateUtil = require('../../common/date.js');

var suc = 0;
var fail = 0;

var dbMgr = require('../../db/index.js').DBMgr();

dbMgr.init(['order']);

var orderDB = dbMgr.exec('order');

router.post('/sendMsg', function(req, res, next) {
    var type = req.body.type;

    logger.debug("sendMsg: ", type);

    if (type == 1) {
        sendToAllMessage();
    };

    Response.resp(ErrorCode.SUCCESS.msg, res, ErrorCode.SUCCESS.code);
});

router.get('/getAllTemplateMsg', async function(req, res, next) {
    var retData = {};
    retData["rows"] = [];
    retData["results"] = 0;

    var allMsg = await modelMsg.getAllPrivateTemplate();

    if (allMsg) {
        retData["rows"] = allMsg.template_list;
        retData["results"] = allMsg.template_list.length;
    }

    Response.respData(retData, res);
});

router.get('/getSendTempRet', function(req, res, next) {
    var retData = {};

    retData["rows"] = [];
    retData["results"] = 0;

    Response.respData(retData, res);
});

router.get('/getTempData', function(req, res) {
    var temp = req.query.temp;

    if (utils.isNull(temp)) {
        Response.resp(ErrorCode.WRONGPARAMS.msg, res, ErrorCode.WRONGPARAMS.code);
        return;
    }

    var tempJson = utils.readJSONSync('data/template.json');
    var json = tempJson["newPet"];
    var ret = {};

    if (!utils.isNull(json)) {
        var data = json.data;
        var dateKey = null;

        for(var id in data) {
            if (data[id].value.indexOf("ODATE") != -1) {
                dateKey = id;
            }
        }
        ret = json.annotation;

        delete(ret[dateKey]);
    }

    Response.respData(ret, res);
});

router.post('/sendTemp', function(req, res) {
    var tempData = req.body;

    if (!tempData) {
        Response.resp(ErrorCode.WRONGPARAMS.msg, res, ErrorCode.WRONGPARAMS.code);
        return;
    }

    var tempType = tempData.tempType;

    logger.debug("tempType: ", tempType);

    var stream = mongoApi.findUserStream({openid:{$ne:null},lastOa:{$ne:null}}, {openid: 1, lastOa: 1});
    //var stream = mongoApi.findUserStream({unionId: "oBJF40gkCBuWn_u4Eo5qqme1kItA"}, {openid: 1, lastOa: 1});
    var cache = [];
    var count = 0;
    var nullCount = 0;

    //流处理
    stream.on('data', function(item) {
        if (item.openid && item.lastOa) {
            cache.push(item);
            count++;
            if (cache.length == 1) {
                stream.pause();
                process.nextTick(function() {
                    sendTempMsg(cache, tempData, function() {
                        cache = [];
                        stream.resume();
                    });
                });
            }
        } else {
            nullCount++;
            logger.debug("null openid or null lastoa: ", item);
        }
    });

    stream.on('end', function(){
        logger.debug("findUser count, nullCount: ", count, nullCount);
        logger.debug("query end");
    });

    stream.on('close', function() {
        logger.debug("query close");
    });

    //分页处理
    /*mongoApi.findUserCount(function(err, count) {
        if (err) {
            Response.resp(err, res, ErrorCode.WRONGPARAMS.code);
        } else {
            var limit = 100;
            var page = Math.ceil(count / limit);
            var point = 0;
            var condition = function() {
                return point < page;
            };

            var fn = function(callback) {
                var skip = point * limit;
                var step = 0;

                skip = (skip >= count) ? count : skip;

                mongoApi.findOpenId(skip, limit, function(err, data) {
                    if (data && data.length > 0) {
                        for (var i = 0; i < data.length; i++) {
                            var oa = data[i].lastOa || consts.initMsg;

                            if (!oa) {
                                continue;
                            }

                            var msgData = getNewPetJson(data[i].openid, consts.templateMsg[oa][tempType], tempData);
                            tempMsg.sendTemplateMessage(oa, msgData);
                            step++;
                        }
                    }
                    if (step == data.length) {
                        point++;
                        callback(null);
                    }
                });
            };

            async.whilst(condition, fn, function(err) {
                if (err) {
                    logger.debug("sendTemp err: ", err);
                }
            })
        }
    });*/

    Response.resp(ErrorCode.SUCCESS.msg, res, ErrorCode.SUCCESS.code);
});

function sendTempMsg(data, tempData, cb) {
    var tempType = tempData.tempType;

    for (var i = 0; i < data.length; i++) {

       // var oa = data[i].lastOa || consts.initMsg;
        var oa = consts.initMsg;    //前面的公众号被封，全部定向到新公从号

        if (!oa) {
            continue;
        }

        var msgData = getNewPetJson(data[i].openid, consts.templateMsg[oa][tempType], tempData);
        var ret = tempMsg.sendTemplateMessage(oa, msgData);

        if (ret.errcode == 0) {
            suc++;
        } else {
            fail++;
        }
        logger.debug("suc, fail: ", suc, fail);
    }

    process.nextTick(function(){
        cb();
    });
}

function getNewPetJson(openId, modelId, tempData) {

    var model = utils.readJSONSync('data/template.json');
    var curModel = model["newPet"];
    var nowDate = Math.ceil(Date.now() / 1000);

    DateUtil.setExtraTimeStampSec(nowDate);
    var time = DateUtil.Format("yyyy-MM-dd HH:mm:ss");
    var data = curModel.data;

    for (var id in data) {
        for (var tid in tempData) {
            if (id == tid) {
                data[id].value = tempData[tid];
            }
        }
    }
    delete(curModel["annotation"]);

    var str = JSON.stringify(curModel);

    str = str.replace(/\$\{TOUSER\}/g, openId);
    str = str.replace(/\$\{TEMPID\}/g, modelId);
    str = str.replace(/\$\{URL\}/g, consts.msgUrl + "&oa=" + consts.initMsg);
    str = str.replace(/\$\{ODATE\}/g, time);

    return JSON.parse(str);
};


/**
 * 短信召回
 */
function sendToAllMessage() {
    var userList = [];
    async.waterfall([
            function (callback) {
                orderDB.findAllUserGroupPhone(function(err, data) {
                    if (err) {
                        logger.error("findAllUserGroupPhone err: ", err);
                    }
                    if (data) {
                        userList = data;
                    }
                    callback(null);
                });
            },
            function (callback) {
                async.eachSeries(userList, function(obj, cb) {
                    var params = [obj.userName, consts.zhaoHuiOldPublic, consts.zhaoHuiNewPublic];

                    tencentMsg.sendShortMessage(obj.userCellPhone, consts.zhaoHuiTextId, params, consts.orderTextSign, function (err) {
                        cb(err);
                    });
                }, function(err){
                    callback(err);
                });
            }
        ], function(err) {
            logger.debug("sendMessage finish:", err);
        }
    );
}

module.exports = router;
