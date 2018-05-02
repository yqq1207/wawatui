var express = require('express');
var router = express.Router();
var xlsx = require('node-xlsx');
var upload = require('multer')({ dest: 'uploads/' });
var logic = require('./logic.js');
var logger = require('../../common/logger.js');
var consts = require('../../common/consts.js');
var utils = require('../../common/utils.js');

var Response = require('../../common/Response.js');
var ErrorCode = require('../../common/errorCode.js').ErrCode;

router.get('/', function (req, res) {
    res.render('index', {title: '提取娃娃订单处理'});
});

router.get('/getAllPetSum', function (req, res) {
    var time = req.query.time;

    if (!time) {
        time = Math.floor(Date.now() / 1000);
    }
    MysqlAPI.getAllPetSum(time, function (err, data) {
        if (data && utils.isArray(data)) {
            Response.respData(data[0], res);
        } else {
            Response.respData(0, res);
        }
    });
});

router.get('/exportOrder', function (req, res) {
    var startDate = req.query.sdate;
    var endDate = req.query.edate;
    var type = req.query.type;

    if (utils.isNull(startDate) || utils.isNull(endDate) || utils.isNull(type)) {
        Response.resp(ErrorCode.WRONGPARAMS.msg, res, ErrorCode.WRONGPARAMS.code);
        return;
    }

    if (endDate < startDate) {
        Response.resp(ErrorCode.WRONGPARAMS.msg, res, ErrorCode.WRONGPARAMS.code);
        return;
    }

    var startSec = 0;
    var endSec = 0;

    startSec = (new Date(startDate).getTime() / 1000);
    endSec = (new Date(endDate) / 1000);

    /*
    startDate = new Date(startDate);
    startDate.setHours(0);
    startDate.setMinutes(0);
    startDate.setSeconds(0);

    endDate = new Date(endDate);
    endDate.setHours(0);
    endDate.setMinutes(0);
    endDate.setSeconds(0);

    startSec = Math.floor(startDate.getTime() / 1000);
    endSec = Math.floor(endDate.getTime() / 1000);*/

    //导出不需要区别类型
    type = null;

    logic.exportOrder(startSec, endSec, type, res);

});

/**
 * 导入订单
 */
router.post('/importOrder', upload.single('order-upload'), function(req, res) {
    if (!req.file) {
        Response.resp(ErrorCode.WRONGPARAMS.msg, res, ErrorCode.WRONGPARAMS.code);
        return;
    }

    console.log('====================================================');
    console.log('fieldname: ' + req.file.fieldname);
    console.log('originalname: ' + req.file.originalname);
    console.log('encoding: ' + req.file.encoding);
    console.log('mimetype: ' + req.file.mimetype);
    console.log('size: ' + (req.file.size / 1024).toFixed(2) + 'KB');
    console.log('destination: ' + req.file.destination);
    console.log('filename: ' + req.file.filename);
    console.log('path: ' + req.file.path);
    console.log('importType: ' + req.body.type);

   /* let oldPath = req.file.path;
    let newPath = 'uploads/' + req.file.originalname;
    fs.rename(oldPath, newPath, (err) => {
        if (err) {
            res.json({ ok: false });
            console.log(err);
        } else {
            res.json({ ok: true });
        }
    });*/

   let type = req.body.type || 2;
   let startDate = req.body.startDate;
   let endDate = req.body.endDate;
   let name = req.file.path;
   let startSec = 0;
   let endSec = 0;

   if (type == 2) {
       if (!startDate || !endDate){
           Response.resp(ErrorCode.WRONGPARAMS.msg, res, ErrorCode.WRONGPARAMS.code);
           return;
       }

       if (endDate <startDate) {
           Response.resp(ErrorCode.WRONGPARAMS.msg, res, ErrorCode.WRONGPARAMS.code);
           return;
       }

       startDate = new Date(startDate);
       startDate.setHours(0);
       startDate.setMinutes(0);
       startDate.setSeconds(0);

       endDate = new Date(endDate);
       endDate.setHours(0);
       endDate.setMinutes(0);
       endDate.setSeconds(0);

       startSec = Math.floor(startDate.getTime() / 1000);
       endSec = Math.floor(endDate.getTime() / 1000);
   }

   logic.handlerOrder(name, type, startSec, endSec, res);
});

