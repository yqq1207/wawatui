var async = require('async');
var nodexlsx = require('node-xlsx');
var XLSX = require('xlsx');
var fs = require('fs');

var MongoAPI = require('../../db/MongoAPI.js');
var Response = require('../../common/Response.js');
var logger = require('../../common/logger.js');
var ErrorCode = require('../../common/errorCode.js').ErrCode;
var utils = require('../../common/utils.js');
var date = require('../../common/date.js');
var config = require('../../config/config.js');
var consts = require('../../common/consts.js');
var tencentMsg = require('../../common/sendTenxunMessage.js');
var tempMsg = require('../../common/sendTempPlateMessage.js');

var dbMgr = require('../../db/index.js').DBMgr();

dbMgr.init(['order']);

var orderDB = dbMgr.exec('order');

function getOrder(state, start, limit, startTime, endTime, res) {
    orderDB.selectTotalOrder(state, startTime, endTime, function (err, totalRow) {
        orderDB.selectOrder(state, start, limit, startTime, endTime, function (err, data) {
            if (err) {
                logger.error("/getOrder", err);
                Response.resp(err, res, ErrorCode.UNKONW.code);
                return;
            }
            var retData = {};
            var orderInfo = [];
            if (data && utils.isArray(data)) {
                //mysql查出的数据是RowDataPackaget格式，须转换
                for (var i = 0; i < data.length; i++) {
                    var orderTime = null;
                    var checkTime = null;

                    if (data[i].getTime != 0) {
                        date.setExtraTimeStampSec(data[i].getTime);
                        orderTime = date.Format("yyyy-MM-dd HH:mm");
                    }

                    if (data[i].checktime != 0) {
                        date.setExtraTimeStampSec(data[i].checktime);
                        checkTime = date.Format("yyyy-MM-dd HH:mm");
                    }

                    date.setExtraTimeStampSec(data[i].checktime);
                    orderInfo.push({
                        ID: data[i].Id,
                        orderStr: data[i].orderStr,
                        userId: data[i].userId,
                        userName: data[i].userName,
                        userCellPhone: data[i].userCellPhone,
                        userProvince: data[i].userProvince,
                        userCity: data[i].userCity,
                        userAddress: data[i].userAddress,
                        getTime: orderTime,
                        goodsType: data[i].goodsType,
                        delivery: data[i].delivery,
                        kdcompany: data[i].kdcompany,
                        kdcode: data[i].kdcode,
                        checktime: checkTime,
                        remarks: data[i].remarks
                    });
                }
            }
            retData["rows"] = orderInfo;
            retData["results"] = totalRow;

            Response.respData(retData, res);
        });
    });

}

function getOrderPet(orderStr, res) {
    var goodsStr = utils.readJSONSyncStr('data/petDetail.json');

    goodsStr = goodsStr.replace(/\$\{CDNPATH\}/g, config.server.host);

    var goods = JSON.parse(goodsStr);

    orderDB.selectOrderGoods(orderStr, function (err, data) {
        if (err) {
            logger.error("/getOrderGoods", err);
            Response.resp(err, res, ErrorCode.UNKONW.code);
        }

        var orderInfo = [];
        if (data && utils.isArray(data)) {
            for (var i = 0; i < data.length; i++) {
                orderInfo.push({
                    ID: data[i].Id,
                    goodsId: data[i].goodsId,
                    goodsCount: data[i].goodsCount,
                    goodsName: goods[data[i].goodsId].name,
                    goodsImg: goods[data[i].goodsId].packageImg
                });
            }
        }
        //goodsImg: '<img src="'+goods[data[i].goodsId].packageImg+'" style="width:120px;height:120px">'
        Response.respData(orderInfo, res);
    });
};

function checkOrderByDate(startDate, endDate, type, res) {
    orderDB.updateOrderByDate(startDate, endDate, type, function (err, data) {
        if (err) {
            Response.resp(err, res, ErrorCode.UNKONW.msg);
        } else {
            Response.resp(ErrorCode.SUCCESS.msg, res, ErrorCode.SUCCESS.code);
        }
    });
};

