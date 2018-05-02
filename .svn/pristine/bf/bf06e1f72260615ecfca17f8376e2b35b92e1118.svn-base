var query  = require('../common/mysqlQuery.js');

var checkLogin = function(account, pwd, callback) {
    var sqlStr = 'select * from zb_users where account=? and password=?';
    var inParams = [account, pwd];

    query.query(sqlStr, inParams, function(err, data) {
        if (err) {
            console.log(err);
            callback(err);
        } else {
            callback(null, data);
        }
    });
};

var getAllManager = function(start, limit, callback) {
    var sqlStr = 'select * from zb_users order by regTime desc limit ' + start + "," + limit;

    query.query(sqlStr, null, function(err, data) {
        if (err) {
            console.log(err);
            callback(err);
        } else {
            callback(null, data);
        }
    });
};

var getAllManagerCount = function(callback) {
    var sqlStr = 'select count(*) from zb_users';

    query.query(sqlStr, null, function(err, data) {
        if (err) {
            console.log(err);
            callback(err);
        } else {
            callback(null, data[0]["count(*)"]);
        }
    });
};

var addManager = function(data, callback) {
    var time = new Date();
    var sqlStr = "insert into zb_users(account,password,userName,userCellPhone,regTime) values(?,?,?,?,?)";

    var inParams = [
        data.account,
        data.password,
        data.userName,
        data.userPhone,
        time
    ];

    query.query(sqlStr, inParams, function(err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data);
        }
    });
};

var getUseInfoByAccount = function(account, callback) {
    var sqlStr = "select * from zb_users where account=?";

    var inParams = [account,];

    query.query(sqlStr, inParams, function(err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data);
        }
    });
};

var getUserInfoByPhone = function(phone, callback) {
    var sqlStr = "select * from zb_users where userCellPhone=?";
    var inParams = [phone];

    query.query(sqlStr, inParams, function(err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data);
        }
    });
};

var delUserByAccount = function(account, callback) {
    var sqlStr = "delete from zb_users where account=?";
    var inParams = [account];

    query.query(sqlStr, inParams, function(err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data);
        }
    });
};

var getPrivilegeBySign = function(sign, callback) {
    var sqlStr = "select * from zb_privileges where privilegeSign=?";
    var inParams = [sign];

    query.query(sqlStr, inParams, function(err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data);
        }
    });
};

var addPrivilege = function(data, callback) {
    var sqlStr = "insert into zb_privileges(privilegeName,privilegeSign) values(?,?)";

    var inParams = [
        data.priname,
        data.prisign
    ];

    query.query(sqlStr, inParams, function(err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data);
        }
    });
};

var getAllPrivilegeCount = function(callback) {
    var sqlStr = 'select count(*) from zb_privileges';

    query.query(sqlStr, null, function(err, data) {
        if (err) {
            console.log(err);
            callback(err);
        } else {
            callback(null, data[0]["count(*)"]);
        }
    });
};

var getAllPrivilege = function(start, limit, callback) {
    var sqlStr = 'select * from zb_privileges limit ' + start + "," + limit;

    query.query(sqlStr, null, function(err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data);
        }
    });
};

var getAllPrivilegeByPid = function(pid, callback) {
    var sqlStr = "select * from zb_privileges where privilegePid=?";
    var inParam = [pid];
    query.query(sqlStr, inParam, function(err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data);
        }
    });
}

module.exports = {
    checkLogin: checkLogin,
    getAllManager: getAllManager,
    getAllManagerCount: getAllManagerCount,
    addManager: addManager,
    getUseInfoByAccount: getUseInfoByAccount,
    getUserInfoByPhone: getUserInfoByPhone,
    delUserByAccount: delUserByAccount,

    getPrivilegeBySign: getPrivilegeBySign,
    addPrivilege: addPrivilege,
    getAllPrivilegeCount: getAllPrivilegeCount,
    getAllPrivilege: getAllPrivilege,
    getAllPrivilegeByPid: getAllPrivilegeByPid
};