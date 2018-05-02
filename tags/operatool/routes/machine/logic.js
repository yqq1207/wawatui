var Response = require('../../common/Response.js');
var Redis = require('../../db/RedisAPI.js');

function getMachineList(start, limit, res) {
    var limit = start + limit;
    Redis.getMachineList(start, limit, function(len, machineData) {
        var retData = {};
        retData["rows"] = machineData;
        retData["results"] = len;
        Response.respData(retData, res);
    });
}


module.exports = {
    getMachineList: getMachineList
};