function checkOrder(body, res) {
    var odata = body.odata;

    if (!odata) {
        Response.resp(ErrorCode.WRONGPARAMS.msg, res, ErrorCode.WRONGPARAMS.code);
        return;
    }

    var delivery = utils.readJSONSync('data/delivery.json');
    var count = 0;
    var condition = function () {
        return count < odata.length;
    };

    var updateFun = function (callback) {
        var p = JSON.parse(odata[count]);

        if (!p.seat) {
            orderDB.updateOrderRedirect(p.type, p.orderStr, function (err, data) {
                //orderDB.updateOrder(p.type, p.delivery, p.orderStr, p.kdcompany, delivery[p.kdcompany], function (err, data) {
                count++;

                if (err) {
                    callback(err);
                } else {
                    callback(null, data);
                }
            });
        } else {
            count++;
            callback(null, null);
        }
    };

    async.whilst(condition, updateFun, function (err) {
        if (err) {
            Response.resp(err, res, ErrorCode.UNKONW.code);
        } else {
            Response.resp(ErrorCode.SUCCESS.msg, res, ErrorCode.SUCCESS.code);
        }
    });
};

/**
 * 导出订单
 * @param startDate
 * @param endDate
 * @param res
 */
function exportOrder(startDate, endDate, type, res) {
    date.setExtraTimeStampSec(startDate);
    var sDate = date.Format("yyyy-MM-dd");

    date.setExtraTimeStampSec(endDate);
    var eDate = date.Format("yyyy-MM-dd");
    orderDB.getOrderByTime(startDate, endDate, type, function (err, data) {
        var orderName = "Order(" + sDate + "To" + eDate + ")";

        orderName = utils.makeFileName("public/xlsx/", orderName, ".xlsx");

        console.log("exportOrder fileName: ", orderName);
        var sheetName = sDate + "To" + eDate;
        var code = jsXlsxBuild(orderName, sheetName, data);

        if (code == 0) {
            var downloadPath = config.server.host + "/xlsx/" + orderName;
            Response.resp(downloadPath, res, ErrorCode.SUCCESS.code);
        } else {
            Response.resp(ErrorCode.FAIL.msg, res, ErrorCode.FAIL.code);
        }
    });
};

/**
 * 导出明细表
 * @param startDate
 * @param endDate
 * @param res
 */
function exportDetail(startDate, endDate, res) {
    date.setExtraTimeStampSec(startDate);
    var sDate = date.Format("yyyy-MM-dd");

    date.setExtraTimeStampSec(endDate);
    var eDate = date.Format("yyyy-MM-dd");

    orderDB.getOrderDetailByTime(startDate, endDate, function (err, data) {
        var orderName = "GoodsDetail(" + sDate + "To" + eDate + ")";
        orderName = utils.makeFileName("public/xlsx/", orderName, ".xlsx");
        var sheetName = sDate + "To" + eDate;
        var code = detailXlsxBuild(orderName, sheetName, data, startDate, endDate);

        if (code == 0) {
            var downloadPath = config.server.host + "/xlsx/" + orderName;
            Response.resp(downloadPath, res, ErrorCode.SUCCESS.code);
        } else {
            Response.resp(ErrorCode.FAIL.msg, res, ErrorCode.FAIL.code);
        }
    });
};

/**
 * 直接完成订单
 * @param order
 * @param res
 */
function redirectFinish(order, res) {
    var kdcode = "FINISH";
    var kdcompany = "直接完成";

    orderDB.updateOrder(2, null, order, kdcompany, kdcode, function (err, data) {
        if (err) {
            Response.resp(ErrorCode.FAIL.msg, res, ErrorCode.FAIL.code);
        } else {
            Response.resp(ErrorCode.SUCCESS.msg, res, ErrorCode.SUCCESS.code);
        }
    });
};

/**
 * js-xlsx生成
 * @param orderName
 * @param sheetName
 * @param data
 * @returns {number}
 */
