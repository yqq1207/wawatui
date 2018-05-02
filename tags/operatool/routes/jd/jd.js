var express = require('express');
var router = express.Router();

var lodash = require('lodash');
var logic = require('./logic.js');
var utils = require('../../common/utils.js');
var Response = require('../../common/Response.js');
var logger = require('../../common/logger.js');

var ErrorCode = require('../../common/errorCode.js').ErrCode;

/**
 * 获取事业部信息
 */
router.get('/queryDept', function(req, res, next) {
    logic.queryDept(req, res);
});

router.get('/getDeptNo', function(req, res) {
    logic.getDeptNo(res);
});

/**
 * 获取销售平台来源
 */
router.get('/querySpSource', function(req, res) {
    logic.querySpSource(req, res);
});

/**
 * 获取店铺编号
 */
router.get('/queryShop', function(req, res) {
    logic.queryShop(req, res);
});

/**
 * 获取仓库信息
 */
router.get('/queryWarehouse', function(req, res) {
    logic.queryWarehouse(req, res);
});

/**
 * 获取供应商信息
 */
router.get('/querySupplier', function(req, res) {
    var deptNo = req.query.deptNo;

    if (utils.isNull(deptNo)) {
        Response.resp(ErrorCode.WRONGPARAMS.msg, res, ErrorCode.WRONGPARAMS.code);
        return ;
    }

    logic.querySupplier(req, res);
});

/**
 * 获取ISV来源编号
 */
router.get('/getISVsrc', function(req, res) {
    logic.getISVsrc(res);
});

/**
 * 获取主商品信息
 */
router.get('/getTranGoodsInfo', function(req, res, next) {
    var start = req.query.start;
    var limit = req.query.limit;
    logic.getTranGoodsInfo(start, limit, res);
});

/**
 * 获取单个主商品信息
 */
router.get('/getSinTranGoodsInfo', function(req, res) {
    var id = req.query.id;

    if (utils.isNull(id)) {
        Response.resp(ErrorCode.WRONGPARAMS.msg, res, ErrorCode.WRONGPARAMS.code);
        return ;
    }

    logic.getSinTranGoodsInfo(id, res);
});

/**
 * 获取事业部商品编号
 */
router.get('/getTranGoodsNo', function(req ,res) {
    logic.getTranGoodsNo(res);
});

/**
 * 保存主物品信息
 */
router.post('/saveTranGoodsInfo', function(req, res) {
    var data = req.body;

    if (!data ||
        utils.isNull(data.isvGoodsNo) ||
        utils.isNull(data.barcodes) ||
        utils.isNull(data.goodsName) ||
        utils.isNull(data.thirdCategoryNo) ||
        utils.isNull(data.deptNo) ||
        utils.isNull(data.safeDays)) {
        Response.resp(ErrorCode.WRONGPARAMS.msg, res, ErrorCode.WRONGPARAMS.code);
        return ;
    }

    logic.saveTranGoodsInfo(data, req, res);
});

/**
 * 获取商品层级类别
 */
router.get('/getCategyList', function(req, res, next) {
    logic.getCategyList(res);
});

/**
 * 保存层级类别
 */
router.post('/saveCategy', function(req, res, next) {
    var f_number = req.body.fnumber;
    var cname = req.body.cname;
    var cnumber = req.body.cnumber;
    var level = req.body.level;

    if (utils.isNull(f_number) || utils.isNull(cname) || utils.isNull(cnumber) || utils.isNull(level)) {
        Response.resp(ErrorCode.WRONGPARAMS.msg, res, ErrorCode.WRONGPARAMS.code);
        return ;
    }

    logic.saveCategy(f_number, cname, cnumber, level, res);
});

/**
 * 获取层级根据深度等级
 */
router.get('/getCategoryNoByLevel', function(req, res) {
    var level = req.query.level;

    if (utils.isNull(level)) {
        Response.resp(ErrorCode.WRONGPARAMS.msg, res, ErrorCode.WRONGPARAMS.code);
        return ;
    }
    logic.getCategoryNoByLevel(level, res);
});

/**
 * 采购入库单下发
 */
router.post('/savepoOrderInfo', function(req, res) {
    var data = req.body;
    var postData = makeParams(data);

    if (!postData ||
        utils.isNull(postData.spPoOrderNo) ||
        utils.isNull(postData.deptNo) ||
        utils.isNull(postData.supplierNo) ||
        utils.isNull(postData.whNo) ||
        utils.isNull(postData.numApplication) ||
        utils.isNull(postData.goodsStatus) ||
        utils.isNull(postData.deptGoodsNo)) {
        Response.resp(ErrorCode.WRONGPARAMS.msg, res, ErrorCode.WRONGPARAMS.code);
        return ;
    };

    logic.savepoOrderInfo(postData, data.records, req, res);
});

