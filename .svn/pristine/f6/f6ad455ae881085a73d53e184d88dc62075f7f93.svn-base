var express = require('express');
var router = express.Router();

var Response = require('../../common/Response.js');
var logger = require('../../common/logger.js');
var ErrorCode = require('../../common/errorCode.js').ErrCode;
var utils = require('../../common/utils.js');
var dbMgr = require('../../db/index.js').DBMgr();

dbMgr.init(['buglist']);

var petDB = dbMgr.exec('buglist');

router.get('/getBugList',function(req,res,next){
	var start = req.query.start;
	var limit = req.query.limit;
	var pageIndex = req.query.pageIndex;
	var retData = {
		rows: [],
		results: 0
	};
	
	petDB.getBugList(start,limit,function(err,data){
		if(err){
			Response.resp(err, res, ErrorCode.UNKONW.code);
		}else{

			var petInfo = [];
		 	if (data && utils.isArray(data)) {
	            //mysql查出的数据是RowDataPackaget格式，须转换
	            for (var i = 0; i < data.length; i++) {
	             
	                petInfo.push({
                        id: data[i].id,
	                  	title: data[i].title,
	                  	userid: data[i].userid,
	                  	content: data[i].content,
	                  	subpeople: data[i].subpeople,
	                  	subtime: data[i].subtime,
	                  	status: data[i].status,
	                  	remark: data[i].remark,
	                  	answertime: data[i].answertime,
	                  	answercontent: data[i].answercontent,
	                });
	            }
	        }
	        retData["rows"] = petInfo;
//	        retData["results"] = totalRow;
	        Response.respData(retData, res);
		}
	})
});
//回复
router.post('/updateAnswer',function(req,res){
	var data = req.body;
	petDB.updateAnswer(data,function(err,data){
		if(err){
			Response.resp(err,res,ErrorCode.UNKONW.code);
		}else{
			Response.resp(ErrorCode.SUCCESS.msg,res,ErrorCode.SUCCESS.code);
		}
	})
});
/**
 * 删除
 */
router.post('/delAnswer',function(req,res){
	var data = req.body.list;
	petDB.delAnswer(data,function(err,data){
		if(err){
			Response.resp(err,res,ErrorCode.UNKONW.code);
		}else{
			Response.resp(ErrorCode.SUCCESS.msg,res,ErrorCode.SUCCESS.code);
		}
	})
});
/**
 * 发送问题
 */
router.post('/sendQuestion',function(req,res){
	var data = req.body;
	petDB.sendQuestion(data,function(err,data){
		if(err){
			Response.resp(err,res,ErrorCode.UNKONW.code);
		}else{
			Response.resp(ErrorCode.SUCCESS.msg,res,ErrorCode.SUCCESS.code);
		}
	});
})


module.exports = router;