function jsXlsxBuild(orderName, sheetName, data) {
    var exportData = [];

    if (data && utils.isArray(data)) {
        for (var i = 0; i < data.length; i++) {
            date.setExtraTimeStampSec(data[i].getTime);
            var oDate = date.Format("yyyy-MM-dd");
            var state = null;

            if (data[i].goodsType == 1) {
                state = "配货中";
            } else if (data[i].goodsType == 3) {
                state = "发货中";
            } else if (data[i].goodsType = 2) {
                state = "已发货";
            }

            exportData.push({
                "收件人姓名": data[i].userName,
                "收件人电话": data[i].userCellPhone,
                "收件省": data[i].userProvince,
                "收件市": data[i].userCity,
                "地址": data[i].userAddress,
                "娃娃名称": data[i].name,
                "数量": data[i].goodsCount,
                "内部订单": data[i].orderStr,
                //"玩家ID": data[i].userId,
                "抓取时间": oDate,
                "订单状态": state,
                "备注": data[i].remarks
            });
        }
    }

    var sheetData = XLSX.utils.json_to_sheet(exportData);

    sheetData["!merges"] = [];

    //全匹配(姓名，电话，省，市，地址),仅支持排序过的数据,向后合并
    //未调试完
    /*for (var i = 0; i < exportData.length; i++) {
        var out = exportData[i];
        var total = 0;

        for (var j = i + 1; j < exportData.length; j++) {
            var inner = exportData[j];

            if ((out.CellPhone == inner.CellPhone) &&
                (out.UserName == inner.UserName) &&
                (out.Province == inner.Province) &&
                (out.City == inner.City) &&
                (out.Address == inner.Address)) {
                console.log("相同: ", out.UserName, inner.UserName, i, j);
                total++;
                continue;
            }

            console.log("不相同: ", out.UserName, inner.UserName, i, j);

            if (total > 0) {
                //列顺序与数据格式保持一致
                sheetData["!merges"].push(
                    {s: {c: 0, r: i}, e: {c: 0, r: i + total}},     //姓名        s为开始,c开始列,开始取值范围(行)
                    {s: {c: 1, r: i}, e: {c: 1, r: i + total}},     //手机号
                    {s: {c: 2, r: i}, e: {c: 2, r: i + total}},     //省
                    {s: {c: 3, r: i}, e: {c: 3, r: i + total}},     //市
                    {s: {c: 4, r: i}, e: {c: 4, r: i + total}}     //地址
                );
                sheetData["A" + i] = {t: "s", v: out.UserName};
                sheetData["B" + i] = {t: "s", v: out.CellPhone};
                sheetData["C" + i] = {t: "s", v: out.Province};
                sheetData["D" + i] = {t: "s", v: out.City};
                sheetData["E" + i] = {t: "s", v: out.Address};
            }
            i = j;
            break;
        }
    }
*/
    //console.log(mergeData);

    // 构建 workbook 对象
    var wb = {
        SheetNames: [sheetName],
        Sheets: {},
        Props: {}
    };

    var filePath = "public/xlsx/" + orderName;
    wb.Sheets[sheetName] = sheetData;
    XLSX.writeFile(wb, filePath);

    if (!utils.fileExist(filePath)) {
        return -1;
    }
    return 0;
};

/**
 * 处理导入并发送通知
 * @param filePath
 * @param res
 */