/**
 * 采购入库单取消
 */
router.post('/cancelpoOrderInfo', function(req, res) {
    var ids = req.body.ids;
    if (utils.isNull(ids)) {
        Response.resp(ErrorCode.WRONGPARAMS.msg, res, ErrorCode.WRONGPARAMS.code);
        return ;
    }

    logic.cancelpoOrderInfo(ids, req, res);
});

/**
 * 获取入库单记录
 */
router.get('/getpoOrderInfo', function(req, res) {
    var start = req.query.start;
    var limit = req.query.limit;
    logic.getpoOrderInfo(0, start, limit, res);
});

/**
 * 获取入库单记录
 */
router.get('/getcpoOrderInfo', function(req, res) {
    var start = req.query.start;
    var limit = req.query.limit;
    logic.getpoOrderInfo(1, start, limit, res);
});

/**
 * 获取采购入库单详情
 */
router.get('/getOpOrderInfo', function(req, res) {
    var opOrderNo = req.query.poOrderNo;
    var token = req.session.accessToken;

    if (utils.isNull(opOrderNo)) {
        Response.resp(ErrorCode.WRONGPARAMS.msg, res, ErrorCode.WRONGPARAMS.code);
        return ;
    }

    logic.getOpOrderInfo(opOrderNo, token, res);
});

/**
 * 销售出库单下发
 */
router.post('/saveSellOrderInfo', function(req, res) {
    var data = req.body;

    var postData = makeParams(data);

    if (!postData ||
        utils.isNull(postData.isvUUID) ||
        utils.isNull(postData.isvSource) ||
        utils.isNull(postData.shopNo) ||
        utils.isNull(postData.departmentNo) ||
        utils.isNull(postData.salePlatformSource) ||
        utils.isNull(postData.consigneeName) ||
        utils.isNull(postData.orderMark) ||
        utils.isNull(postData.consigneeMobile) ||
        utils.isNull(postData.consigneeAddress)) {
        Response.resp(ErrorCode.WRONGPARAMS.msg, res, ErrorCode.WRONGPARAMS.code);
        return ;
    }

    if (postData.salePlatformSource == 1 && utils.isNull(postData.salesPlatformOrderNo)) {
        Response.resp(ErrorCode.WRONGPARAMS.msg, res, ErrorCode.WRONGPARAMS.code);
        return ;
    }

    logic.saveSellOrderInfo(postData, data.records, req, res);
});

/**
 * 销售出库单获取
 */
router.get('/getSellOrderInfo', function(req ,res) {
    var start = req.query.start;
    var limit = req.query.limit;

    logic.getSellOrderInfo(0, start, limit, res);
});

/**
 * 销售已取消出库单获取
 */
router.get('/getcSellOrderInfo', function(req ,res) {
    var start = req.query.start;
    var limit = req.query.limit;

    logic.getSellOrderInfo(1, start, limit, res);
});

/**
 * 销售出库单取消
 */
router.post('/cancelSellOrderInfo', function(req, res) {
    var ids = req.body.ids;
    if (utils.isNull(ids)) {
        Response.resp(ErrorCode.WRONGPARAMS.msg, res, ErrorCode.WRONGPARAMS.code);
        return ;
    }

    logic.cancelSellOrderInfo(ids, req, res);
});

/**
 * 将字符串参数转为对象参数
 * @param data{base:"",records:{[],[]}}
 * @returns {{}}
 */
function makeParams(data) {
    var base = [];
    var postData = {};

    var init = "";


    base = data.base.split("&");

    for(var i = 0; i < base.length; i++) {
        var child = base[i].split("=");

        postData[child[0]] = child[1];
    }

    postData = Object.assign({}, postData);

    var records = JSON.parse(data.records);
    var copyRecords = lodash.cloneDeep(records);
    var recordData = copyRecords[0];

    for(var id in recordData) {
        recordData[id] = [];
    }

    for(var i = 0; i < records.length; i++) {
        var child = records[i];
        for(var id in child) {
            recordData[id].push(child[id] || init);
        }
    }

    for (var id in recordData) {
        recordData[id] = recordData[id].join(",");
    }


    postData = Object.assign(postData, recordData);

    return postData;
}

module.exports = router;