var async = require('async');
var lodash = require('lodash');

var Response = require('../../common/Response.js');
var logger = require('../../common/logger.js');
var ErrorCode = require('../../common/errorCode.js').ErrCode;
var httpUtils = require('../../common/httpUtils.js');
var consts = require('../../common/consts.js');
var date = require('../../common/date.js');
var utils = require('../../common/utils.js');

const KEY = consts.jdcfg.appKey;
const SECERT = consts.jdcfg.appSecert;
const VERSION = "2.0";
const URI = "https://api.jd.com/routerjson?";
const QUERYDEPT = "jingdong.eclp.master.queryDept";                 //获取事业部门信息
const TRANGOODSINFO = "jingdong.eclp.goods.transportGoodsInfo";     //添加主商品信息
const ADDPOORDER = "jingdong.eclp.po.addPoOrder";                   //采购入库下单
const CACALPOORDER = "jingdong.eclp.po.cancalPoOrder";              //采购入库单取消
const QUERYPOORDER = "jingdong.eclp.po.queryPoOrder";               //采购入库单详情查询
const QUERYSPSRC = "jingdong.eclp.master.querySpSource";            //销售平台来源
const QUERYSHOP = "jingdong.eclp.master.queryShop";                 //销售店铺信息
const ADDORDER = "jingdong.eclp.order.addOrder";                    //销售出库单下发
const CANCELORDER = "jingdong.eclp.order.cancelOrder";              //销售出库单取消接口
const QUERYORDERSTATUS = "jingdong.eclp.order.queryOrderStatus";    //销售出库单状态查询接口
const QUERYORDER = "jingdong.eclp.order.queryOrder";                //销售出库单明细查询接口
const QUERYSUPPLIER = "jingdong.eclp.master.querySupplier";         //供应商信息
const QUERYWAREHOUSE = "jingdong.eclp.master.queryWarehouse";       //获取仓库信息

var dbMgr = require('../../db/index.js').DBMgr();

dbMgr.init(['jd']);

var jdDB = dbMgr.exec('jd');

/**
 * 获取事业部信息
 * @param req
 * @param res
 * @returns {Promise.<void>}
 */
async function queryDept(req, res) {
    var token = req.session.accessToken;
    var params = {deptNos: ""};
    var uri = getUrl(QUERYDEPT, token, params, true);

    var deptNo = await jdDB.getDeptNo();
    var content = await httpUtils.getWebContent(uri, "GET", null);
    var retData = {};

    retData["rows"] = [];
    retData["results"] = 0;

    if (content) {
        content = getResponseContent(content, QUERYDEPT);

        if (content.code == 0) {
            var saveData = [];
            var deptNos = [];

            if (deptNo && deptNo.length > 0) {
                for (var i = 0; i < deptNo.length; i++) {
                    deptNos.push(deptNo[i].deptNo);
                }
            }

            content = getResult(content, QUERYDEPT);

            for (var i = 0; i < content.length; i++) {
                var cContent = content[i];

                if (deptNos.indexOf(cContent.deptNo) == -1) {
                    saveData.push(cContent);
                }
            }

            if (deptNos.length == 0) {
                saveData = content;
            }

            logger.debug("queryDept saveData: ", saveData);

            if (saveData.length > 0) {
                jdDB.saveDeptInfo(saveData, function (err, data) {
                });
            }

            retData["results"] = content.length;
            retData["rows"] = content;
        }
    }

    Response.respData(retData, res);
};

async function getDeptNo(res) {
    var deptNo = await jdDB.getDeptNo();

    if (deptNo && deptNo.length > 0) {
        Response.respData(deptNo, res);
    } else {
        Response.respData([], res);
    }
}

/**
 * 获取销售平台编号
 * @param req
 * @param res
 * @returns {Promise.<void>}
 */