async function handlerOrder(filePath, type, startDate, endDate, res) {
    var data = readXlsFile(filePath);

    var sendData = [];
    var sendDelivery = [];
    var phone = [];

    for (var i = 0; i < data.length; i++) {
        var td = data[i];

        if (!td) {
            continue;
        }

        var cellPhone = td.cellPhone;
        var order = td.Order;
        var devily = td.Devily;
        var company = td.Company;
        var goodsName = td.goodsName;
        var count = td.count || 0;
        var userName = td.userName;
        var province = td.province;
        var city = td.city;
        var address = td.address;

        if (utils.isNull(cellPhone) ||
            utils.isNull(order) ||
            utils.isNull(devily) ||
            utils.isNull(company) ||
            utils.isNull(goodsName) ||
            utils.isNull(userName) ||
            utils.isNull(province) ||
            utils.isNull(city) ||
            utils.isNull(address)) {
            continue;
        }

        devily = String(devily).replace(/\r\n|\t|\r|\n/g, '');
        order = order.replace(/\r\n|\t|\r|\n/g, '');
        goodsName = goodsName.replace(/\r\n|\t|\r|\n/g, '');
        goodsName = goodsName.trim();

        if (sendDelivery.indexOf(devily) == -1) {
            var orderData = {};
            orderData["userName"] = userName.trim();
            orderData["devily"] = devily;
            orderData["company"] = company.trim();
            orderData["cellPhone"] = cellPhone;
            orderData["order"] = order;
            orderData["goodsName"] = {};
            orderData["goodsName"][goodsName] = count;
            orderData["province"] = province.trim();
            orderData["city"] = city.trim();
            orderData["address"] = address.trim();
            sendData.push(orderData);
            sendDelivery.push(devily);
        } else {
            for (var j = 0; j < sendData.length; j++) {
                if (sendData[j].devily == devily) {
                    var goods = sendData[j].goodsName;
                    var gflag = false;

                    for (var gid in goods) {
                        if (gid == goodsName) {
                            goods[gid] += count;
                            gflag = true;
                        }
                    }
                    if (!gflag) {
                        goods[goodsName] = count;
                    }
                }
            }
        }

        if (type == 1) {        //按内部订单号
            orderDB.updateOrderDevily(3, devily, order, company, null, function (err, upData) {
                if (err) {
                    logger.error("handlerOrder", err);
                }
            });
        } else if (type == 2) { //按手机号
            if (phone.indexOf(cellPhone) == -1) {
                orderDB.updateOrderDevilyByPhone(3, devily, cellPhone, company, null, startDate, endDate, function (err, upData) {
                    if (err) {
                        logger.error("handlerOrder", err);
                    }
                });
                phone.push(cellPhone);
            }
        }
    }

    //短信通知
    var nowDate = new Date();
    var time1 = nowDate.getFullYear() + "-" + (nowDate.getMonth() + 1) + "-" + nowDate.getDate();
    var time2 = nowDate.getHours() + ":" + nowDate.getMinutes() + ":" + nowDate.getSeconds();
    var sendDate = time1 + " " + time2;

    async.eachSeries(sendData, function (obj, cb) {
        orderDB.getOrderNotify(obj.devily, obj.cellPhone, 0, function (err, data) {
            if (!data || data.length == 0) {
                orderDB.getOrderByPhone(obj.cellPhone, startDate, endDate, function(err, orderData) {
                    if (orderData && orderData.length > 0) {
                        var isSend = false;

                        for (var i = 0; i < orderData.length; i++) {
                            if (orderData[i].isSendMsg == 1) {
                                isSend = true;
                                break;
                            }
                        }
                        logger.debug("sendShortText: ", isSend);
                        if (isSend) {
                            var goods = obj.goodsName;
                            var goodsName = "";

                            for (var gid in goods) {
                                goodsName += gid + "x" + goods[gid];
                            }

                            var params = [obj.userName, sendDate, obj.company, obj.devily, goodsName, consts.wuliuservice, consts.publicAccoutn];
                            tencentMsg.sendShortMessage(obj.cellPhone, consts.orderTextId, params, consts.orderTextSign, function (err) {
                                obj.type = 0;
                                orderDB.saveOrderNotify(obj, function () {});
                                cb(err);
                            });
                        } else {
                            cb(null);
                        }
                    } else {
                        cb(null);
                    }
                });
            } else {
                logger.debug(obj.order + "短信已发过");
                cb(null);
            }
        });
    }, function (err) {
        logger.error("sendOrderMessage error: ", err);
    });

    var orders = [];

    async.eachSeries(sendData, function (obj, cb) {
        orderDB.getOrderNotify(obj.devily, obj.cellPhone, 1, function (err, data) {
            if (!data || data.length == 0) {
                orderDB.selectIdByPhone(obj.cellPhone, function (err, userId) {
                    orders.push({
                        userId: userId,
                        order: obj.order,
                        devily: obj.devily,
                        goodsName: obj.goodsName,
                        address: obj.province + obj.city + obj.address,
                        userName: obj.userName,
                        company: obj.company,
                        cellPhone: obj.cellPhone
                    });
                    cb(err);
                });
            } else {
                logger.debug(obj.order + "公众号已发过");
                cb(null);
            }
        });
    }, function (err) {
        //公众号通知
        async.eachSeries(orders, function (order, cb) {
            MongoAPI.findUserProperty({userId:order.userId}, {openid:1,lastOa:1}, function (err, userData) {
                if (userData) {
                    var goods = order.goodsName;
                    var goodsName = "";
                    var oa = userData.lastOa;         //目前只支持一个主体。所以openId是唯一的。所以全部得用主体公众号发送

                    if (oa) {
                        for (var gid in goods) {
                            goodsName += gid + "x" + goods[gid];
                        }
                        var msgData = {
                            devily: order.devily,
                            comp: order.company,
                            address: order.address,
                            type: goodsName,
                            date: sendDate,
                            userName: order.userName
                        };
                        var saveData = {
                            order: order.order,
                            devily: order.devily,
                            cellPhone: order.cellPhone,
                            type: 1
                        };

                        orderDB.saveOrderNotify(saveData, function () {});
                        var modelId = consts.templateMsg[oa].sendGoods;
                        if (modelId) {
                            tempMsg.sendTemplateMessage(oa, getOrderJson(userData.openid, modelId, msgData));
                        }
                    }
                }
                cb(err);
            });
        }, function (err) {
            logger.error(err);
        });
    });

    Response.resp(ErrorCode.SUCCESS.msg, res, ErrorCode.SUCCESS.code);
}

