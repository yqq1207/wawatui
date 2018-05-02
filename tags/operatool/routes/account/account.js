var express = require('express');
var router = express.Router();

var utils = require('../../common/utils.js');
var Response = require('../../common/Response.js');
var ErrorCode = require('../../common/errorCode.js').ErrCode;
var dbMgr = require('../../db/index.js').DBMgr();
var consts = require('../../common/consts.js');
var logger = require('../../common/logger.js');

dbMgr.init(['users']);

var userDb = dbMgr.exec('users');

/**
 * 登陆
 */
router.post('/checkLogin', function (req, res, next) {
    var account = req.body.account;
    var password = req.body.password;

    console.log("account, passwordP: ", account, password);

    if (utils.isNull(account) || utils.isNull(password)) {
        Response.resp(ErrorCode.WRONGPARAMS.msg, res, ErrorCode.WRONGPARAMS.code);
        return;
    }

    if (account == "admin") {
        return Response.respData({code: -1, msg: "登陆失败"}, res);
    }

    userDb.checkLogin(account, password, function (err, data) {
        if (err) {
            Response.resp(ErrorCode.WRONGQUERY.msg, res, ErrorCode.WRONGQUERY.code);
            return;
        }

        if (data && data.length == 0) {
            return Response.respData({code: -1, msg: "登陆失败"}, res);
        }

        req.session.regenerate(function (err) {
            if (err) {
                return Response.respData({code: -1, msg: "登陆失败"}, res);
            }

            req.session.loginUser = data[0].userName;
            req.session.sessionId = utils.md5(data[0].userName);
            Response.respData({code: 0, msg: "登陆成功"}, res);
        });
    })

});

router.get('/jdLogin', function(req, res, next) {
    var url = "https://oauth.jd.com/oauth/authorize?response_type=code&client_id=";

    url += consts.jdcfg.appKey;
    url += "&redirect_uri=";
    url += consts.jdcfg.cbUrl;
    url += "&state=";
    url += consts.jdcfg.state;
    url += "&view=wap";

   // console.log("jdlogin url: ", url);

    res.redirect(url);
});

/**
 * 获取所有账号
 */
router.get('/getAllManager', function (req, res, next) {

    //权限检测
    //code...
    //获取数据
    var start = req.query.start;
    var limit = req.query.limit;
    var retData = {};

    retData["rows"] = [];
    retData["results"] = 0;

    userDb.getAllManagerCount(function (err, total) {
        userDb.getAllManager(start, limit, function (err, data) {
            if (err) {
                Response.resp(ErrorCode.WRONGQUERY.msg, res, ErrorCode.WRONGQUERY.code);
                return;
            }
            if (data) {
                if (utils.isArray(data)) {
                    retData["rows"] = data;
                } else {
                    retData["rows"].push(data);
                }
            }

            retData["results"] = total;

            Response.respData(retData, res);
        });
    });
});

/**
 * 增加账号
 */
router.post('/addManager', function (req, res, next) {
    var account = req.body.account;
    var password = req.body.password;
    var cPassword = req.body.cPassword;
    var userName = req.body.userName;
    var userPhone = req.body.userPhone;
    var text = req.body.text;

    if (utils.isArray(account) || utils.isNull(password) || utils.isNull(cPassword) || utils.isNull(userName) || utils.isNull(userPhone)) {
        Response.resp(ErrorCode.WRONGPARAMS.msg, res, ErrorCode.WRONGPARAMS.code);
        return ;
    }

    if (password != cPassword) {
        Response.resp(ErrorCode.PWDFAIL.msg, res, ErrorCode.PWDFAIL.code);
        return ;
    }

    if (text != "999999") {     //测试
        Response.resp(ErrorCode.TEXTFAIL.msg, res, ErrorCode.TEXTFAIL.code);
        return ;
    }

    var data = {
        account: account,
        password: password,
        userName: userName,
        userPhone: userPhone
    };
    userDb.getUseInfoByAccount(account, function(err, userData1) {
        if (userData1 && userData1.length > 0) {
            Response.resp(ErrorCode.ACCOUTNFAIL.msg, res, ErrorCode.ACCOUTNFAIL.code);
        } else {
            userDb.getUserInfoByPhone(userPhone, function(err, userData2) {
               if (userData2 && userData2.length > 0) {
                   Response.resp(ErrorCode.PHONEFAIL.msg, res, ErrorCode.PHONEFAIL.code);
               } else {
                   userDb.addManager(data, function (err, ret) {
                       if (err) {
                           Response.resp(ErrorCode.FAIL.msg, res, ErrorCode.FAIL.code);
                       } else {
                           Response.resp(ErrorCode.SUCCESS.msg, res, ErrorCode.SUCCESS.code);
                       }
                   });
               }
            });
        }
    });
});

