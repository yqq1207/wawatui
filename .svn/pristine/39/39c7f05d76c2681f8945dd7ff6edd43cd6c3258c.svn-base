var express = require('express');
var router = express.Router();

var async = require("async");
var xlsx = require('node-xlsx'); 
var fs = require('fs');
var upload = require('multer')({ dest: 'uploads/' });
var Response = require('../../common/Response.js');
var logger = require('../../common/logger.js');
var ErrorCode = require('../../common/errorCode.js').ErrCode;
var utils = require('../../common/utils.js');
var consts = require('../../common/consts.js');

var dbMgr = require('../../db/index.js').DBMgr();

dbMgr.init(['pet']);

var petDB = dbMgr.exec('pet');

router.get('/getPetsData', function(req, res) {
	
	var offset = req.query.start;
	var limit = req.query.limit;

	var retData = {
		rows: [],
		results: 0
	};
//	查询
	petDB.getPetTotal(function(err, totalRow) {
		petDB.getPetData(offset, limit, function(err, data) {
			var petInfo = [];
			
		 	if (data && utils.isArray(data)) {
	            //mysql查出的数据是RowDataPackaget格式，须转换
	            for (var i = 0; i < data.length; i++) {
	             
	                petInfo.push({
                        aid: data[i].aid,
	                  	pid: data[i].pid,
	                  	name: data[i].pname,
	                  	size: data[i].psize,
	                  	energy: data[i].penergy,
	                  	type: data[i].ptype,
	                  	newtype: data[i].pnewtype,
	                  	useGold: data[i].pusergold,
	                  	rmbprice: data[i].prmbprice,
	                  	price: data[i].pprice,
	                  	otherPrice: data[i].potherprice,
	                  	getPrice: data[i].pgetprice,
	                  	hardCft: data[i].phardcft,
	                  	offset: data[i].poffset,
                        ptoysimg: data[i].ptoysimg,
                        ppackageimg: data[i].ppackageimg,
                        pshowimg: data[i].pshowimg,
                        pdetailsimg: data[i].pdetailsimg,
	                });
	            }
	        }
	        retData["rows"] = petInfo;
	        retData["results"] = totalRow;
	
	        Response.respData(retData, res);
		});
	});
});

//查询表中数据的总条数
router.get('/getPetTotal',function(req,res){
	petDB.getPetTotal(function(err,data){
		if(data){
			Response.resp(ErrorCode.SUCCESS.msg,res,ErrorCode.SUCCESS.code);
		}
		else if(err){
			console.log(err)
		}
	});
});

//新建娃娃
router.post('/buildNewPet', function(req, res) {
	var body = req.body;

	var baseData = {
		pid: body.id,
		pname: body.name,
		psize: body.size,
      	penergy: body.energy,
      	ptype: body.type,
      	pnewtype: body.newtype,
      	pusergold: body.useGold,
      	prmbprice: body.rmbprice,
      	pprice: body.price,
      	potherPrice: body.otherPrice,
      	pgetPrice: body.getPrice,
      	phardCft: body.hardCft,
      	poffset: body.offset,
       	ptoysimg : body.ptoysimg,
        ppackageimg : body.ppackageimg,
        pshowimg : body.pshowimg,
        pdetailsimg : body.pdetailsimg,
	};

    logger.debug("buildNewPet: ", JSON.stringify(baseData));

    petDB.getPetsByPid(body.id, function(err, data) {
    	console.log('1111111---'+data+'----2222222222222222222222222')
    	if (data && data.length > 0) {
            Response.resp(ErrorCode.REPEAT.msg, res, ErrorCode.REPEAT.code);
		} else {
            petDB.savePetBaseData(baseData, function(err, data) {
                if (err) {
                    Response.resp(err, res, ErrorCode.UNKONW.code);
                } else {
                    saveLastPid(body.id, function() {
                        Response.resp(ErrorCode.SUCCESS.msg, res, ErrorCode.SUCCESS.code);
					});
                }
            });
		}
    });
});

//编辑娃娃	
router.post('/updatePetRedirect', function(req, res) {
	var aid = req.body.aid;
	var name = req.body.name;
	var size = req.body.size;
	var energy = req.body.energy;
	var type = req.body.type;
	var newtype = req.body.newtype;
	var useGold = req.body.useGold;
	var rmbprice = req.body.rmbprice;
	var price = req.body.price;
	var otherPrice = req.body.otherPrice;
	var getPrice = req.body.getPrice;
	var hardCft = req.body.hardCft;
	var offset = req.body.offset;
	var ptoysimg = req.body.ptoysimg;
	var ppackageimg = req.body.ppackageimg;
	var pshowimg = req.body.pshowimg;
	var pdetailsimg = req.body.pdetailsimg;

	var data = {
		aid: aid,
		name: name,
		size: size,
		energy: energy,
		type: type,
		newtype: newtype,
		useGold: useGold,
		rmbprice: rmbprice,
		price: price,
		otherPrice: otherPrice,
		getPrice: getPrice,
		hardCft: hardCft,
		offset: offset,
		ptoysimg : ptoysimg,
		ppackageimg : ppackageimg,
		pshowimg : pshowimg,
		pdetailsimg : pdetailsimg,
	};

	petDB.updatePetRedirect(data, function(err, data) {
		if (data) {
		   Response.resp(ErrorCode.SUCCESS.msg, res, ErrorCode.SUCCESS.code);
		}
		if(err){
			console.log(err)
		}
	});

});
//删除娃娃