function getOrderJson(openid, modelId, sendData) {
    var model = utils.readJSONSync('data/template.json');
    var curModel = model["sendOrder"];
    var curModelStr = JSON.stringify(curModel);

    curModelStr = curModelStr.replace(/\$\{TOUSER\}/g, openid);
    curModelStr = curModelStr.replace(/\$\{TEMPID\}/g, modelId);
    curModelStr = curModelStr.replace(/\$\{USERNAME\}/g, sendData.userName);
    curModelStr = curModelStr.replace(/\$\{ORDER\}/g, sendData.devily);
    curModelStr = curModelStr.replace(/\$\{COMP\}/g, sendData.comp);
    curModelStr = curModelStr.replace(/\$\{PEOPLE\}/g, sendData.address);
    curModelStr = curModelStr.replace(/\$\{TYPE\}/g, sendData.type);
    curModelStr = curModelStr.replace(/\$\{ODATE\}/g, sendData.date);

    return JSON.parse(curModelStr);
};

/**
 * 读xlsx文件
 * @param filePath
 * @returns {Array}
 */
function readXlsFile(filePath) {

    var workBook = XLSX.readFile(filePath);
    var sheetNameList = workBook.SheetNames;

    //console.log("sheetNameList: ", sheetNameList);
    var data = [];
    var orders = consts.orders;
    var companys = consts.companys;
    var devilys = consts.devilys;
    var names = consts.names;
    var goodsName = consts.goodsName;
    var province = consts.province;
    var city = consts.city;
    var address = consts.address;
    var count = consts.count;

    sheetNameList.forEach(function (y) {
        var worksheet = workBook.Sheets[y];
        var headers = {};
        //console.log("workSheet: ", worksheet);

        //zz表示单元格(A1,B1,C1)
        for (var z in worksheet) {

            if (z[0] === '!') continue;

            var tt = 0;

            for (var i = 0; i < z.length; i++) {
                if (!isNaN(z[i])) {
                    tt = i;
                    break;
                }
            }
            ;

            var col = z.substring(0, tt);
            var row = parseInt(z.substring(tt));
            var value = worksheet[z].v;

            //store header names
            if (row == 1 && value) {
                headers[col] = value;
                continue;
            }

            if (!data[row]) {
                data[row] = {};
            }

            if (orders.indexOf(headers[col]) != -1) {
                data[row]["Order"] = value;
            } else if (companys.indexOf(headers[col]) != -1) {
                data[row]["Company"] = value;
            } else if (devilys.indexOf(headers[col]) != -1) {
                data[row]["Devily"] = value;
            } else if (utils.checkMobile(value)) {
                data[row]["cellPhone"] = value;
            } else if (names.indexOf(headers[col]) != -1) {
                data[row]["userName"] = value;
            } else if (goodsName.indexOf(headers[col]) != -1) {
                data[row]["goodsName"] = value;
            } else if (province.indexOf(headers[col]) != -1) {
                data[row]["province"] = value;
            } else if (city.indexOf(headers[col]) != -1) {
                data[row]["city"] = value
            } else if (address.indexOf(headers[col]) != -1) {
                data[row]["address"] = value
            } else if (count.indexOf(headers[col]) != -1) {
                data[row]["count"] = value
            } else {
                data[row][headers[col]] = value;
            }
        }
        //drop those first two rows which are empty
        //data.shift();
        //data.shift();
        //以上两行代码会在下一轮each中删除不为空的值
        for (var i = 0; i < data.length; i++) {
            if (!data[i]) {
                data.splice(i, 1);
            }
        }
    });

    return data;
}