/**
 * 已完成订单
 */
router.get('/getOrderY', function (req, res) {
    var start = req.query.start;
    var limit = req.query.limit;
    var pageIndex = req.query.pageIndex;
    var startDate = req.query.startDate;
    var endDate = req.query.endDate;

    var startSec = 0;
    var endSec = 0;
    startSec = (new Date(startDate).getTime() / 1000);
    endSec = (new Date(endDate) / 1000);
    /*startDate = new Date(startDate);
    startDate.setHours(0);
    startDate.setMinutes(0);
    startDate.setSeconds(0);

    endDate = new Date(endDate);
    endDate.setHours(0);
    endDate.setMinutes(0);
    endDate.setSeconds(0);

    startSec = Math.floor(startDate.getTime() / 1000);
    endSec = Math.floor(endDate.getTime() / 1000);*/

    logic.getOrder(consts.orderState.YES, start, limit, startSec, endSec, res);
});

/**
 * 未完成订单
 */
router.get('/getOrderN', function (req, res) {
    var start = req.query.start;
    var limit = req.query.limit;
    var pageIndex = req.query.pageIndex;
    var startDate = req.query.startDate;
    var endDate = req.query.endDate;

    if (!start || !limit) {
        Response.resp(ErrorCode.WRONGPARAMS.msg, res, ErrorCode.WRONGPARAMS.code);
        return;
    }

    var startSec = 0;
    var endSec = 0;

    startSec = (new Date(startDate).getTime() / 1000);
    endSec = (new Date(endDate) / 1000);
    /*
        startDate = new Date(startDate);
        startDate.setHours(0);
        startDate.setMinutes(0);
        startDate.setSeconds(0);

        endDate = new Date(endDate);
        endDate.setHours(0);
        endDate.setMinutes(0);
        endDate.setSeconds(0);

        startSec = Math.floor(startDate.getTime() / 1000);
        endSec = Math.floor(endDate.getTime() / 1000);*/

    logic.getOrder(consts.orderState.NO, start, limit, startSec, endSec, res);
});

/**
 * 未完成订单
 */
router.get('/getOrderS', function (req, res) {
    var start = req.query.start;
    var limit = req.query.limit;
    var pageIndex = req.query.pageIndex;
    var startDate = req.query.startDate;
    var endDate = req.query.endDate;

    if (!start || !limit) {
        Response.resp(ErrorCode.WRONGPARAMS.msg, res, ErrorCode.WRONGPARAMS.code);
        return;
    }

    var startSec = 0;
    var endSec = 0;
    startSec = (new Date(startDate).getTime() / 1000);
    endSec = (new Date(endDate) / 1000);
    /*startDate = new Date(startDate);
    startDate.setHours(0);
    startDate.setMinutes(0);
    startDate.setSeconds(0);

    endDate = new Date(endDate);
    endDate.setHours(0);
    endDate.setMinutes(0);
    endDate.setSeconds(0);

    startSec = Math.floor(startDate.getTime() / 1000);
    endSec = Math.floor(endDate.getTime() / 1000);*/


    logic.getOrder(consts.orderState.SIGN, start, limit, startSec, endSec, res);
});

/**
 * 订单详情
 */
router.get('/getOrderGoods', function (req, res) {
    var orderStr = req.query.orderStr;

    if (!orderStr) {
        Response.resp(ErrorCode.WRONGPARAMS.msg, res, ErrorCode.WRONGPARAMS.code);
        return;
    }
    logic.getOrderPet(orderStr, res);
});

/**
 * 审核订单
 */
