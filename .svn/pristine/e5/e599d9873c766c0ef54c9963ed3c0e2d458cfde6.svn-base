var query  = require('../common/mysqlQuery.js');

/**
 * 根据时间获取订单
 * @param startDate
 * @param endDate
 * @param type
 * @param callback
 */
function getOrderByTime(startDate, endDate, type, callback) {
    var sqlStr = "select T.userName, T.userCellPhone, T.userProvince, T.userCity, T.userAddress, T.remarks, PT.name, T.goodsCount, T.orderStr, T.userId, T.getTime, T.goodsType from (SELECT  M.orderStr, M.userId, M.userName, M.userCellPhone, M.userProvince, M.goodsType, M.userCity, M.remarks, M.userAddress, M.getTime, N.goodsId, N.goodsCount FROM game_order M LEFT JOIN order_goods N ON M.orderStr=N.order_id WHERE M.getTime>=? and M.getTime<? ";

    if (type) {
        sqlStr += "and M.goodsType=? ";
    }

    sqlStr += "order by M.userCellPhone asc) as T left join pets PT on T.goodsId=PT.id";

    var inParams = [startDate, endDate];

    if (type) {
        inParams.push(type);
    }

    query.query(sqlStr, inParams, function(err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data || []);
        }
    });
};

/**
 * 获取订单明细
 * @param startDate
 * @param endDate
 * @param callback
 */
function getOrderDetailByTime(startDate, endDate, callback) {
    var sqlStr = "select PT.id, PT.name, T.getTime, T.goodsCount from (SELECT M.getTime, N.goodsId, N.goodsCount FROM game_order M LEFT JOIN order_goods N ON M.orderStr=N.order_id WHERE M.getTime>=? and M.getTime<?) as T left join pets PT on T.goodsId=PT.id";
    var inParams = [startDate, endDate];

    query.query(sqlStr, inParams, function(err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data || []);
        }
    });
};

/**
 * 获取订单用户id
 * @param order
 * @param callback
 */
function selectIdByOrder(order, callback) {
    var sqlStr = 'select userId from game_order where orderStr=?';
    var inParams = [order];

    query.query(sqlStr, inParams, function(err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data[0].userId);
        }
    });
};

function selectIdByPhone(phone, callback) {
    var sqlStr = 'select userId from game_order where userCellPhone=?';
    var inParams = [phone];

    query.query(sqlStr, inParams, function(err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data[0].userId);
        }
    });
};

/**
 * 保存订单通知状态
 * @param data
 * @param callback
 */
function saveOrderNotify(data, callback) {
    var sqlStr = 'insert into zb_ordernotify(orderStr,devily,telphone,type,notifydate) values(?,?,?,?,?)';
    var date = new Date();
    var inParams = [data.order, data.devily, data.cellPhone, data.type, date];

    query.query(sqlStr, inParams, function(err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data);
        }
    });
};

/**
 * 获取订单通知状态
 * @param order
 * @param devily
 * @param telphone
 * @param type
 * @param callback
 */
function getOrderNotify(devily, telphone, type, callback) {
    var sqlStr = 'select * from zb_ordernotify where devily=? and telphone=? and type=?';
    var inParams = [devily, telphone, type];

    query.query(sqlStr, inParams, function(err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data);
        }
    });
};

/**
 * 获取玩家提取娃娃订单
 * @param userId
 * @param status
 * @param callback
 */
function selectOrder(status, offset, limit, startTime, endTime, callback) {
    var sqlStr = 'select * from game_order where goodsType=?';
    var inParams = [status];

    if (startTime && endTime) {
        sqlStr += " and getTime>=? and getTime <? ";
        inParams.push(startTime);
        inParams.push(endTime);
    }
    sqlStr += ' order by userCellPhone asc,userName asc limit ' + offset + ',' + limit;
    //var time = MyDate.getNow00Sec();
    //var sqlStr = 'select * from game_order where goodsType=? and getTime<=? order by userName asc';

    //logger.debug("selectOrder sql: ", sqlStr, inParams);

    query.query(sqlStr, inParams, function(err, data) {
        if (err) {
            console.log(err);
            //logger.error("selectOrder result:", JSON.stringify(err), 'in params:', inParams);
            callback(err);
        } else {
            callback(null, data);
        }
    });
};

/**
 * 获取订单总数
 * @param state
 * @param startTime
 * @param endTime
 * @param callback
 */
function selectTotalOrder(state, startTime, endTime, callback) {
    var sqlStr = 'select count(id) from game_order where 1=1';
    var inParams = [];

    if (state) {
        sqlStr += " and goodsType=?";
        inParams.push(state);
    }

    if (startTime && endTime) {
        sqlStr += " and getTime>=? and getTime <? ";
        inParams.push(startTime);
        inParams.push(endTime);
    }

    query.query(sqlStr, inParams, function(err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data[0]["count(id)"]);
        }
    });
};

/**
 * 按手机号检索订单量
 * @param state
 * @param startTime
 * @param endTime
 * @param callback
 */
function selectTotalOrderByPhone(state, startTime, endTime, callback) {
    var sqlStr = 'select count(distinct userCellPhone) from game_order where 1=1';
    var inParams = [];

    if (state) {
        sqlStr += " and goodsType=?";
        inParams.push(state);
    }

    if (startTime && endTime) {
        sqlStr += " and getTime>=? and getTime <? ";
        inParams.push(startTime);
        inParams.push(endTime);
    }

    query.query(sqlStr, inParams, function(err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data[0]["count(distinct userCellPhone)"]);
        }
    });
};

