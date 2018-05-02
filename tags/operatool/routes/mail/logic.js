var Response = require('../../common/Response.js');
var logger = require('../../common/logger.js');
var utils = require('../../common/utils.js');

var MongoAPI = require('../../db/MongoAPI.js');

var dbMgr = require('../../db/index.js').DBMgr();
dbMgr.init(['player']);
var playerDb = dbMgr.exec('player');

function addMailToUser( params, res, next ){
    MongoAPI.addMailToUser(params, function (err) {
        Response.respData(err, res);
    })
};

function getRewards(res) {
    var pets = utils.readJSONSync('data/petDetail.json');
    var rets = {};

    for (var id in pets) {
        rets[id] = pets[id].name;
    }

    Response.respData(rets, res);
};

module.exports = {
    addMailToUser: addMailToUser,
    getRewards: getRewards
};