var query  = require('../common/mysqlQuery.js');

function checkInode(branchId, callback) {
    var sqlStr = 'select * from zb_branch where branchId=?';
    var inParams = [branchId];

    query.query(sqlStr, inParams, function(err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data);
        }
    });
};

function insertBranch(branchId, branchName, callback) {
    var sqlStr = 'insert into zb_branch(branchId, branchName) values(?,?)';
    var inParams = [branchId, branchName];

    query.query(sqlStr, inParams, function(err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data);
        }
    });
}

module.exports = {
    checkInode: checkInode,
    insertBranch: insertBranch
};