/**
 * 获取指定状态的订单娃娃数量
 * @param state
 * @param startTime
 * @param endTime
 * @param callback
 */
function selectTotalOrderPet(state, startTime, endTime, callback) {
    var sqlStr = 'SELECT sum(N.goodsCount) FROM game_order M LEFT JOIN order_goods N ON M.orderStr=N.order_id WHERE 1=1';
    var inParams = [];

    if (startTime && endTime) {
        sqlStr += " and M.getTime>=? and M.getTime <?";
        inParams.push(startTime);
        inParams.push(endTime);
    }
    if (state) {
        sqlStr += " and M.goodsType=?";
        inParams.push(state);
    }

    query.query(sqlStr, inParams, function(err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data[0]["sum(N.goodsCount)"]);
        }
    });
};

/**
 * 审核订单数据
 * @param data
 * @param callback
 */
function updateOrder(goodsType, delivery, orderStr, kdcompany, kdcode, callback) {
    var sqlStr = "update game_order set goodsType=?,checktime=?,kdcompany=?,kdcode=?";
    if (delivery) {
        sqlStr += ",delivery=? "
    }
    sqlStr += "where orderStr=?";

    var checkDate = Math.floor(Date.now() / 1000);
    var inParams = [goodsType, checkDate, kdcompany, kdcode];
    if (delivery) {
        inParams.push(delivery);
    }
    inParams.push(orderStr);

    console.log("updateOrder: " + inParams);

    query.query(sqlStr, inParams, function(err, data) {
        if (err) {
            console.log(err);
            callback(err);
        } else {
            console.log(1111);
            callback(null, data);
        }
    });
};

/**
 * 更新快递单号
 * @param goodsType
 * @param delivery
 * @param orderStr
 * @param kdcompany
 * @param kdcode
 * @param callback
 */
function updateOrderDevily(goodsType, delivery, orderStr, kdcompany, kdcode, callback) {
    var sqlStr = "update game_order set delivery=?,kdcompany=?,kdcode=?,goodsType=2 where orderStr=? and goodsType=?";
    var inParams = [delivery, kdcompany, kdcode, orderStr, goodsType ];

    query.query(sqlStr, inParams, function(err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data);
        }
    });
};

function updateOrderDevilyByPhone(goodsType, delivery, phone, kdcompany, kdcode, startDate, endDate, callback) {
    var sqlStr = "update game_order set delivery=?,kdcompany=?,kdcode=?,goodsType=2 where getTime>=? and getTime<? and userCellPhone=? and goodsType=?";
    var inParams = [delivery, kdcompany, kdcode, startDate, endDate, phone, goodsType ];

    query.query(sqlStr, inParams, function(err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data);
        }
    });
};

function getOrderByPhone(phone, startDate, endDate, callback) {
    var sqlStr = 'select * from game_order where userCellPhone=? and getTime>=? and getTime<?';
    var inParams = [phone, startDate, endDate];

    query.query(sqlStr, inParams, function(err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data);
        }
    });

};


function updateOrderRedirect(goodsType, orderStr, callback) {
    var sqlStr = "update game_order set goodsType=?,checktime=? where orderStr=?";
    var checkDate = Math.floor(Date.now() / 1000);
    var inParams = [goodsType, checkDate, orderStr];
    query.query(sqlStr, inParams, function(err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data);
        }
    });
};

/**
 * 根据时间更新快递单号
 * @param startDate
 * @param endDate
 * @param type
 * @param callback
 */
function updateOrderByDate(startDate, endDate, type, callback) {
    var sqlStr = "update game_order set goodsType=?,checktime=? where getTime>=? and getTime<?";
    var checkDate = Math.floor(Date.now() / 1000);
    var inParams = [type, checkDate, startDate, endDate];

    query.query(sqlStr, inParams, function(err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data);
        }
    });
};

/**
 * 查找快递信息
 * @param orderStr
 * @param callback
 */
function selectOrderGoods(orderStr, callback) {
    var sqlStr = 'select * from order_goods where order_id=?';
    var inParams = [orderStr];
    query.query(sqlStr, inParams, function(err, data) {
        if (err) {
            logger.error("selectOrderGoods result:", JSON.stringify(err), 'in params:', inParams);
            callback(err);
        } else {
            callback(null, data);
        }
    });
};

function findAllUserGroupPhone(callback) {
    var sqlStr = 'select * from game_order group by userCellPhone;';

    query.query(sqlStr, [], function(err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data);
        }
    });
}

module.exports = {
    getOrderByTime: getOrderByTime,
    getOrderDetailByTime: getOrderDetailByTime,
    selectIdByOrder: selectIdByOrder,
    selectIdByPhone: selectIdByPhone,
    saveOrderNotify: saveOrderNotify,
    getOrderNotify: getOrderNotify,
    selectOrder: selectOrder,
    selectTotalOrder: selectTotalOrder,
    selectTotalOrderByPhone: selectTotalOrderByPhone,
    selectTotalOrderPet: selectTotalOrderPet,
    updateOrder: updateOrder,
    updateOrderDevily: updateOrderDevily,
    updateOrderDevilyByPhone: updateOrderDevilyByPhone,
    updateOrderRedirect: updateOrderRedirect,
    updateOrderByDate: updateOrderByDate,
    selectOrderGoods: selectOrderGoods,
    getOrderByPhone: getOrderByPhone,
    findAllUserGroupPhone: findAllUserGroupPhone
};