/**
 * node-xlsx生成明细表
 * @param orderName
 * @param sheetName
 * @param data
 * @param startDate
 * @param endDate
 * @returns {number}
 */
function detailXlsxBuild(orderName, sheetName, data, startDate, endDate) {
    var tableData = [];

    tableData.push(["ID", "产品"]);
    startDate *= 1000;
    endDate *= 1000;

    var times = [];
    var exportData = {};

    for (var i = startDate; i < endDate; i = i + 86400000) {
        var curDate = new Date(i);
        var month = curDate.getMonth() + 1;
        var day = curDate.getDate();
        var getTime = Math.floor(new Date(curDate.getFullYear(), month - 1, day, 0, 0, 0).getTime() / 1000);

        tableData[0].push(month + "-" + day);

        times.push([getTime, getTime + 86400]);         //记录时间
        exportData[month + "-" + day] = [];
    }

    var ids = [];
    var goodses = [];

    if (data && utils.isArray(data)) {
        for (var j = 0; j < times.length; j++) {
            var timeData = [];

            for (var i = 0; i < data.length; i++) {
                var odata = data[i];

                if (odata.getTime >= times[j][0] && odata.getTime < times[j][1]) {      //放娃娃到指定时间段里
                    timeData.push({
                        id: odata.id,
                        goodsCount: odata.goodsCount
                    });
                }
                if (ids.indexOf(odata.id) == -1) {      //娃娃类别
                    goodses.push({
                        id: odata.id,
                        name: odata.name
                    });
                    ids.push(odata.id);
                }
            }

            var tDate = new Date(times[j][0] * 1000);
            exportData[(tDate.getMonth() + 1) + "-" + tDate.getDate()] = timeData;
        }
    }

    for (var i = 0; i < goodses.length; i++) {
        tableData.push([goodses[i].id, goodses[i].name]);
    }

    for (var i = 1; i < tableData.length; i++) {    //[[],[]]
        var tData = tableData[i];                   //[,,,]

        for (var ed in exportData) {                        //{11-20:{id:xx,goodsCount:xx}, 11-21:{id:xx,goodsCount:xx}}
            var datePos = tableData[0].indexOf(ed);         //说明要放到第几列(哪个日期)

            if (datePos != -1) {
                var eData = exportData[ed];                 //[{id,count},{},{}]
                var flag = false;

                for (var k = 0; k < eData.length; k++) {
                    if (tData[0] == eData[k].id) {          //哪一行(哪个娃娃)
                        tData[datePos] = (!tData[datePos]) ? 0 : tData[datePos];
                        tData[datePos] += eData[k].goodsCount;
                        flag = true;
                    }
                }

                if (!flag) {
                    tData[datePos] = 0;
                }
            }
        }
    }

    for (var i = 0; i < tableData.length; i++) {
        tableData[i].splice(0, 1);
    }

    var buffer = nodexlsx.build([{name: sheetName, data: tableData}]);
    fs.writeFileSync("public/xlsx/" + orderName, buffer, 'binary');
    return 0;
}

/**
 * 订单核查
 * @param startDate
 * @param endDate
 * @param res
 */
async function getReviewOrder(startDate, endDate, res) {
    var retData = {};

    retData["rows"] = [];
    retData["results"] = 0;

    if (utils.isNull(startDate) || utils.isNull(endDate)) {
        Response.respData(retData, res);
        return;
    }
    for (var i = startDate; i < endDate; i = i + 86400) {
        var curDate = new Date(i * 1000);
        var month = curDate.getMonth() + 1;
        var day = curDate.getDate();

        var orderData = await getOrderCount(i, i + 86400);

        orderData.date = curDate.getFullYear() + "-" + month + "-" + day;
        retData["rows"].push(orderData);
        retData["results"]++;
    }

    Response.respData(retData, res);
};

/**
 * 导出订单核查结果
 * @param startDate
 * @param endDate
 * @param res
 * @returns {Promise.<void>}
 */
