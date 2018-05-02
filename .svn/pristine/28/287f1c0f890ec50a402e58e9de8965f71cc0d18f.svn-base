var query = require('../common/mysqlQuery.js');

/**
 * 获取信息
 */
function getBugList(start, limit, callback) {
	var sqlStr = 'select * from zb_buglist order by id asc limit ' + start + ',' + limit;
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
	var sqlStr = 'select count(*) from zb_buglist';
    var inParams = [];
    query.query(sqlStr, inParams, function(err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data);
        }
    });
};
/**
 * updateAnswer跟新回复
 */
function updateAnswer(data,callback){
	var sqlStr = 'update zb_buglist set answercontent=?,status=?,remark=?,answertime=? where id=?';
	var inParams = [];
	console.log(data)
	for( i in data){
		inParams.push(data[i])
	}
	console.log(inParams);
	query.query(sqlStr,inParams,function(err,data){
		if(err){
			callback(err)
		}else{
			callback(null,data)
		}
	})
};
/**
 * 删除
 */
function delAnswer(data,callback){
	var sqlStr = 'delete from zb_buglist where id in (?)';
	var inParams = [data];
	query.query(sqlStr,inParams,function(err,data){
		if(err){
			callback(err)
		}else{
			callback(null,data)
		}
	})
	
};
/**
 * 添加反馈
 */
function sendQuestion(data,callback){
	var sqlStr = 'insert into zb_buglist(subpeople,title,userid,content,subtime) values(?,?,?,?,?)';
	var inParams = [];

	for(var i in data){
        inParams.push(data[i]);
	}

	query.query(sqlStr, inParams,function(err,data){
		if(err){
			callback(err)
		}else{
			callback(null, data)
		}
	})

}

module.exports = {
	getBugList:getBugList,
	updateAnswer:updateAnswer,
	delAnswer:delAnswer,
	sendQuestion:sendQuestion,
}
