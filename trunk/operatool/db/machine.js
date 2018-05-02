var query  = require('../common/mysqlQuery.js');
/**
 * 获取机器列表
 * @param {Object} offset
 * @param {Object} limit
 * @param {Object} callback
 */
//获取信息
function getMachineData(offset, limit, callback) {
	var sqlStr = 'select * from zb_machines order by id asc limit ' + offset + ',' + limit;
    var inParams = [];
    query.query(sqlStr, inParams, function(err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data);
        }
    });
};
//获取总条数
function getMachineTotal(callback) {
	var sqlStr = 'select count(*) from zb_machines';
    var inParams = [];
    query.query(sqlStr, inParams, function(err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data);
        }
    });
};
//新建
function buildNewMachine(data,callback){
	var sqlStr = 'insert into zb_machines(clock,flagUrl,getPrice,gtype,hardCft,init,machinetype,mname,mresource,msign,mstatus,mtype,offset,openrpvalue,otherPrice,price,rmbprice,sortId,useGold,mid)'+
	'values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
	
	var inParams = [data.clock,data.flagUrl,data.getPrice,data.gtype,data.hardCft,data.init,data.machinetype,data.mname,data.mresource,data.msign,data.mstatus,data.mtype,data.offset,data.openrpvalue,data.otherPrice,data.price,data.rmbprice,data.sortId,data.useGold,data.mid];
	query.query(sqlStr,inParams,function(err,data){
		if(err){
			callback(err);
		}
		else{
			callback(null,data)
		}
	})
};
/**
 * 批量导入
 */
function importOrderByMachine(data,callback){
	var sqlStr = "insert into zb_machines";
	console.log(data);
	sendData(sqlStr, data, callback)
}
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
    console.log(sqlStr)
    query.query(sqlStr, inParams, function(err, data) {
        if (err) {
            cb(err);
            console.log(err)
        } else {
            cb(null, data);
            console.log(2222222222222)
        }
    });
};
//编辑
function updateMachine(data,callback){
	var sqlStr = 'update zb_machines set clock=?,flagUrl=?,getPrice=?,gtype=?,hardCft=?,init=?,machinetype=?,mname=?,mresource=?,msign=?,mstatus=?,mtype=?,offset=?,openrpvalue=?,otherPrice=?,price=?,rmbprice=?,sortId=?,useGold=? where mid=?'
	var inParams = [data.clock,data.flagUrl,data.getPrice,data.gtype,data.hardCft,data.init,data.machinetype,data.mname,data.mresource,data.msign,data.mstatus,data.mtype,data.offset,data.openrpvalue,data.otherPrice,data.price,data.rmbprice,data.sortId,data.useGold,data.mid];
	query.query(sqlStr,inParams,function(err,data){
		if(err){
			console.log(err)
			callback(err)
		}else{
			console.log(data)
			callback(null,data)
		}
	})
}
//删除
function delMachine(data,callback){
	var sqlStr = 'delete from zb_machines where id in (?)';
	var inParams = [data.list];
	console.log(inParams)
	query.query(sqlStr,inParams,function(err,data){
		if(err){
			callback(err)
		}else{
			callback(null,data)
		}
	})
};
/**
 * 导出订单
 * @param startDate
 * @param endDate
 * @param res
 */
function exportOrder1(startDate, endDate, type, res) {
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



//获取最后一个编码
function getLastMachine(name, cb) {
    var sqlStr = 'select name,cvalue from zb_config where name=?';
    var inParams = [name];
	
    query.query(sqlStr,inParams,function(err,data){
        if(err){
            cb(err);
        }else{
            cb(null, data)
        }
    });
}

//更新最后一位编码
function updateLastMachine(name, pid, cb) {
	console.log(pid)
    var sqlStr = 'update zb_config set cvalue=? where name=?';
    var inParams = [pid, name];
    query.query(sqlStr, inParams, function(err, data){
        if(err){
            cb(err);
        }else{
            cb(null, data)
        }
    });
};

function saveLastMachine(name, pid, detail, cb) {
    var sqlStr = 'insert into zb_config(name, cvalue, detail) values(?,?,?)';
    var inParams = [name, pid, detail];

    query.query(sqlStr, inParams, function(err,data){
        if(err){
            cb(err);
        }else{
            cb(null, data)
        }
    });
};


module.exports = {
	getMachineData:getMachineData,
	getMachineTotal:getMachineTotal,
	buildNewMachine:buildNewMachine,
	updateMachine:updateMachine,
	delMachine:delMachine,
	getLastMachine:getLastMachine,
	updateLastMachine:updateLastMachine,
	saveLastMachine:saveLastMachine,
	exportOrder1:exportOrder1,
	importOrderByMachine:importOrderByMachine
}