async function querySpSource(req, res) {
    var token = req.session.accessToken;

    var uri = getUrl(QUERYSPSRC, token, null, true);
    var content = await httpUtils.getWebContent(uri, "GET", null);
    var retData = {};

    retData["rows"] = [];
    retData["results"] = 0;

    if (content) {
        content = getResponseContent(content, QUERYSPSRC);
        //logger.debug("querySpSource data: ", content);

        if (content.code == 0) {
            content = getResult(content, QUERYSPSRC);

            for (var i = 0; i < content.length; i++) {
                retData["rows"].push(content[i]);
            }

            retData["results"] = content.length;
        }
    }

    Response.respData(retData, res);
};

/**
 * 获取店铺信息
 * @param req
 * @param res
 * @returns {Promise.<void>}
 */
async function queryShop(req, res) {
    var token = req.session.accessToken;
    var deptNo = req.query.deptNo;
    var retData = {};

    retData["rows"] = [];
    retData["results"] = 0;

    if (utils.isNull(deptNo)) {
        Response.respData(retData, res);
        return;
    }

    var params = {
        deptNo: deptNo
    };

    var uri = getUrl(QUERYSHOP, token, params, true);
    var content = await httpUtils.getWebContent(uri, "GET", null);

    if (content) {
        content = getResponseContent(content, QUERYSHOP);

        if (content.code == 0) {
            content = getResult(content, QUERYSHOP);

            for (var i = 0; i < content.length; i++) {
                retData["rows"].push(content[i]);
            }

            retData["results"] = content.length;
        }
    }

    Response.respData(retData, res);
}

/**
 * 获取仓库信息
 * @param req
 * @param res
 * @returns {Promise.<void>}
 */
async function queryWarehouse(req, res) {
    var token = req.session.accessToken;
    var deptNo = req.query.deptNo;
    var retData = {};

    retData["rows"] = [];
    retData["results"] = 0;

    if (utils.isNull(deptNo)) {
        Response.respData(retData, res);
        return;
    }

    var params = {
        deptNo: deptNo
    };

    logger.debug("queryWarehouse deptNo: ", deptNo);

    var uri = getUrl(QUERYWAREHOUSE, token, params, true);
    var content = await httpUtils.getWebContent(uri, "GET", null);

    logger.debug('queryWarehouse content: ', content);
    if (content) {
        content = getResponseContent(content, QUERYWAREHOUSE);

        if (content.code == 0) {
            content = getResult(content, QUERYWAREHOUSE);

            for (var i = 0; i < content.length; i++) {
                retData["rows"].push(content[i]);
            }

            retData["results"] = content.length;
        }
    }

    Response.respData(retData, res);
}

/**
 * 获取供应商信息
 * @param req
 * @param res
 * @returns {Promise.<void>}
 */
async function querySupplier(req, res) {
    var token = req.session.accessToken;
    var deptNo = req.query.deptNo;
    var retData = {};

    retData["rows"] = [];
    retData["results"] = 0;

    if (utils.isNull(deptNo)) {
        Response.respData(retData, res);
        return;
    }

    var params = {
        deptNo: deptNo
    };

    logger.debug("querySupplier deptNo: ", deptNo);

    var uri = getUrl(QUERYSUPPLIER, token, params, true);
    var content = await httpUtils.getWebContent(uri, "GET", null);

    logger.debug('querySupplier content: ', content);

    if (content) {
        content = getResponseContent(content, QUERYSUPPLIER);

        if (content.code == 0) {
            content = getResult(content, QUERYSUPPLIER);

            for (var i = 0; i < content.length; i++) {
                retData["rows"].push(content[i]);
            }

            retData["results"] = content.length;
        }
    }

    Response.respData(retData, res);
}

function getISVsrc(res) {
    Response.respData({isv: consts.jdcfg.isvsrc}, res);
}

/**
 * 获取主商品信息
 * @param start
 * @param limit
 * @param res
 */
