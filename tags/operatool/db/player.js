var query  = require('../common/mysqlQuery.js');

function getAddGoldResultTotal(state, callback) {
    var sqlStr = 'select count(id) from t_goldaddresult where userId=?';
    var inParams = [state];

    query.query(sqlStr, inParams, function(err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data[0]["count(id)"]);
        }
    });
};

function getAddGoldResult(userId, offset, limit, callback) {
    var sqlStr = "select * from t_goldaddresult where userId=? order by addTime desc limit " + offset + "," + limit;
    var inParams = [userId];

    query.query(sqlStr, inParams, function(err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data || []);
        }
    });
};


function addGoldResult(userId, addGold, operUser, operDetail, callback) {
    var sqlStr = "insert into t_goldaddresult(userId, addGold, addTime, operuser, operdetail) values(?,?,?,?,?)";
    var inParams = [userId, addGold, new Date(), operUser, operDetail];

    query.query(sqlStr, inParams, function(err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data);
        }
    });
};

function getChargeOrder(startSec, endSec, start, limit, callback) {
    var sqlStr = "select * from user_wechatpay ";
    var inParams = null;

    if (startSec && endSec) {
        sqlStr += "where goodstime >=? and goodstime <=?";
        inParams = [startSec, endSec];
    }

    sqlStr += " order by goodstime asc limit " + start + "," + limit;

    query.query(sqlStr, inParams, function(err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data);
        }
    });
}

function getChargeOrderCount(startSec, endSec, callback) {
    var sqlStr = "select count(*) from user_wechatpay ";
    var inParams = null;

    if (startSec && endSec) {
        sqlStr += "where goodstime >=? and goodstime <=? ";
        inParams = [startSec, endSec];
    }

    sqlStr += "order by goodstime asc";

    query.query(sqlStr, inParams, function(err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data[0]["count(*)"]);
        }
    });
};

function changerOrderByStateCount(offset, limit, type, callback) {
    var sqlStr = "select count(*) from user_wechatpay ";
    if (type == 1) {
        sqlStr += "where orderstate=1 or orderstate=2 ";
    } else {
        sqlStr += "where orderstate=0 ";
    }

    sqlStr += "order by goodstime asc ";

    if (offset && limit) {
        sqlStr += "limit " + offset + "," +limit;
    }

    query.query(sqlStr, null, function(err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data[0]["count(*)"]);
        }
    });
};

function changeOrderByState(offset, limit, type, callback) {
    var sqlStr = "select * from user_wechatpay ";

    if (type == 1) {
        sqlStr += "where orderstate=1 or orderstate=2 ";
    } else {
        sqlStr += "where orderstate=0 ";
    }

    sqlStr += "order by goodstime asc ";

    if (offset && limit) {
        sqlStr += "limit " + offset + "," +limit;
    }

    query.query(sqlStr, null, function(err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data);
        }
    });
};



module.exports = {
    getAddGoldResultTotal: getAddGoldResultTotal,
    getAddGoldResult:getAddGoldResult,
    addGoldResult: addGoldResult,
    getChargeOrder: getChargeOrder,
    getChargeOrderCount: getChargeOrderCount,
    changerOrderByStateCount: changerOrderByStateCount,
    changeOrderByState: changeOrderByState
};