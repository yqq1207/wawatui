
var ReYun = require('reyun');
var Log = require('./logger.js');

var config = {
    appId: "944ba2f592cd143692ac0f6e3fe9b14f"
};

var ThisMgr = null;

exports.GetInstance = function() {
    if (!ThisMgr) {
        ThisMgr = new ReYunAPI();
    }
    return ThisMgr;
};

function ReYunAPI() {
    this.api = new ReYun(config);
};

ReYunAPI.prototype.firstStart = function(params, callback) {
    this.api.firstStart(creatParam(params), function(err, data) {
        Log.debug("firstStart: ", data);
        callback(null, data);
    });
};

ReYunAPI.prototype.everyStart = function(params, callback) {

    this.api.everyStart(creatParam(params), function(err, data) {
        Log.debug("everyStart: ", data);
        callback(null, data);
    });
};

ReYunAPI.prototype.register = function(params, callback) {

    var params = creatParam(params);
    this.api.register(params, function(err, data) {
        Log.debug("register: ", err, data, params);
        callback(null, data);
    });
};

ReYunAPI.prototype.loginIn = function(params, callback) {

    this.api.loginServer(creatParam(params), function(err, data) {
        Log.debug("login: ", data);
        callback(null, data);
    });
};

ReYunAPI.prototype.economy = function(params, callback) {

    Log.debug("econnomy: ", creatParam(params));

    this.api.economy(creatParam(params), function(err, data) {
        Log.debug("economy: ", data);
        callback(null, data);
    });
};

ReYunAPI.prototype.quest = function(params, callback) {

    Log.debug("quest: ", creatParam(params));

    this.api.quest(creatParam(params), function(err, data) {
        Log.debug("quest: ", data);
        callback(null, data);
    });
};

ReYunAPI.prototype.heartBeat = function(params, callback) {

    Log.debug("heartbeat: ", creatParam(params));

    this.api.heartBeat(creatParam(params), function(err, data) {
        Log.debug("heartbeat: ", data);
        callback(null, data);
    });
};

ReYunAPI.prototype.payment = function(params, callback) {

    Log.debug("payment: ", creatParam(params));

    this.api.payment(creatParam(params), function(err, data) {
        Log.debug("payment: ", data);
        callback(null, data);
    });
};

function creatParam(params) {
    if (!params) return null;

    var obj = {};

    obj["context"] = {};

    if (params.who) {
        obj["who"] = params.who;
    }
    if (params.what) {
        obj["what"] = params.what;
    }
    if (params.deviceId) {
        obj["context"]["deviceid"] = params.deviceId;
    }
    if (params.idfv) {
        obj["context"]["idfv"] = params.idfv;
    }
    if (params.idfa) {
        obj["context"]["idfa"] = params.idfa;
    }
    if (params.channelid) {
        obj["context"]["channelid"] = params.channelid;
    }
    if (params.tz) {
        obj["context"]["tz"] = params.tz;
    }
    if (params.devicetype) {
        obj["context"]["devicetype"] = params.devicetype;
    }
    if (params.op) {
        obj["context"]["op"] = params.op;
    }
    if (params.network) {
        obj["context"]["network"] = params.network;
    }
    if (params.os) {
        obj["context"]["os"] = params.os;
    }
    if (params.resolution) {
        obj["context"]["resolution"] = params.resolution;
    }
    if (params.accounttype) {
        obj["context"]["accounttype"] = params.accounttype;
    }
    if (params.gender) {
        obj["context"]["gender"] = params.gender;
    }
    if (params.age) {
        obj["context"]["age"] = params.age;
    }
    if (params.serverid) {
        obj["context"]["serverid"] = params.serverid;
    }
    if (params.level) {
        obj["context"]["level"] = params.level;
    }
    if (params.transactionid) {
        obj["context"]["transactionid"] = params.transactionid;
    }
    if (params.paymenttype) {
        obj["context"]["paymenttype"] = params.paymenttype;
    }
    if (params.currencytype) {
        obj["context"]["currencytype"] = params.currencytype;
    }
    if (params.currencyamount) {
        obj["context"]["currencyamount"] = params.currencyamount;
    }
    if (params.virtualcoinamount) {
        obj["context"]["virtualcoinamount"] = params.virtualcoinamount;
    }
    if (params.iapname) {
        obj["context"]["iapname"] = params.iapname;
    }
    if (params.iapamount) {
        obj["context"]["iapamount"] = params.iapamount;
    }
    if (params.itemname) {
        obj["context"]["itemname"] = params.itemname;
    }
    if (params.itemamount) {
        obj["context"]["itemamount"] = params.itemamount;
    }
    if (params.itemtotalprice) {
        obj["context"]["itemtotalprice"] = params.itemtotalprice;
    }
    if (params.questid) {
        obj["context"]["questid"] = params.questid;
    }
    if (params.queststatus) {
        obj["context"]["queststatus"] = params.queststatus;
    }
    if (params.questtype) {
        obj["context"]["questtype"] = params.questtype;
    }

    return obj;
}