function getTranGoodsInfo(start, limit, res) {
    var retData = {};

    retData["rows"] = [];
    retData["results"] = 0;

    jdDB.getTranGoodsInfoTotal(function (total) {
        jdDB.getTranGoodsInfo(start, limit, function (err, data) {

            if (data && data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    retData["rows"].push({
                        id: data[i].id,
                        deptNo: data[i].deptNo,
                        isvGoodsNo: data[i].isvGoodsNo,
                        barcodes: data[i].barcodes,
                        thirdCategoryNo: data[i].thirdCategoryNo,
                        goodsNo: data[i].goodsNo,
                        goodsName: data[i].goodsName,
                        spGoodsNo: data[i].spGoodsNo,
                        abbreviation: data[i].abbreviation,
                        brandNo: data[i].brandNo,
                        brandName: data[i].brandName,
                        manufacturer: data[i].manufacturer,
                        produceAddress: data[i].produceAddress,
                        standard: data[i].standard,
                        color: data[i].color,
                        size: data[i].size,
                        sizeDefinition: data[i].sizeDefinition,
                        grossWeight: data[i].grossWeight,
                        color: data[i].color,
                        netWeight: data[i].netWeight
                    });
                }

                retData["results"] = total;
            }

            Response.respData(retData, res);
        });
    });
};

/**
 * 获取单个主商品信息
 * @param id
 * @param res
 */
function getSinTranGoodsInfo(id, res) {
    jdDB.getSinTranGoodsInfo(id, function (err, data) {
        var retData = {};

        if (data && data.length > 0) {
            retData = data[0];
        }

        Response.respData(retData, res);
    });
}

/**
 * 获取事业部商品编号
 * @param res
 */
function getTranGoodsNo(res) {
    jdDB.getTranGoodsNo(function (err, data) {
        Response.respData(data, res);
    });
}

/**
 * 增加主商品信息
 * @param data
 * @param res
 */
async function saveTranGoodsInfo(data, req, res) {
    var postData = {
        deptNo: data.deptNo,
        isvGoodsNo: data.isvGoodsNo,
        spGoodsNo: data.spGoodsNo || "",
        barcodes: data.barcodes,
        thirdCategoryNo: data.thirdCategoryNo,
        goodsName: data.goodsName,
        abbreviation: data.abbreviation || "",
        brandNo: data.brandNo,
        brandName: data.brandName,
        manufacturer: data.manufacturer,
        produceAddress: data.produceAddress,
        standard: data.standard,
        color: data.color,
        size: data.size,
        sizeDefinition: data.sizeDefinition,
        grossWeight: data.grossWeight,
        netWeight: data.netWeight,
        length: data.length,
        width: data.width,
        height: data.height,
        safeDays: data.safeDays,
        instoreThreshold: data.instoreThreshold || 0,
        outstoreThreshold: data.outstoreThreshold || 0,
        serial: data.serial,
        batch: data.batch,
        cheapGift: data.cheapGift,
        quality: data.quality,
        expensive: data.expensive,
        luxury: data.luxury,
        breakable: data.breakable,
        liquid: data.liquid,
        consumables: data.consumables,
        abnormal: data.abnormal,
        imported: data.imported,
        health: data.health,
        temperature: data.temperature,
        temperatureCeil: data.temperatureCeil || '0',
        temperatureFloor: data.temperatureFloor || '0',
        humidity: data.humidity,
        humidityCeil: data.humidityCeil || '0',
        humidityFloor: data.humidityFloor || '0',
        movable: data.movable,
        service3g: data.service3g,
        sample: data.sample,
        odor: data.odor,
        sex: data.sex,
        precious: data.precious,
        mixedBatch: data.mixedBatch
    };

    var token = req.session.accessToken;

    var uri = getUrl(TRANGOODSINFO, token, postData, true);

    var content = await httpUtils.getWebContent(uri, "GET", null);

    logger.debug("saveTranGoodsInfo content: ", content);

    var flag = false;

    if (content) {
        content = getResponseContent(content, TRANGOODSINFO);
        if (content.code == 0) {
            flag = true;
            postData.goodsNo = content.goodsNo;
            jdDB.saveTranGoodsInfo(postData, function (err, data) {
                if (err) {
                    logger.error("saveTranGoodsInfo error: ", err)
                }
                Response.resp(ErrorCode.SUCCESS.msg, res, ErrorCode.SUCCESS.code);
            });
        }
    }

    if (!flag) {
        Response.resp(ErrorCode.FAIL.msg, res, ErrorCode.FAIL.code);
    }

};

