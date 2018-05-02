var express = require('express');
var router = express.Router();

var xlsx = require('node-xlsx');
var upload = require('multer')({ dest: 'uploads/' });
var async = require("async");
var logic = require('./logic.js');
var Response = require('../../common/Response.js');
var logger = require('../../common/logger.js');
var ErrorCode = require('../../common/errorCode.js').ErrCode;
var utils = require('../../common/utils.js');
var consts = require('../../common/consts.js');

var dbMgr = require('../../db/index.js').DBMgr();

dbMgr.init(['machine']);

var petDB = dbMgr.exec('machine');



router.get('/list', function(req, res, next) {
	var offset = req.query.start;
	var limit = req.query.limit;
	 var pageIndex = req.query.pageIndex;


	var retData = {
		rows: [],
		results: 0
	};
//	查询
	petDB.getMachineTotal(function(err, totalRow) {
		petDB.getMachineData(offset, limit, function(err, data) {
			var petInfo = [];
			
		 	if (data && utils.isArray(data)) {
	            //mysql查出的数据是RowDataPackaget格式，须转换
	            for (var i = 0; i < data.length; i++) {
	             
	                petInfo.push({
                        id: data[i].id,
	                  	mid: data[i].mid,
	                  	mname: data[i].mname,
	                  	mstatus: data[i].mstatus,
	                  	clock: data[i].clock,
	                  	init: data[i].init,
	                  	gtype: data[i].gtype,
	                  	mtype: data[i].mtype,
	                  	machinetype: data[i].machinetype,
	                  	openrpvalue: data[i].openrpvalue,
	                  	useGold: data[i].useGold,
	                  	rmbprice: data[i].rmbprice,
	                  	price: data[i].price,
	                  	otherPrice: data[i].otherprice,
	                  	getPrice: data[i].getprice,
	                  	hardCft: data[i].hardcft,
	                  	offset: data[i].offset,
                        msign: data[i].msign,
                        mresource: data[i].mresource,
                        flagUrl: data[i].flagUrl,
                        sortId: data[i].sortId,
	                });
	            }
	        }
	        retData["rows"] = petInfo;
	        retData["results"] = totalRow;
	        Response.respData(retData, res);
		});
	});

});
//新建
router.post('/buildNewMachine',function(req,res){
	var dataDetial = req.body;
	petDB.getLastMachine(dataDetial.mid,function(err,data){
		console.log(data)
		if(data && data.length>0){
			 Response.resp(ErrorCode.REPEAT.msg, res, ErrorCode.REPEAT.code);
		}else{
			petDB.buildNewMachine( dataDetial,function(err, data) {
				if(err){
					Response.resp(err, res, ErrorCode.UNKONW.code);
				}else{
					saveLastMachine(dataDetial.mid, function() {
                        Response.resp(ErrorCode.SUCCESS.msg, res, ErrorCode.SUCCESS.code);
					});
				}
		    });
		}
	})
});
//编辑
router.post('/updateMachine',function(req,res){
	var data = req.body;
	petDB.updateMachine(data,function(err,data){
		if(err){
			Response.resp(err,res,ErrorCode.UNKONW.code);
		}else{
			Response.resp(ErrorCode.SUCCESS.msg,res,ErrorCode.SUCCESS.code);
		}
	})
});
//删除
router.post('/delMachine',function(req,res){
	var data = req.body;
	petDB.delMachine(data,function(err,data){
		if(err){
			Response.resp(err,res,ErrorCode.UNKONW.code);
		}else{
			Response.resp(ErrorCode.SUCCESS.msg,res,ErrorCode.SUCCESS.code);
		}
	})
});
//获取最后一位
router.get('/getLastMachine',function(req,res){
	var name = consts.machinecfg.lastMachine;
    petDB.getLastMachine(name, function(err, data){
    	var pid;
    	if (data && data.length > 0) {
			pid = makePid(data[0].cvalue);
			console.log(pid);
		}else{
			pid = makePid();
		}
        Response.respData(pid, res);
    });
});
//提交文件
router.post('/importOrder',upload.single('fileName'),function(req,res){
	var obj = xlsx.parse(req.file.path);
	var excelObj=obj[0].data;
	var stuArray = excelObj[0];
	excelObj.splice(0,2);
	var data = [];
	for(var i = 0;i<excelObj.length;i++){
		var dataObj = {};
		var dataList = excelObj[i];
		for(var j=0;j<dataList.length;j++){
			dataObj[stuArray[j]] = dataList[j]
		}
		data.push(dataObj)
	};
//	async.each(data, function (item, cb) {
//	    petDB.importOrderByMachine(item, function (err, data) {
//	        cb();
//	    });
//	}, function (err) {
//	    Response.resp(ErrorCode.SUCCESS.msg, res, ErrorCode.SUCCESS.code);
//	});
	async.each(data, function (item, cb) {
		petDB.getLastMachine(item.mid,function(err,data){
			if(data && data.length>0){
				 Response.resp(ErrorCode.REPEAT.msg, res, ErrorCode.REPEAT.code);
			}else{
			    petDB.importOrderByMachine(item, function (err, data) {
					if(err){
						Response.resp(err, res, ErrorCode.UNKONW.code);
					}else{
						saveLastMachine(item.mid, function() {
//	                        Response.resp(ErrorCode.SUCCESS.msg, res, ErrorCode.SUCCESS.code);
						});
					}
			    });
			}
		})
	}, function (err) {
	    Response.resp(ErrorCode.SUCCESS.msg, res, ErrorCode.SUCCESS.code);
	});
});
	
	

//保存最后一个编号
function saveLastMachine(pid, cb) {
    var name = consts.machinecfg.lastMachine;
    petDB.getLastMachine(name, function(err, data){
        if (data && data.length > 0) {
            petDB.updateLastMachine(name, pid, function(err, data) {
				cb(null);
			});
        } else {
        	var detail = "最后机器id";
            petDB.saveLastMachine(name, pid, detail, function(err, data) {
                cb(null);
            });
		}
    });
};
function makePid(pid) {
	console.log(consts.machinecfg)
	var plen = consts.machinecfg.petLen;//6
	var sign = consts.machinecfg.initSign;//DT
	var num = consts.machinecfg.initNum;//1
	plen -= sign.length;//4
	if (!pid) {
		console.log(1111111111)
		return sign + utils.addValue(String(num), plen, '0');
	}

	var pidNumber = parseInt(pid.substring(sign.length, pid.length));
	console.log('2222222222**********',pidNumber,pid)
    pidNumber++;
	
    logger.debug("makePid: ", pid, pidNumber);
    return sign + utils.addValue(String(pidNumber), plen, '0');
}


module.exports = router;