var logger = require('../common/logger');
var query  = require('../common/mysqlQuery.js');

/**
 * 获取充值总金额
 * @param time
 * @param type
 * @param callback
 */
function getAllMoney(time, type, callback) {
    var sqlStr = 'select sum(goodsprice) from user_wechatpay where orderstate=? and goodstime<=? order by goodstime desc';
    console.log("sqlStr: " + sqlStr);
    var inParams = [type, time];
    query.query(sqlStr, inParams, function(err, data) {
        if (err) {
            console.log(err);
            callback(err);
        } else {
            callback(null, data);
        }
    });
}


/**
 * 获取订单总娃娃
 * @param time
 * @param type
 * @param callback
 */
function getAllPetSum(time, callback) {
    var sqlStr = 'SELECT sum(og.goodscount) from game_order go left join order_goods og on go.orderStr=og.order_id and go.goodsType=1';
    console.log("sqlStr: " + sqlStr);
    query.query(sqlStr, null, function(err, data) {
        if (err) {
            console.log(err);
            callback(err);
        } else {
            callback(null, data);
        }
    });
}



function saveWechatPayOrder(params, callback) {
    var sqlStr = 'call p_user_wechatpay_save(?,?,?,?,?,?,?,?,?)';

    query.query(sqlStr, params, function(err, data) {
        if (err) {
            logger.error("insert into user_wechatpay result:", err, 'in params:', params);
            callback(err);
        } else {
            callback(null, data);
        }
    });
};

/**
 * 获取未完成订单,重复调用使用同一订单
 * @param userId
 * @param callback
 */
function getWechatPayOrder(userId, state, callback) {
    var sqlStr = 'call p_user_wechatpay_get(?,?)';
    var params = [userId, state];
    query.query(sqlStr, params, function(err, data) {
        if (err) {
            logger.error("get user_wechatpay result:", err, 'in params:', params);
            callback(err);
        } else {
            callback(null, data);
        }
    });
};


/**
 * 获取订单
 * @param orderId
 * @param callback
 */
function getWechatPayOrderByOrderId(orderId, callback) {
    var sqlStr = 'call p_user_wechatpay_getbyorderid(?)';
    var params = [orderId];
    query.query(sqlStr, params, function(err, data) {
        if (err) {
            logger.error("get user_wechatpay by orderId result:", err, 'in params:', params);
            callback(err);
        } else {
            callback(null, data);
        }
    });
};

function updateWechatPayOrder(params, callback){
    var sqlStr = 'call p_user_wechatpay_update(?,?,?,?,?,?)';
    var inParams = [params[0], params[3], params[4], params[5], params[6], params[8]];
    query.query(sqlStr, inParams, function(err, data) {
        if (err) {
            logger.error("updateWechatPayOrder result:", err, 'in params:', params);
            callback(err);
        } else {
            callback(null, data);
        }
    });
};

function updateWechatPayOrderState(params, callback){
    var sqlStr = 'call p_user_wechatpay_updatestate(?,?)';
    query.query(sqlStr, params, function(err, data) {
        if (err) {
            logger.error("updateWechatPayOrder result:", err, 'in params:', params);
            callback(err);
        } else {
            callback(null, data);
        }
    });
};

function updateWechatPayOrderAfterPay(params, callback){
    var sqlStr = 'call p_user_wechatpay_update_afterpay(?,?,?,?,?,?,?,?,?,?)';

    query.query(sqlStr, params, function(err, data) {
        if (err) {
            logger.error("updateWechatPayOrderAfterPay result:", err, 'in params:', params);
            callback(err);
        } else {
            callback(null, data);
        }
    });
};

function redPackageTest(params, callback) {
    var sqlStr = 'call p_user_take_update(?,?,?,?,?,?)';

    query.query(sqlStr, params, function(err, data) {
        if (err) {
            logger.error("updateTakeRedPackage result:", err, 'in params:', params);
            callback(err);
        } else {
            callback(null, data);
        }
    });
};



module.exports = {
    saveWechatPayOrder: saveWechatPayOrder,
    getWechatPayOrder: getWechatPayOrder,
    updateWechatPayOrder: updateWechatPayOrder,
    getWechatPayOrderByOrderId: getWechatPayOrderByOrderId,
    updateWechatPayOrderAfterPay: updateWechatPayOrderAfterPay,
    updateWechatPayOrderState: updateWechatPayOrderState,
    redPackageTest: redPackageTest,
    getAllMoney: getAllMoney,
    getAllPetSum: getAllPetSum
};