/**
 * 获取商品层级类别
 * @param req
 * @param res
 */
function getCategyList(res) {
    jdDB.getCategyList(function (err, categyData) {
        var data = [{cname: 'root', id: '0', cnumber: '0', level: '1', expanded: true}];

        data[0]["children"] = [];

        if (data && data.length > 0) {
            data[0]["children"] = makeCategy(categyData, 0);
        }
        Response.respData(data, res);
    });
}

/**
 * 生成层级数据
 * @param data
 */
function makeCategy(data) {
    var map = {};

    data.forEach(function (item) {
        map[item.cnumber] = item;
    });

    var ret = [];

    data.forEach(function (item) {
        var parent = map[item.fnumber];

        if (parent) {
            parent.children = parent.children || [];
            parent.children.push(item);
        } else {
            ret.push(item);
        }
    });

    return ret;
};

/**
 * 保存新的层级
 * @param fnumber
 * @param cname
 * @param cnumber
 * @param res
 */
function saveCategy(fnumber, cname, cnumber, level, res) {
    jdDB.getCategyByNumber(cnumber, function (err, data) {
        if (data && data.length > 0) {
            Response.resp(ErrorCode.REPEAT.msg, res, ErrorCode.REPEAT.code);
        } else {
            jdDB.saveCategy(fnumber, cname, cnumber, level - 1, function (err, ret) {       //前端默认有一个root的level为1，实际level要减1
                Response.resp(ErrorCode.SUCCESS.msg, res, ErrorCode.SUCCESS.code);
            });
        }
    });
};

/**
 * 获取层级根据深度等级
 * @param level
 * @param res
 */
function getCategoryNoByLevel(level, res) {
    jdDB.getCategoryNoByLevel(level, function (err, data) {
        var retData = [];
        if (data && data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                retData.push(data[i]);
            }
        }
        Response.respData(retData, res);
    });
};

/**
 * 采购入库单下发
 * @param data
 * @param res
 */
async function savepoOrderInfo(data, records, req, res) {
    var postData = {};

    for (var id in data) {
        if (!utils.isNull(data[id])) {
            postData[id] = data[id];
        }
    }

    logger.debug("savepoOrderInfo postData: ", postData);

    var token = req.session.accessToken;

    var uri = getUrl(ADDPOORDER, token, postData, true);

    var content = await httpUtils.getWebContent(uri, "GET", null);

    logger.debug("savepoOrderInfo content: ", content);

    var flag = false;

    if (content) {
        if (content.error_response) {
            Response.resp(content.error_response.zh_desc || ErrorCode.FAIL.msg, res, ErrorCode.FAIL.code);
            return ;
        }

        content = getResponseContent(content, ADDPOORDER);
        if (content.code == 0) {
            flag = true;
            postData.poOrderNo = content.poOrderNo;
            postData.iscancel = 0;

            delete(postData.boxNo);
            delete(postData.boxGoodsNo);
            delete(postData.boxGoodsQty);
            delete(postData.boxSerialNo);
            delete(postData.deptGoodsNo);
            delete(postData.numApplication);
            delete(postData.goodsStatus);
            delete(postData.barCodeType);
            delete(postData.sidCheckout);

            logger.debug("savepoOrderInfo postData: ", postData);

            jdDB.getpoOrderGoods([postData.poOrderNo], function(err, order) {
                if (order && order.length > 0) {
                    Response.resp(ErrorCode.REPEAT.msg, res, ErrorCode.REPEAT.code);
                } else {
                    jdDB.savepoOrderInfo(postData, function (err, data) {
                        if (err) {
                            logger.error("savepoOrderInfo error: ", err);
                        }
                        if (!utils.isNull(records) && records.length > 0) {
                            var objRecord = JSON.parse(records);
                            for(var i = 0; i < objRecord.length;i++) {
                                objRecord[i].poOrderNo = content.poOrderNo;
                            }
                            async.each(objRecord, function (item, cb) {
                                jdDB.savepoOrderGoods(item, function (err, goodData) {
                                    cb();
                                });
                            }, function (err) {
                                Response.resp(ErrorCode.SUCCESS.msg, res, ErrorCode.SUCCESS.code);
                            });
                        }
                    });
                }
            });
        }
    }

    if (!flag) {
        Response.resp(ErrorCode.FAIL.msg, res, ErrorCode.FAIL.code);
    }
};

