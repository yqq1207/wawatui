var mysqlConf = {
    "mainMq" : {
        "host" : "127.0.0.1",
        "port" : 7369
    },
    "listenMap" : {
        "mainMq" : 1,
        "connect_7" : 7,
        "SM_1" : 10000
    },
    "mysql": {
        "connectionLimit": 3,
        "host": '172.21.32.7',
        "user": 'root',
        "password": '9bD2Or&gK%',
        "database": 'zb_game',
        "port": 3306
    }
};

var redisConf = {
    "host" : "172.21.16.17",
    "port" : 6379,
    "password" : "Qz%3VRRCO"
};


var server = {
    host: 'http://140.143.184.47:9060'
};

var reyun = {
    channelid: "Wechat",
    serverid: "140.143.184.47",
    tz: "UTC"
};



module.exports = {
    mysqlConf: mysqlConf,
    redisConf: redisConf,
    server: server,
    reyun: reyun
};