async function exportCheckOrder(startDate, endDate, res) {
    if (utils.isNull(startDate) || utils.isNull(endDate)) {
        Response.resp(ErrorCode.WRONGPARAMS.msg, res, ErrorCode.WRONGPARAMS.code);
        return;
    }

    var retData = [];

    for (var i = startDate; i < endDate; i = i + 86400) {
        var curDate = new Date(i * 1000);
        var month = curDate.getMonth() + 1;
        var day = curDate.getDate();

        var orderData = await getOrderCount(i, i + 86400);

        orderData.date = curDate.getFullYear() + "-" + month + "-" + day;
        retData.push(orderData);
    }

    date.setExtraTimeStampSec(startDate);
    var sDate = date.Format("yyyy-MM-dd");

    date.setExtraTimeStampSec(endDate);
    var eDate = date.Format("yyyy-MM-dd");

    var orderName = "OrderCheck(" + sDate + "To" + eDate + ")";

    orderName = utils.makeFileName("public/xlsx/", orderName, ".xlsx");

    var sheetName = sDate + "To" + eDate;
    var code = checkOrderBuild(orderName, sheetName, retData);
    if (code == 0) {
        var downloadPath = config.server.host + "/xlsx/" + orderName;
        Response.resp(downloadPath, res, ErrorCode.SUCCESS.code);
    } else {
        Response.resp(ErrorCode.FAIL.msg, res, ErrorCode.FAIL.code);
    }
};

function checkOrderBuild(orderName, sheetName, data) {
    var tableData = [];

    tableData.push(["日期", "内部总订单", "配货中", "发货中", "已发货", "手机总订单", "配货中", "发货中", "已发货", "总娃娃", "配货中", "发货中", "已发货"]);

    for (var i = 0; i < data.length; i++) {
        var child = data[i];
        tableData.push([
            child.date,
            child.totalOrder,
            child.phOrder,
            child.fhOrder,
            child.yfhOrder,
            child.totalOrderByPhone,
            child.phOrderByPhone,
            child.fhOrderByPhone,
            child.yfhOrderByPhone,
            child.totalPet,
            child.phPet,
            child.fhPet,
            child.yfhPet
        ]);
    }

    var buffer = nodexlsx.build([{name: sheetName, data: tableData}]);
    fs.writeFileSync("public/xlsx/" + orderName, buffer, 'binary');
    return 0;
}