/**
 * 采购入库单取消
 * @param ids
 * @param req
 * @param res
 */
async function cancelpoOrderInfo(ids, req, res) {
    var token = req.session.accessToken;
    var sucIds = [];

    logger.debug("cancelpoOrderInfo: ", ids);

    ids = JSON.parse(ids);

    for (var i = 0; i < ids.length; i++) {
        var uri = getUrl(CACALPOORDER, token, {poOrderNo : ids[i]}, true);
        var content = await httpUtils.getWebContent(uri, "GET", null);

        logger.debug("cancelpoOrderInfo content: ", content);

        if (content) {
            content = getResponseContent(content, CACALPOORDER);

            if (content.code == 0) {
                sucIds.push(ids[i]);
            }
        }
    }

    if (sucIds.length > 0) {
        jdDB.updatepoOrderCancel(ids, function(err, data) {
            Response.resp(ErrorCode.SUCCESS.msg, res, ErrorCode.SUCCESS.code);
        });
       /* jdDB.delpoOrderInfo(ids, function(err, order) {
            jdDB.delpoOrderGoods(ids, function(err, data) {
                Response.resp(ErrorCode.SUCCESS.msg, res, ErrorCode.SUCCESS.code);
            })
        });*/
    } else {
        Response.resp(ErrorCode.FAIL.msg, res, ErrorCode.FAIL.code);
    }

};

/**
 * 获取采购入库单记录
 * @param start
 * @param limit
 * @param res
 */
function getpoOrderInfo(status, start, limit, res) {
    var retData = {};

    retData["rows"] = [];
    retData["results"] = 0;

    jdDB.getpoOrderInfoTotal(status, function (err, total) {
        jdDB.getpoOrderInfo(status, start, limit, function (err, data) {

            if (data && data.length > 0) {
                var poOrderNo = [];
                for (var i = 0; i < data.length; i++) {
                    poOrderNo.push(data[i].poOrderNo);
                }

                jdDB.getpoOrderGoods(poOrderNo, function(err, goodsData) {
                    if (goodsData && goodsData.length > 0) {
                        var tmp = [];
                        for (var i = 0; i < data.length; i++) {
                            for (var j = 0; j < goodsData.length; j++) {
                                if (data[i].poOrderNo != goodsData[j].poOrderNo) {
                                    continue;
                                }
                                if (tmp.indexOf(goodsData[j].id) != -1) {
                                    continue;
                                }
                                tmp.push(goodsData[j].id);
                                data[i]["records"] = data[i]["records"] || [];
                                data[i]["records"].push(goodsData[j]);
                            }
                            retData["rows"].push(data[i]);
                        }
                    } else {
                        for (var i = 0; i< data.length; i++) {
                            retData["rows"].push(data[i]);
                        }
                    }
                    retData["results"] = total;
                    Response.respData(retData, res);
                });
            } else {
                Response.respData(retData, res);
            }
        });
    });
};

/**
 * 获取采购入库单详情
 * @param opOrderNo
 * @param token
 * @param res
 */
async function getOpOrderInfo(opOrderNo, token, res) {

    var uri = getUrl(QUERYPOORDER, token, {poOrderNo: opOrderNo}, true);
    var content = await httpUtils.getWebContent(uri, "GET", null);

    logger.debug("getOpOrderInfo content: ", JSON.stringify(content));

    var retData = {};


    if (content) {
        content = getResponseContent(content, QUERYPOORDER);

        if (content.code == 0) {
            var rows = [];
            var result = 0;

            content = content.queryPoModelList;

            for (var i = 0; i < content.length; i++) {
                var records = content[i].poItemModelList;

                rows.push({
                    createTime: content[i].createTime,
                    supplierNo: content[i].supplierNo,
                    deptNo: content[i].deptNo,
                    isvPoOrderNo: content[i].isvPoOrderNo,
                    poOrderNo: content[i].poOrderNo,
                    poOrderStatus: content[i].poOrderStatus,
                    whNo: content[i].whNo,
                    createUser: content[i].createUser,
                    records: records
                });
            }

            retData.rows = rows;
            retData.results = result;
        }
    }

    Response.respData(retData, res);
};

