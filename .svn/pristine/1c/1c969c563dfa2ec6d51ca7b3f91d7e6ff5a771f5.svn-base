var query = require('../common/mysqlQuery.js');
var logger = require('../common/logger.js');

/**
 * 获取事业部编号
 */
function getDeptNo() {
    var sqlStr = 'select deptNo from zb_depts';
    var inParams = [];

    return new Promise(function(resolve, reject) {
        query.query(sqlStr, inParams, function(err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

/**
 * 保存事业部信息
 * @param data
 * @param cb
 */
function saveDeptInfo(data, cb) {
    var len = data.length;
    var sqlStr = 'insert into zb_depts(deptName,settlementMode,resultsSection,enableTemplate,status,managerFax,managerName,settlementBody,accountData,sellerName,deptNo,qualification,managerEmail,billingConditions,managerPhone,managerAddress,sellerNo) values';
    var inParams = [];

    for (var i = 0; i < len; i++) {
        sqlStr += "(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

        if (i < len - 1) {
            sqlStr += ",";
        }

        var params = [];

        params.push(data[i].deptName);
        params.push(data[i].settlementMode);
        params.push(data[i].resultsSection);
        params.push(data[i].enableTemplate);
        params.push(data[i].status);
        params.push(data[i].managerFax);
        params.push(data[i].managerName);
        params.push(data[i].settlementBody);
        params.push(data[i].accountData);
        params.push(data[i].sellerName);
        params.push(data[i].deptNo);
        params.push(data[i].qualification);
        params.push(data[i].managerEmail);
        params.push(data[i].billingConditions);
        params.push(data[i].managerPhone);
        params.push(data[i].managerAddress);
        params.push(data[i].sellerNo);

        if (len > 1) {
            inParams.push(params);
        } else {
            inParams = params;
        }
    }

    query.query(sqlStr, inParams, function(err, data) {
        if (err) {
            cb(err);
        } else {
            cb(null, data);
        }
    });
};

/**
 * 获取类别列表
 * @param cb
 */
function getCategyList(cb) {
    var sqlStr = 'select * from zb_goodscategy';
    var inParams = [];

    query.query(sqlStr, inParams, function(err, data) {
        if (err) {
            cb(err);
        } else {
            cb(null, data);
        }
    });
};

/**
 * 保存新的层级
 * @param fnumber
 * @param cname
 * @param cnumber
 * @param res
 */
function saveCategy(fnumber, cname, cnumber, level, cb) {
    var sqlStr = 'insert into zb_goodscategy(fnumber, cname, cnumber,level) values(?,?,?,?)';
    var inParams = [fnumber, cname, cnumber, level];

    query.query(sqlStr, inParams, function(err, data) {
        if (err) {
            cb(err);
        } else {
            cb(null, data);
        }
    });
};

/**
 * 根据编号获取类别
 * @param number
 * @param cb
 */
function getCategyByNumber(number, cb) {
    var sqlStr = 'select * from zb_goodscategy where cnumber=?';
    var inParams = [number];

    query.query(sqlStr, inParams, function(err, data) {
        if (err) {
            cb(err);
        } else {
            cb(null, data);
        }
    });
}

/**
 * 获取层级根据深度等级
 * @param level
 * @param res
 */
function getCategoryNoByLevel(level, cb) {
    var sqlStr = 'select cname,cnumber from zb_goodscategy where level=?';
    var inParams = [level];

    query.query(sqlStr, inParams, function(err, data) {
        if (err) {
            cb(err);
        } else {
            cb(null, data);
        }
    });
};

/**
 * 获取主商品信息
 * @param start
 * @param limit
 * @param cb
 */
function getTranGoodsInfo(start, limit, cb) {
    var sqlStr = 'select * from zb_trangoodsinfo order by id asc limit ' + start + "," + limit;
    var inParams = [];

    query.query(sqlStr, inParams, function(err, data) {
        if (err) {
            cb(err);
        } else {
            cb(null, data);
        }
    });
}

/**
 * 获取单个主商品信息
 * @param id
 */
function getSinTranGoodsInfo(id, cb) {
    var sqlStr = 'select * from zb_trangoodsinfo where id=?';
    var inParams = [id];

    query.query(sqlStr, inParams, function(err, data) {
        if (err) {
            cb(err);
        } else {
            cb(null, data);
        }
    });
};

/**
 * 获取事业部商品编号
 * @param cb
 */
function getTranGoodsNo(cb) {
    var sqlStr = 'select goodsName,goodsNo from zb_trangoodsinfo';
    var inParams = [];

    query.query(sqlStr, inParams, function(err, data) {
        if (err) {
            cb(err);
        } else {
            cb(null, data);
        }
    });
};

/**
 * 获取主商品记录总数
 * @param cb
 */
function getTranGoodsInfoTotal(cb) {
    var sqlStr = 'select count(id) from zb_trangoodsinfo';
    var inParams = [];

    query.query(sqlStr, inParams, function(err, data) {
        if (err) {
            cb(err);
        } else {
            cb(null, data[0]["count(id)"]);
        }
    });
};

/**
 * 保存主商品记录信息
 * @param data
 * @param cb
 */
function saveTranGoodsInfo(data, cb) {
    var sqlStr = 'insert into zb_trangoodsinfo';
    sendData(sqlStr, data, cb);
};

/**
 * 获取采购入库单总数
 * @param cb
 */
function getpoOrderInfoTotal(status, cb) {
    var sqlStr = 'select count(id) from zb_oporder where iscancel=?';
    var inParams = [status];

    query.query(sqlStr, inParams, function(err, data) {
        if (err) {
            cb(err);
        } else {
            cb(null, data[0]["count(id)"]);
        }
    });
};

/**
 * 获取采购入库单
 * @param start
 * @param limit
 * @param cb
 */
function getpoOrderInfo(status, start, limit, cb) {
    var sqlStr = 'select * from zb_oporder where iscancel=? order by id asc limit ' + start + "," + limit;
    var inParams = [status];

    query.query(sqlStr, inParams, function(err, data) {
        if (err) {
            cb(err);
        } else {
            cb(null, data);
        }
    });
};

function getpoOrderGoods(orderNoStr, cb) {
    var sqlStr = 'select * from zb_opordergoods where poOrderNo in';
    var inParams = [];

    var value = "(";
    for(var i = 0; i < orderNoStr.length; i++) {
        value +="?";
        inParams.push(orderNoStr[i]);
        if (i < orderNoStr.length - 1) {
            value += ",";
        }
    }

    value += ")";
    sqlStr += value;

    query.query(sqlStr, inParams, function(err, data) {
        if (err) {
            cb(err);
        } else {
            cb(null, data);
        }
    });
};

/**
 * 保存采购入库单号
 * @param data
 * @param cb
 */
function savepoOrderInfo(data, cb) {
    var sqlStr = 'insert into zb_oporder';

    sendData(sqlStr, data, cb);
    /*var inParams = [];

    var field = "(";
    var values = " values(";

    for (var id in data) {
        field += id;
        field += ",";
        values += "?,";
        inParams.push(data[id]);
    }

    field = field.substring(0, field.length - 1);
    values = values.substring(0, values.length - 1);
    field += ")";
    values += ")";

    sqlStr += field;
    sqlStr += values;

    query.query(sqlStr, inParams, function(err, data) {
        if (err) {
            cb(err);
        } else {
            cb(null, data);
        }
    });*/
}

function savepoOrderGoods(data, cb) {
   /* var len = data.length;
    var sqlStr = 'insert into zb_opordergoods';
    var inParams = [];

    var field = "(";
    var values = "(";

    for (var id in data[0]) {
        field += id;
        field += ",";
        values += "?,";
    }

    field = field.substring(0, field.length - 1);
    values = values.substring(0, values.length - 1);
    field += ")";
    values += ")";

    sqlStr += field;
    sqlStr += " values";

    for (var i = 0; i < len; i++) {
        sqlStr += values;

        if (i < len - 1) {
            sqlStr += ",";
        }
    }

    for (var i = 0; i < len; i++) {
        var child = data[i];
        var params = [];

        for (var id in child) {
            params.push(child[id]);
        }

        if (len > 1) {
            inParams.push(params);
        } else {
            inParams = params;
        }
    }
*/
    var sqlStr = "insert into zb_opordergoods";
    sendData(sqlStr, data, cb);
}

/**
 * 删除采购入库单
 * @param ids
 * @param cb
 */
function delpoOrderInfo(ids, cb) {
    var sqlStr = "delete from zb_oporder where poOrderNo in";
    var inParams = [];

    var value = "(";
    for(var i = 0; i < ids.length; i++) {
        value +="?";
        inParams.push(ids[i]);
        if (i < ids.length - 1) {
            value += ",";
        }
    }

    value += ")";
    sqlStr += value;

    logger.debug("delpoOrderInfo: ", sqlStr, inParams);

    query.query(sqlStr, inParams, function(err, data) {
        if (err) {
            cb(err);
        } else {
            cb(null, data);
        }
    });
};

function delpoOrderGoods(ids, cb) {
    var sqlStr = "delete from zb_opordergoods where poOrderNo in";
    var inParams = [];

    var value = "(";
    for(var i = 0; i < ids.length; i++) {
        value +="?";
        inParams.push(ids[i]);
        if (i < ids.length - 1) {
            value += ",";
        }
    }

    value += ")";
    sqlStr += value;

    logger.debug("delpoOrderGoods: ", sqlStr, inParams);

    query.query(sqlStr, inParams, function(err, data) {
        if (err) {
            cb(err);
        } else {
            cb(null, data);
        }
    });
};

function updatepoOrderCancel(ids, cb) {
    var sqlStr = "update zb_oporder set iscancel=1 where poOrderNo in";
    var inParams = [];

    var value = "(";
    for(var i = 0; i < ids.length; i++) {
        value +="?";
        inParams.push(ids[i]);
        if (i < ids.length - 1) {
            value += ",";
        }
    }

    value += ")";
    sqlStr += value;

    logger.debug("updatepoOrderCancel: ", sqlStr, inParams);

    query.query(sqlStr, inParams, function(err, data) {
        if (err) {
            cb(err);
        } else {
            cb(null, data);
        }
    });
};

/**
 * 销售出库单下发
 * @param data
 * @param cb
 */
function saveSellOrderBase(data, cb) {
    var sqlStr = 'insert into zb_sellOrder';

    sendData(sqlStr, data, cb);
}

function saveSellOrderInfo(data, cb) {
    var sqlStr = 'insert into zb_sellOrdergoods';
    sendData(sqlStr, data, cb);
}

/**
 * 销售出库单获取
 * @param uuid
 * @param cb
 */
function getSellOrderInfoByUUID(uuid, cb) {
    var sqlStr = 'select * from zb_sellOrder where isvUUID=?';
    var inParams = [uuid];

    query.query(sqlStr, inParams, function(err, data) {
        if (err) {
            cb(err);
        } else {
            cb(null, data);
        }
    });
}

function getSellOrderTotal(status, cb) {
    var sqlStr = 'select count(id) from zb_sellOrder where iscancel=?';
    var inParams = [status];

    query.query(sqlStr, inParams, function(err, data) {
        if (err) {
            cb(err);
        } else {
            cb(null, data[0]["count(id)"]);
        }
    });
};

function getSellOrderList(status, start, limit, cb) {
    var sqlStr = 'select * from zb_sellOrder where iscancel=? limit ' + start + "," + limit;
    var inParams = [status];

    query.query(sqlStr, inParams, function(err, data) {
        if (err) {
            cb(err);
        } else {
            cb(null, data);
        }
    });
};

function getSellOrderGoods(isvUUID, cb) {
    var sqlStr = 'select * from zb_sellOrdergoods where isvUUID in';
    var inParams = [];

    var value = "(";
    for(var i = 0; i < isvUUID.length; i++) {
        value +="?";
        inParams.push(isvUUID[i]);
        if (i < isvUUID.length - 1) {
            value += ",";
        }
    }

    value += ")";
    sqlStr += value;

    query.query(sqlStr, inParams, function(err, data) {
        if (err) {
            cb(err);
        } else {
            cb(null, data);
        }
    });
};

function updateSellOrderCancel(ids, cb) {
    var sqlStr = "update zb_sellOrder set iscancel=1 where eclpSoNo in";
    var inParams = [];

    var value = "(";
    for(var i = 0; i < ids.length; i++) {
        value +="?";
        inParams.push(ids[i]);
        if (i < ids.length - 1) {
            value += ",";
        }
    }

    value += ")";
    sqlStr += value;

    logger.debug("updateSellOrderCancel: ", sqlStr, inParams);

    query.query(sqlStr, inParams, function(err, data) {
        if (err) {
            cb(err);
        } else {
            cb(null, data);
        }
    });
};

function sendData(sqlStr, data, cb) {
    var inParams = [];

    var field = "(";
    var values = " values(";

    for (var id in data) {
        field += id;
        field += ",";
        values += "?,";
        inParams.push(data[id]);
    }

    field = field.substring(0, field.length - 1);
    values = values.substring(0, values.length - 1);
    field += ")";
    values += ")";

    sqlStr += field;
    sqlStr += values;

    query.query(sqlStr, inParams, function(err, data) {
        if (err) {
            cb(err);
        } else {
            cb(null, data);
        }
    });
}

module.exports = {
    getDeptNo: getDeptNo,
    saveDeptInfo: saveDeptInfo,
    saveCategy: saveCategy,
    getCategyByNumber: getCategyByNumber,
    getCategyList: getCategyList,
    getTranGoodsInfo: getTranGoodsInfo,
    getTranGoodsInfoTotal: getTranGoodsInfoTotal,
    getSinTranGoodsInfo: getSinTranGoodsInfo,
    getTranGoodsNo: getTranGoodsNo,
    getCategoryNoByLevel: getCategoryNoByLevel,
    saveTranGoodsInfo: saveTranGoodsInfo,
    getpoOrderInfoTotal: getpoOrderInfoTotal,
    getpoOrderInfo: getpoOrderInfo,
    getpoOrderGoods: getpoOrderGoods,
    savepoOrderInfo: savepoOrderInfo,
    savepoOrderGoods: savepoOrderGoods,
    delpoOrderInfo: delpoOrderInfo,
    delpoOrderGoods: delpoOrderGoods,
    updatepoOrderCancel: updatepoOrderCancel,
    saveSellOrderBase: saveSellOrderBase,
    saveSellOrderInfo: saveSellOrderInfo,
    getSellOrderInfoByUUID: getSellOrderInfoByUUID,
    getSellOrderTotal: getSellOrderTotal,
    getSellOrderList: getSellOrderList,
    getSellOrderGoods: getSellOrderGoods,
    updateSellOrderCancel: updateSellOrderCancel
};