/**
 * 删除账号
 */
router.post('/delAccount', function(req,res, next) {
    var account = req.body.account;

    if (utils.isArray(account)) {
        Response.resp(ErrorCode.WRONGPARAMS.msg, res, ErrorCode.WRONGPARAMS.code);
        return ;
    }

    userDb.delUserByAccount(account, function(err, ret) {
        if (err) {
            Response.resp(ErrorCode.FAIL.msg, res, ErrorCode.FAIL.code);
        } else {
            Response.resp(ErrorCode.SUCCESS.msg, res, ErrorCode.SUCCESS.code);
        }
    });
});

/**
 * 检测短信码
 */
router.post('/checkText', function(req, res, next) {
    var text = req.body.text;

    if (text == "999999") {     //测试
        Response.resp(ErrorCode.SUCCESS.msg, res, ErrorCode.SUCCESS.code);
    } else {
        Response.resp(ErrorCode.FAIL.msg, res, ErrorCode.FAIL.code);
    }
});

/**
 * 检测账号重复
 */
router.post('/checkRepeat', function(req, res, next) {
    var account = req.body.account;

    if (utils.isArray(account)) {
        Response.resp(ErrorCode.WRONGQUERY.msg, res, ErrorCode.WRONGQUERY.code);
        return;
    }

    userDb.getUseInfoByAccount(account, function(err, data) {
        if (data && data.length > 0) {
            Response.resp(ErrorCode.ACCOUTNFAIL.msg, res, ErrorCode.ACCOUTNFAIL.code);
        } else {
            Response.resp(ErrorCode.FAIL.msg, res, ErrorCode.FAIL.code);
        }
    })
});

/**
 * 检测权限标识重复
 */
router.post('/checkRepeatForPrivilege', function(req, res, next) {
    var prisign = req.body.prisign;

    if (utils.isArray(prisign)) {
        Response.resp(ErrorCode.WRONGQUERY.msg, res, ErrorCode.WRONGQUERY.code);
        return;
    }

    userDb.getPrivilegeBySign(prisign, function(err, data) {
        if (data && data.length > 0) {
            Response.resp(ErrorCode.SIGNFAIL.msg, res, ErrorCode.SIGNFAIL.code);
        } else {
            Response.resp(ErrorCode.FAIL.msg, res, ErrorCode.FAIL.code);
        }
    })
});

/**
 * 新增权限
 */
router.post('/addPrivilege', function(req, res, next) {
    var priname = req.body.account;
    var prisign = req.body.password;

    if (utils.isArray(priname) || utils.isNull(prisign)) {
        Response.resp(ErrorCode.WRONGPARAMS.msg, res, ErrorCode.WRONGPARAMS.code);
        return ;
    }

    var data = {
        priname: priname,
        prisign: prisign
    };

    userDb.getPrivilegeBySign(prisign, function(err, priData) {
        if (priData && priData.length > 0) {
            Response.resp(ErrorCode.SIGNFAIL.msg, res, ErrorCode.SIGNFAIL.code);
        } else {
            userDb.addPrivilege(data, function (err, ret) {
                if (err) {
                    Response.resp(ErrorCode.FAIL.msg, res, ErrorCode.FAIL.code);
                } else {
                    Response.resp(ErrorCode.SUCCESS.msg, res, ErrorCode.SUCCESS.code);
                }
            });
        }
    });
});

router.get('/getAllPrivilege', function(req, res, next) {
    var start = req.query.start;
    var limit = req.query.limit;
    var retData = {};

    retData["rows"] = [];
    retData["results"] = 0;

    userDb.getAllPrivilegeCount(function (err, total) {
        userDb.getAllPrivilege(start, limit, function (err, data) {
            if (err) {
                Response.resp(ErrorCode.WRONGQUERY.msg, res, ErrorCode.WRONGQUERY.code);
                return;
            }
            if (data) {
                if (utils.isArray(data)) {
                    retData["rows"] = data;
                } else {
                    retData["rows"].push(data);
                }
            }

            retData["results"] = total;

            Response.respData(retData, res);
        });
    });
});

router.get('/getParentPrivilege', function(req, res, next) {
    userDb.getAllPrivilegeByPid(-1, function (err, data) {
        if (err) {
            Response.resp(ErrorCode.WRONGQUERY.msg, res, ErrorCode.WRONGQUERY.code);
            return;
        }
        var retData = [];

        if (data) {
            if (utils.isArray(data)) {
                for(var i = 0; i < data.length; i++) {
                    retData.push({
                        name: data[i].privilegeName,
                        id: data[i].Id
                    })
                }
            }
        }

        Response.respData(retData, res);
    });
});

module.exports = router;