/**
 * 销售出库单下发
 * @param data
 * @param req
 * @param res
 */
function saveSellOrderInfo(data, records, req, res) {
    var postData = {};

    for (var id in data) {
        if (!utils.isNull(data[id])) {
            postData[id] = data[id];
        }
    }

    logger.debug("saveSellOrderInfo postData: ", postData);
    logger.debug("saveSellOrderInfo records: ", records);

    jdDB.getSellOrderInfoByUUID(postData.isvUUID, async function (err, data) {
        if (data && data.length > 0) {
            Response.resp(ErrorCode.REPEAT.msg, res, ErrorCode.REPEAT.code);
        } else {
            var token = req.session.accessToken;

            var uri = getUrl(ADDORDER, token, postData, true);

            var content = await httpUtils.getWebContent(uri, "GET", null);

            logger.debug("saveSellOrderInfo content: ", content);

            var flag = false;

            if (content) {
                if (content.error_response) {
                    Response.resp(content.error_response.zh_desc || ErrorCode.FAIL.msg, res, ErrorCode.FAIL.code);
                    return ;
                }

                content = getResponseContent(content, ADDORDER);
                if (content.code && content.code == 0) {
                    flag = true;

                    postData.eclpSoNo = content.eclpSoNo;
                    postData.iscancel = 0;

                    delete(postData.goodsNo);
                    delete(postData.goodsName);
                    delete(postData.type);
                    delete(postData.unit);
                    delete(postData.remark);
                    delete(postData.rate);
                    delete(postData.amount);
                    delete(postData.price);
                    delete(postData.quantity);
                    delete(postData.pAttributes);

                    jdDB.saveSellOrderBase(postData, function (err, data) {
                        if (err) {
                            logger.error("saveSellOrderBase error: ", err)
                        }
                        if (!utils.isNull(records) && records.length > 0) {
                            var objRecord = JSON.parse(records);
                            for (var i = 0; i < objRecord.length; i++) {
                                objRecord[i].isvUUID = postData.isvUUID;
                            }
                             async.each(objRecord, function (item, cb) {
                                jdDB.saveSellOrderInfo(item, function (err, goodData) {
                                    if (err) {
                                        logger.error("saveSellOrderInfo error: ", err)
                                    }
                                    cb();
                                });
                            }, function (err) {
                                Response.resp(ErrorCode.SUCCESS.msg, res, ErrorCode.SUCCESS.code);
                            });
                        }

                    });
                }
            }

            if (!flag) {
                Response.resp(ErrorCode.FAIL.msg, res, ErrorCode.FAIL.code);
            }
        }
    });
};

function getSellOrderInfo(status, start, limit, res) {
    var retData = {};

    retData["rows"] = [];
    retData["results"] = 0;

    jdDB.getSellOrderTotal(status, function (total) {
        jdDB.getSellOrderList(status, start, limit, function (err, data) {
            if (data && data.length > 0) {
                var isvUUID = [];

                for (var i = 0; i < data.length; i++) {
                    isvUUID.push(data[i].isvUUID);
                }

                jdDB.getSellOrderGoods(isvUUID, function(err, goodsData) {
                    if (goodsData && goodsData.length > 0) {
                        var tmp = [];
                        for (var i = 0; i < data.length; i++) {
                            for (var j = 0; j < goodsData.length; j++) {
                                if (data[i].isvUUID != goodsData[j].isvUUID) {
                                    continue;
                                }
                                if (tmp.indexOf(goodsData[j].id) != -1) {
                                    continue;
                                }
                                tmp.push(goodsData[j].id);
                                data[i]["records"] = data[i]["records"] || [];
                                data[i]["records"].push(goodsData[j]);
                            }
                            retData["rows"].push(data[i]);
                        }
                    } else {
                        for (var i = 0; i< data.length; i++) {
                            retData["rows"].push(data[i]);
                        }
                    }

                    retData["results"] = total;
                    Response.respData(retData, res);
                });
            } else {
                Response.respData(retData, res);
            }
        });
    });
}

