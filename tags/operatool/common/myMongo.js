var fs = require('fs');
var mongoose = require('mongoose');

var connectCount = 0;
var timerArr = [0, 1000, 5000, 10 * 1000, 30 * 1000, 60 * 1000];

if (!global.MONGO_INITED) {
    var config = null;
    var options = null;
    try {
        var conf = JSON.parse(fs.readFileSync('config/mongo.conf'));
        config = conf.config;
        options = conf.options;
    } catch (e) {
        console.log("parse config error:", e);
        return;
    }

    var url = 'mongodb://' + config.host + ':' + config.port + '/' + config.db;

    mongoose.connect(url, options);
    mongoose.connection.on('open', function () {
        connectCount = 0;
        console.log('connection to mongodb established.');
    });
    mongoose.connection.on('error', function (err) {
        console.log('mongodb client on error:', err);

        setTimeout(function () {
            mongoose.connect(url, options);
        }, timerArr[connectCount]);

        connectCount = connectCount >= (timerArr.length - 1) ? (timerArr.length - 1) : (connectCount + 1);
    });
    global.MONGO_INITED = true;
}

module.exports = mongoose;
