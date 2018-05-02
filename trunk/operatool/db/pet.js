var query  = require('../common/mysqlQuery.js');

/**
 * 获取娃娃列表
 * @param {Object} offset
 * @param {Object} limit
 * @param {Object} callback
 */
function getPetData(offset, limit, callback) {
	var sqlStr = 'select * from zb_pets order by pid asc limit ' + offset + ',' + limit;
    var inParams = [];
    query.query(sqlStr, inParams, function(err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data);
        }
    });
};

function getPetTotal(callback) {
	var sqlStr = 'select count(*) from zb_pets';
    var inParams = [];
    query.query(sqlStr, inParams, function(err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data[0]["count(*)"]);
        }
    });
};

//新建娃娃列表
function savePetBaseData(data, cb) {
	console.log('35'+JSON.stringify(data))
	var sqlStr = "insert into zb_pets";
	sendData(sqlStr, data, cb);
	/*var sqlStr = 'insert into zb_pets(pid,pname,psize,penergy,ptype,pnewtype,pusergold,prmbprice,pprice,potherPrice,pgetPrice,phardCft,poffset,ptoysimg,ppackageimg,pshowimg,pdetailsimg) ' +
		'values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
	var inParams = [
		data.pid,
		data.pname,
		data.psize,
		data.penergy,
		data.ptype,
		data.pnewtype,
		data.pusergold,
		data.prmbprice,
		data.pprice,
		data.potherPrice,
		data.pgetPrice,
		data.phardCft,
		data.poffset,
		data.ptoysimg,
		data.ppackageimg,
		data.pshowimg,
		data.pdetailsimg
	];

  	query.query(sqlStr, inParams, function(err, data) {
  		
      if (err) {
        cb(err);
      } else {
        cb(null, data);
      }
	});*/
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
        	console.log(err)
            cb(err);
        } else {
            cb(null, data);
        }
    });
};

//更改编辑娃娃列表
function updatePetRedirect(data, callback) {
    var sqlStr = "update zb_pets set pname=?,psize=?,penergy=?,ptype=?,pnewtype=?,pusergold=?,prmbprice=?,pprice=?,potherPrice=?,pgetPrice=?,phardCft=?,poffset=?,ptoysimg=?,ppackageimg=?,pshowimg=?,pdetailsimg=? where aid=?";
	var inParams = [data.name,data.size,data.energy,data.type,data.newtype,data.useGold,data.rmbprice,data.price,data.otherPrice,data.getPrice,data.hardCft,data.offset,data.ptoysimg,data.ppackageimg,data.pshowimg,data.pdetailsimg,data.aid];
    query.query(sqlStr, inParams, function(err, data) {
        if (err) {
        	console.log(err)
            callback(err);
        } else {
            callback(null, data);
        }
    });
};

//删除娃娃
function delPets(data,callback){
	var sqlStr = 'DELETE FROM zb_pets WHERE aid in (?)';
	var inParams = [data.list];
	query.query(sqlStr,inParams,function(err,data){
		if(err){
			console.log(err);
			callback(err);
		}else{
			callback(null,data)
		}
	});
};
//根据pid获取娃娃信息
function getPetsByPid(pid, cb) {
    var sqlStr = 'select * from zb_pets where pid=?';
    var inParams = [pid];
    console.log('129'+pid)
    query.query(sqlStr,inParams,function(err,data){
    	console.log('1111111--'+data)
        if(err){
            cb(err);
        }else{
            cb(null,data)
        }
    })
};
//获取最后一位pid的值
function getLastPid(name, cb) {
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
//更新pid
function updateLastPid(name, pid, cb) {
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
//保存pid
function saveLastPid(name, pid, detail, cb) {
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


function savePetBaseDataArr(data,cb){
	var sqlStr = "insert into zb_pets";
	console.log('---------------------')
	sendData(sqlStr, data, cb);
}

module.exports = {
	getPetData: getPetData,
	getPetTotal: getPetTotal,
    savePetBaseData:savePetBaseData,
	updatePetRedirect:updatePetRedirect,
	delPets:delPets,
    getPetsByPid:getPetsByPid,
    getLastPid: getLastPid,
    updateLastPid: updateLastPid,
    saveLastPid: saveLastPid,
    savePetBaseDataArr:savePetBaseDataArr
};