/**
 * 销售出库单取消
 * @param isvUUIDs
 * @param req
 * @param res
 */
async function cancelSellOrderInfo(ids, req, res) {
    var token = req.session.accessToken;

    var sucIds = [];

    logger.debug("cancelpoOrderInfo: ", ids);

    ids = JSON.parse(ids);

    for (var i = 0; i < ids.length; i++) {
        var uri = getUrl(CANCELORDER, token, {eclpSoNo: ids[i]}, true);
        var content = await httpUtils.getWebContent(uri, "GET", null);

        logger.debug("cancelpoOrderInfo content: ", content);

        if (content) {
            content = getResponseContent(content, CANCELORDER);

            if (content.code == 0) {
                sucIds.push(ids[i]);
            }
        }
    }

    if (sucIds.length > 0) {
        jdDB.updateSellOrderCancel(ids, function(err, data) {
            Response.resp(ErrorCode.SUCCESS.msg, res, ErrorCode.SUCCESS.code);
        });
    } else {
        Response.resp(ErrorCode.FAIL.msg, res, ErrorCode.FAIL.code);
    }

};

function getUrl(method, accessToken, appParams, pFlag) {
    var timestamp = date.Format("yyyy-MM-dd HH:mm:ss");

    appParams = appParams || {};

    var params = Object.assign({}, {
        "method": utf8Code(method),
        "timestamp": timestamp,
        "v": utf8Code(VERSION),
        "app_key": utf8Code(KEY),
        "access_token": accessToken
    });

    if (pFlag) {
        params["360buy_param_json"] = JSON.stringify(appParams);
    }

    var sign = getSign(params);
    var url = URI + utils.toQueryString(params) + "&sign=" + sign;

    logger.debug("uri: ", url);

    return url;
}

function utf8Code(str) {
    return utils.encodeCode(str, 'utf8');
};

function getSign(appParams) {
    appParams = Object.assign({}, appParams);

    var sortStr = utils.toQueryString(appParams);

    sortStr = SECERT + sortStr + SECERT;

    return utils.md5(sortStr, true);
};

function getResponseContent(content, key) {
    var split = key.split(".");

    split.push("responce");

    var newKey = split.join("_");

    return content[newKey];
}

function getResult(content, key) {
    var split = key.split(".");

    var newKey = split[split.length - 1].toLowerCase();

    newKey += "_result";

    return content[newKey];
};

exports.queryDept = queryDept;
exports.getDeptNo = getDeptNo;
exports.querySupplier = querySupplier;
exports.getCategyList = getCategyList;
exports.saveCategy = saveCategy;
exports.getTranGoodsInfo = getTranGoodsInfo;
exports.getSinTranGoodsInfo = getSinTranGoodsInfo;
exports.getTranGoodsNo = getTranGoodsNo;
exports.getCategoryNoByLevel = getCategoryNoByLevel;
exports.saveTranGoodsInfo = saveTranGoodsInfo;
exports.savepoOrderInfo = savepoOrderInfo;
exports.cancelpoOrderInfo = cancelpoOrderInfo;
exports.getpoOrderInfo = getpoOrderInfo;
exports.getOpOrderInfo = getOpOrderInfo;
exports.querySpSource = querySpSource;
exports.queryShop = queryShop;
exports.queryWarehouse = queryWarehouse;
exports.getISVsrc = getISVsrc;
exports.saveSellOrderInfo = saveSellOrderInfo;
exports.getSellOrderInfo = getSellOrderInfo;
exports.cancelSellOrderInfo = cancelSellOrderInfo;