function getOrderCount(startDate, endDate) {
    return new Promise(function (resolve, reject) {
        async.series({
            totalOrder: function (callback) {
                orderDB.selectTotalOrder(null, startDate, endDate, function (err, count) {
                    callback(null, count || 0);
                });
            },
            phOrder: function (callback) {
                orderDB.selectTotalOrder(1, startDate, endDate, function (err, count) {
                    callback(null, count || 0);
                });
            },
            fhOrder: function (callback) {
                orderDB.selectTotalOrder(3, startDate, endDate, function (err, count) {
                    callback(null, count || 0);
                });
            },
            yfhOrder: function (callback) {
                orderDB.selectTotalOrder(2, startDate, endDate, function (err, count) {
                    callback(null, count || 0);
                });
            },
            totalOrderByPhone: function (callback) {
                orderDB.selectTotalOrderByPhone(null, startDate, endDate, function (err, count) {
                    callback(null, count || 0);
                });
            },
            phOrderByPhone: function (callback) {
                orderDB.selectTotalOrderByPhone(1, startDate, endDate, function (err, count) {
                    callback(null, count || 0);
                });
            },
            fhOrderByPhone: function (callback) {
                orderDB.selectTotalOrderByPhone(3, startDate, endDate, function (err, count) {
                    callback(null, count || 0);
                });
            },
            yfhOrderByPhone: function (callback) {
                orderDB.selectTotalOrderByPhone(2, startDate, endDate, function (err, count) {
                    callback(null, count || 0);
                });
            },
            totalPet: function (callback) {
                orderDB.selectTotalOrderPet(null, startDate, endDate, function (err, count) {
                    callback(null, count || 0);
                });
            },
            phPet: function (callback) {
                orderDB.selectTotalOrderPet(1, startDate, endDate, function (err, count) {
                    callback(null, count || 0);
                });
            },
            fhPet: function (callback) {
                orderDB.selectTotalOrderPet(3, startDate, endDate, function (err, count) {
                    callback(null, count || 0);
                });
            },
            yfhPet: function (callback) {
                orderDB.selectTotalOrderPet(2, startDate, endDate, function (err, count) {
                    callback(null, count || 0);
                });
            },
        }, function (err, result) {
            if (err) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}

/**
 * 废弃代码区
 */
function jsXlsxDemo() {

    var jsono = [{ //测试数据
        "合并的列头1": "数据11",//B
        "合并的列头2": "数据12",//C
        "合并的列头3": "数据13",//D
        "合并的列头4": "数据14",//E
    }, {
        "合并的列头1": "数据21",
        "合并的列头2": "数据22",
        "合并的列头3": "数据23",
        "合并的列头4": "数据24",
    }];

    // 构建 workbook 对象
    var wb = {
        SheetNames: [sheetName],
        Sheets: {},
        Props: {}
    };

    var sheetData = XLSX.utils.json_to_sheet(jsono);

    sheetData["A1"] = {t: "s", v: "asdad"};
    sheetData["!merges"] = [{//合并第一行数据[B1,C1,D1,E1]
        s: {//s为开始
            c: 1,//开始列
            r: 1//开始取值范围(行)
        },
        e: {//e结束
            c: 0,//结束列
            r: 2//结束范围(行)
        }
    }];

    wb.Sheets[sheetName] = Object.assign({}, sheetData, {'!ref': ref});
    XLSX.writeFile(wb, 'output.xlsx');
}

function dropCode() {
    // js-xlsx直接导表代码，已不用了
    var _headers = ["玩家姓名", "玩家电话", "省份", "城市", "详细地址", "娃娃名称", "娃娃数量", "内部订单号", "玩家ID", "下单日期"];
    var _data = [
        {
            "玩家姓名": '1',
            "玩家电话": 'test1',
            "省份": '30',
            "城市": 'China',
            "详细地址": 'hello',
            "娃娃名称": 'hello',
            "娃娃数量": 'hello',
            "内部订单号": 'hello',
            "玩家ID": 'hello',
            "下单日期": 'hello'
        },
        {
            "玩家姓名": '',
            "玩家电话": '',
            "省份": '',
            "城市": '',
            "详细地址": '',
            "娃娃名称": 'hello1',
            "娃娃数量": 'hello1',
            "内部订单号": 'hello1',
            "玩家ID": 'hello1',
            "下单日期": 'hello1'
        },
        {
            "玩家姓名": '3',
            "玩家电话": 'test3',
            "省份": '30',
            "城市": 'China',
            "详细地址": 'hello',
            "娃娃名称": 'hello',
            "娃娃数量": 'hello',
            "内部订单号": 'hello',
            "玩家ID": 'hello',
            "下单日期": 'hello'
        }];

    var headers = _headers.map((v, i) => Object.assign({}, {
        v: v,
        position: String.fromCharCode(65 + i) + 1
    })).reduce((prev, next) => Object.assign({}, prev, {[next.position]: {v: next.v}}), {});

    var data = _data.map((v, i) => _headers.map((k, j) => Object.assign({}, {
        v: v[k],
        position: String.fromCharCode(65 + j) + (i + 2)
    }))).reduce((prev, next) => prev.concat(next)).reduce((prev, next) => Object.assign({}, prev, {[next.position]: {v: next.v}}), {});


    // 合并 headers 和 data
    var output = Object.assign({}, headers, data);
    // 获取所有单元格的位置
    var outputPos = Object.keys(output);
    // 计算出范围
    var ref = outputPos[0] + ':' + outputPos[outputPos.length - 1];
    var wb = {
        SheetNames: [sheetName],
        Sheets: {},
        Props: {}
    };
    wb.Sheets["Sheet1"] = Object.assign({}, output, {'!ref': ref});
    XLSX.writeFile(wb, 'output.xlsx');
}

module.exports = {
    getOrder: getOrder,
    getOrderPet: getOrderPet,
    checkOrder: checkOrder,
    checkOrderByDate: checkOrderByDate,
    exportOrder: exportOrder,
    exportDetail: exportDetail,
    handlerOrder: handlerOrder,
    redirectFinish: redirectFinish,
    getReviewOrder: getReviewOrder,
    exportCheckOrder: exportCheckOrder
};
