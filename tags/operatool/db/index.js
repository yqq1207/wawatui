var users = require('./users.js');
var role = require('./role.js');
var player = require('./player.js');
var order = require('./order.js');
var oauth = require('./oauth.js');
var pet = require('./pet.js');
var branch = require('./branch.js');
var jd = require('./jd.js');
var machine = require('./machine.js');
var bug = require('./buglist.js');

exports.DBMgr = function() {
    return new DBManager();
};

function DBManager() {
    this.factory = {};
}

DBManager.prototype.init = function(types) {
    for(var i = 0; i < types.length; i++) {
        if (types.indexOf("users") != -1) {
            this.addFactory(types[i], users);
        }
        if (types.indexOf("role") != -1) {
            this.addFactory(types[i], role);
        }
        if (types.indexOf("player") != -1) {
            this.addFactory(types[i], player);
        }
        if (types.indexOf("order") != -1) {
            this.addFactory(types[i], order);
        }
        if (types.indexOf("oauth") != -1) {
            this.addFactory(types[i], oauth);
        }
        if (types.indexOf("pet") != -1) {
            this.addFactory(types[i], pet);
        }     
		if (types.indexOf("branch") != -1) {
            this.addFactory(types[i], branch);
        }
        if (types.indexOf("jd") != -1) {
            this.addFactory(types[i], jd);
        }
        if (types.indexOf("machine") != -1) {
            this.addFactory(types[i], machine);
        }
        if (types.indexOf("buglist") != -1) {
            this.addFactory(types[i], bug);
        }
    }
};

DBManager.prototype.addFactory = function(type, factory) {
    this.factory[type] = factory;
};

DBManager.prototype.exec = function(type) {
    return this.factory[type];
};

