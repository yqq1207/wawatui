var express = require('express');
var router = express.Router();
var consts = require('../common/consts.js');
var utils = require('../common/utils.js');
var logger = require('../common/logger.js');

var dbMgr = require('../db/index.js').DBMgr();

dbMgr.init(['oauth']);

var db = dbMgr.exec('oauth');

router.get('/backstage', async function(req, res, next) {
    var session = req.session;
    var loginUser = session.loginUser || "";
    var sessionId = session.sessionId;
    var isLogined = !!sessionId;
    var accessToken = null;

    var code = req.query.code;
    var state = req.query.state;

    logger.debug("login code, state, loginUser: ", code, state, loginUser, sessionId, isLogined);

    if (code && state && state == consts.jdcfg.state) {

        var tokenInfo = await getAuthTokenInfo("jd");
        var flag = 1;
        var refreshToken = null;

        //logger.debug("tokenInfo: ", tokenInfo);

        if (tokenInfo && tokenInfo.length > 0) {
            var info = tokenInfo[0];
            if (info) {
                var expireIn = info.expire_in * 1000;
                var time = info.otime;
                var now = Date.now();

                if (now - (expireIn + time) >= 0) {     //过期
                    flag = 0;
                } else {
                    isLogined = true;
                    loginUser = info.user_nick;
                    accessToken = info.access_token;
                }
                refreshToken = info.refresh_in;
            } else {
                flag = -1; // 没有token
            }
        }

        var appKey = consts.jdcfg.appKey;
        var cbUrl = consts.jdcfg.cbUrl;
        var secert = consts.jdcfg.appSecert;

        if (flag == -1) {
            var guri = "https://oauth.jd.com/oauth/token?grant_type=authorization_code&client_id=" + appKey + "&redirect_uri=" + cbUrl + "&code=" + code + "&state=" + state + "&client_secret=" + secert;

            var ret = await getWebContent(guri, "POST", null);

            logger.debug("getWebContent getToken: ", ret);

            var params = {
                oauthType: "jd",
                accessToken: ret.access_token,
                expireIn: ret.expires_in,
                refreshIn: ret.refresh_token,
                oscope: ret.scope,
                otime: ret.time,
                tokenType: ret.token_type,
                ouid: ret.uid,
                userNick: ret.user_nick
            };

            loginUser = ret.user_nick;
            accessToken = ret.access_token;
            isLogined = true;
            db.saveAuthTokenInfo(params);
        } else if (flag == 0) {
            var ruri = "https://oauth.jd.com/oauth/token?grant_type=refresh_token&client_id=" + appKey + "&client_secret=" + secert + "&refresh_token=" + refreshToken;

            var ret = await  getWebContent(ruri, "POST", null);
            logger.debug("getWebContent refreshToken: ", ret);

            var params = {
                oauthType: "jd",
                accessToken: ret.access_token,
                expireIn: ret.expires_in,
                refreshIn: ret.refresh_token,
                oscope: ret.scope,
                otime: ret.time,
                tokenType: ret.token_type,
                ouid: ret.uid,
                userNick: ret.user_nick
            };

            loginUser = ret.user_nick;
            accessToken = ret.access_token;
            isLogined = true;

            db.updateAuthTokenInfo(params);
        }

        req.session.sessionId = utils.md5(loginUser);
        req.session.loginUser = loginUser;
        req.session.accessToken = accessToken;
    }

    if (!isLogined) {
        res.render('login', {title: '抓娃娃登陆'});
    } else {
        res.render('index', {
            isLogined: isLogined,
            name: loginUser
        });
    }
});

async function getAuthTokenInfo(otype) {
   return await db.getAuthTokenInfo(otype);
};

async function saveAuthTokenInfo(params) {
    return await db.saveAuthTokenInfo(params);
};

async function getWebContent(uri, method, data) {
    await utils.getWebContent(uri, method, data);
};



module.exports = router;