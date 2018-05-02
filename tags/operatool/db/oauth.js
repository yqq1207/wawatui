var query = require('../common/mysqlQuery.js');
var logger = require('../common/logger.js');

function saveAuthTokenInfo(params) {
    var sqlStr = 'insert into zb_oauth2(oauthType, access_token, expire_in, refresh_in, oscope, otime, token_type, ouid, user_nick) values(?,?,?,?,?,?,?,?,?)';
    var inParams = [params.oauthType, params.accessToken, params.expireIn, params.refreshIn, params.oscope, params.otime, params.tokenType, params.ouid, params.userNick];

    return new Promise(function(resolve, reject) {
        query.query(sqlStr, inParams, function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

function updateAuthTokenInfo(params) {
    var sqlStr = 'update zb_oauth2 set access_token=?,expire_in=?,refresh_in=?,oscope=?,otime=?,token_type=?,ouid=?,user_nick=? where oauthType=?';
    var inParams = [params.accessToken, params.expireIn, params.refreshIn, params.oscope, params.otime, params.tokenType, params.ouid, params.userNick, params.oauthType];

    return new Promise(function(resolve, reject) {
        query.query(sqlStr, inParams, function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

async function getAuthTokenInfo(otype) {
    var sqlStr = 'select * from zb_oauth2 where oauthType=?';
    var inParams = [otype];

    return new Promise(function(resolve, reject) {
        query.query(sqlStr, inParams, function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

module.exports = {
    saveAuthTokenInfo: saveAuthTokenInfo,
    updateAuthTokenInfo: updateAuthTokenInfo,
    getAuthTokenInfo: getAuthTokenInfo
};