var request = require('request');
var fs = require('fs');

var logger = require('./logger.js');
var utils = require('./utils.js');
var consts = require('../common/consts.js');

//需要是服务号的
var accesstoken = '';
var accesstokenTime = 0;
var expiretime = 0;

async function getAccessToken(oa) {
    var appId = consts.wechatcfg[oa].appId;
    var appSecret = consts.wechatcfg[oa].secert;

    var url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + appId + '&secret=' + appSecret;
    var date = new Date().getTime();

    if (!accesstoken || (date - accesstokenTime) / 1000 >= expiretime + 1) {
        //无accesstoken或者超时
        var result = await getWebContent(url, 'POST', null);
        logger.debug('getAccessToken url:', url);
        logger.debug('getAccessToken result:', result);
        accesstoken = result.access_token;
        accesstokenTime = new Date().getTime();
        expiretime = result.expires_in;
        return accesstoken;
    } else {
        return accesstoken;
    }
}

function getWebContent(uri, method, data) {
    method = method || "POST";
    var requestData = {
        "method": method,
        "uri": uri,
        "json": true
    };
    if (data) {
        requestData['body'] = data;
        requestData['qs'] = data;
    }
    return new Promise(function (resolve, reject) {
        request(requestData, function (error, response, body) {
            if (error) {
                reject(error);
            } else {
                resolve(body);
            }
        });
    }).catch(function (err) {
        logger.error("getWebContent error:", err);
    });
}

async function setIndustry() {
    var token = await getAccessToken();
    var url = 'https://api.weixin.qq.com/cgi-bin/template/api_set_industry?access_token=' + token;
    var data = {"industry_id1": "2", "industry_id2": "6"};
    return await getWebContent(url, 'POST', data);
}

async function getIndustry() {
    var token = await getAccessToken();
    var url = 'https://api.weixin.qq.com/cgi-bin/template/get_industry?access_token=' + token;
    return await getWebContent(url, 'POST', null);
}

async function getAllPrivateTemplate() {
    var token = await getAccessToken();
    var url = 'https://api.weixin.qq.com/cgi-bin/template/get_all_private_template?access_token=' + token;
    var ret = await getWebContent(url, 'GET', null);
    return ret;
}

/**
 * 增加模板
 * @param templateId
 * @returns {Promise.<*>}
 */
async function apiAddTemplate(templateId) {
    var token = await getAccessToken();
    var url = 'https://api.weixin.qq.com/cgi-bin/template/api_add_template?access_token=' + token;
    var data = {"template_id_short": templateId};
    return await getWebContent(url, 'POST', data);
}

/**
 * 发送模板消息
 * @param openId
 * @param type
 * @returns {Promise.<*>}
 */
async function sendTemplateMessage(oa, msg) {
    var token = await getAccessToken(oa);
    var url = 'https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=' + token;
    var ret = await getWebContent(url, 'POST', msg);

    logger.debug("sendTemplateMessage: ", url, msg.touser, oa, ret);
    return ret;
}

async function userInfo(openid) {
    var token = await getAccessToken();
    var url = 'https://api.weixin.qq.com/cgi-bin/user/info?access_token=' + token + '&openid=' + openid + '&lang=zh_CN';
    return await getWebContent(url, 'GET', null);
};

async function getWNUserList() {
    var token = await getAccessToken();
    var url = 'https://api.weixin.qq.com/cgi-bin/user/get?access_token=' + token;
    return await getWebContent(url, 'GET', null);
};

module.exports = {
    setIndustry: setIndustry,
    getIndustry: getIndustry,
    getAllPrivateTemplate: getAllPrivateTemplate,
    apiAddTemplate: apiAddTemplate,
    sendTemplateMessage: sendTemplateMessage,
    userInfo: userInfo,
    getWNUserList: getWNUserList
};