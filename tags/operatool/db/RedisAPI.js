var myCache = require('../common/myCache.js');
var logger = require('../common/logger.js');
var consts = require('../common/consts.js');
var async = require('async');

function Redis() {

}

Redis.prototype.getMachineList = function(start, limit, callback) {
    var cache = myCache.getClient();

    cache.hget(consts.redisMachine.KEY, consts.redisMachine.PRV_FILED + "ids", function(err, data) {
        if (err) {
            logger.error("getMachineList error: ", err);
        }
        if (data) {
            var ids = JSON.parse(data);
            var count = start;

            limit = limit >= ids.length ? ids.length : limit;

            console.log("----", count, limit, ids.length);
            //查找机器数据
            var condition = function () {
                return count < limit;
            };
            var machineList = [];
            var getMachine = function(callback) {
                cache.hget(consts.redisMachine.KEY, consts.redisMachine.PRV_FILED + "id_" + ids[count], function(err, data) {
                    if (err) {
                        logger.error("get machine err: ", err);
                    } else {
                        machineList.push(JSON.parse(data));
                    }
                    count++;
                    callback(err);
                });
            };

            async.whilst(condition, getMachine, function(err) {
                if (err) {
                    logger.error("async.whils get machine err: ", err)
                }
                callback(ids.length, machineList);
            });
        }
    });
};

module.exports = new Redis();