router.post('/checkOrder', function (req, res) {
    logic.checkOrder(req.body, res)
});

/**
 * 按时间标记订单
 */
router.post('/checkOrderByDate', function(req, res, next) {
    var startDate = req.body.startDate;
    var endDate = req.body.endDate;
    var type = req.body.type;

    if (!startDate || !endDate){
        Response.resp(ErrorCode.WRONGPARAMS.msg, res, ErrorCode.WRONGPARAMS.code);
        return;
    }

    if (endDate <startDate) {
        Response.resp(ErrorCode.WRONGPARAMS.msg, res, ErrorCode.WRONGPARAMS.code);
        return;
    }

    var startSec = 0;
    var endSec = 0;

    startSec = (new Date(startDate).getTime() / 1000);
    endSec = (new Date(endDate) / 1000);
/*

    startDate = new Date(startDate);
    startDate.setHours(0);
    startDate.setMinutes(0);
    startDate.setSeconds(0);

    endDate = new Date(endDate);
    endDate.setHours(0);
    endDate.setMinutes(0);
    endDate.setSeconds(0);

    startSec = Math.floor(startDate.getTime() / 1000);
    endSec = Math.floor(endDate.getTime() / 1000);
*/

    logic.checkOrderByDate(startSec, endSec, type, res);
});

/**
 * 直接完成
 */
router.post('/redirectFinish', function(req, res, next) {
    var order = req.body.orderStr;

    if (!order) {
        Response.resp(ErrorCode.WRONGPARAMS.msg, res, ErrorCode.WRONGPARAMS.code);
        return;
    }

    logic.redirectFinish(order, res);
});

/**
 * 导出明细表
 */
router.get('/exportDetail', function(req,res, next) {
    var startDate = req.query.sdate;
    var endDate = req.query.edate;

    if (utils.isNull(startDate) || utils.isNull(endDate)) {
        Response.resp(ErrorCode.WRONGPARAMS.msg, res, ErrorCode.WRONGPARAMS.code);
        return;
    }

    if (endDate < startDate) {
        Response.resp(ErrorCode.WRONGPARAMS.msg, res, ErrorCode.WRONGPARAMS.code);
        return;
    }

    startDate = new Date(startDate);
    startDate.setHours(0);
    startDate.setMinutes(0);
    startDate.setSeconds(0);

    endDate = new Date(endDate);
    endDate.setHours(0);
    endDate.setMinutes(0);
    endDate.setSeconds(0);

    var startSec = Math.floor(startDate.getTime() / 1000);
    var endSec = Math.floor(endDate.getTime() / 1000);

    logic.exportDetail(startSec, endSec, res);
});

/**
 * 订单核查
 */
router.get('/getReviewOrder', function(req, res, next) {
    var startDate = req.query.startDate;
    var endDate = req.query.endDate;

    startDate = new Date(startDate);
    startDate.setHours(0);
    startDate.setMinutes(0);
    startDate.setSeconds(0);

    endDate = new Date(endDate);
    endDate.setHours(0);
    endDate.setMinutes(0);
    endDate.setSeconds(0);

    var startSec = Math.floor(startDate.getTime() / 1000);
    var endSec = Math.floor(endDate.getTime() / 1000);

    logic.getReviewOrder(startSec, endSec, res);
});

/**
 * 导出订单核查结果
 */
router.get('/exportCheckOrder', function(req, res, next) {
    var startDate = req.query.sdate;
    var endDate = req.query.edate;

    startDate = new Date(startDate);
    startDate.setHours(0);
    startDate.setMinutes(0);
    startDate.setSeconds(0);

    endDate = new Date(endDate);
    endDate.setHours(0);
    endDate.setMinutes(0);
    endDate.setSeconds(0);

    var startSec = Math.floor(startDate.getTime() / 1000);
    var endSec = Math.floor(endDate.getTime() / 1000);

    logic.exportCheckOrder(startSec, endSec, res);
});

module.exports = router;