router.post('/delPets',function(req,res){
	var ids = req.body;
	petDB.delPets(ids,function(err,data){
		if(data){
			Response.resp(ErrorCode.SUCCESS.msg,res,ErrorCode.SUCCESS.code);
		}
		if(err){
			console.log(err)
		}
		
	})
});

router.get('/getLastPid', function(req, res) {
	var name = consts.petcfg.lastPid;

    petDB.getLastPid(name, function(err, data){
    	var pid = makePid();

    	if (data && data.length > 0) {
			pid = makePid(data[0].cvalue);
		}
        Response.respData(pid, res);
    });
});


/**
 * excl表格
 * @param {Object} pid
 * @param {Object} cb
 */

//读取文件内容
router.post('/fileupload', upload.single('fileField'), function(req,res){
	//读取文件内容
	console.log(req.file);
	var obj = xlsx.parse(req.file.path);
	var excelObj=obj[0].data;
	var stuArray = excelObj[1];
	excelObj.splice(0,2);
	var data = [];
	for(var i in excelObj){
	    var arr=[];
	    var value=excelObj[i];
	    for(var j in value){
	        arr.push(value[j]);
	    }
	    data.push(arr);
	}
	var baseDataArr = [];
	var body;
	for(var i=0;i<excelObj.length;i++){
		var baseData = {};
		body = data[i];
		for(var j = 0;j<stuArray.length;j++){
			baseData[stuArray[j]] = body[j];
		};
		delete(baseData.sex);
		delete(baseData.color);
		delete(baseData.grabAround);
		baseDataArr.push(baseData);
	}
	async.each(baseDataArr, function (item, cb) {
		petDB.getPetsByPid(item.pid,function(err,data){
			    petDB.savePetBaseDataArr(item, function (err, data) {
					if(err){
//						Response.resp(err, res, ErrorCode.UNKONW.code);
					}else{
						saveLastPid(item.pid, function() {
//	                        Response.resp(ErrorCode.SUCCESS.msg, res, ErrorCode.SUCCESS.code);
						});
					}
			    });
//			}
		})
	}, function (err) {
	    Response.resp(ErrorCode.SUCCESS.msg, res, ErrorCode.SUCCESS.code);
	});


////	baseDataArr.push(baseData)
//	console.log(baseDataArr)
//	petDB.savePetBaseData(baseDataArr,function(err,data){
//		if(data){
//			Response.resp(ErrorCode.SUCCESS.msg,res,ErrorCode.SUCCESS.code);
//		}
//		if(err){
//			console.log(err)
//		}
//		
//	})
//	var buffer = xlsx.build([
//	    {
//	        name:'sheet1',
//	        data:data
//	    }        
//	]);
//	
//	//将文件内容插入新的文件中
//	fs.writeFileSync('test1.xlsx',buffer,{'flag':'w'});

});

// var stuArray = new Array('id','name','sex','size','color','energy','type','newtype','useGold', 'rmbprice','price','otherPrice','getPrice','hardCft','offset','grabAround','toysImg','packageImg','showImg','detailsImg',);
	

function saveLastPid(pid, cb) {
    var name = consts.petcfg.lastPid;
    petDB.getLastPid(name, function(err, data){
    	console.log(data)
        if (data && data.length > 0) {
            petDB.updateLastPid(name, pid, function(err, data) {
				cb(null);
			});
        } else {
        	var detail = "最后娃娃id";
            petDB.saveLastPid(name, pid, detail, function(err, data) {
                cb(null);
            });
		}
    });
};

function makePid(pid) {
	var plen = consts.petcfg.petLen;
	var sign = consts.petcfg.initSign;
	var num = consts.petcfg.initNum;

	plen -= sign.length;

	if (!pid) {
		return sign + utils.addValue(String(num), plen, '0');
	}

	var pidNumber = parseInt(pid.substring(sign.length, pid.length));

    pidNumber++;

    logger.debug("makePid: ", pid, pidNumber);

    return sign + utils.addValue(String(pidNumber), plen, '0');
}
module.exports = router;