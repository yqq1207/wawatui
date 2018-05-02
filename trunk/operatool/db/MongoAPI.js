var User      = require('../Schema/users.js');
var MailModel = require('../Schema/userMail.js');

var getAllPlayer = function(start, limit, callback) {
    User.find({}).skip(parseInt(start)).limit(parseInt(limit)).sort({userId: -1}).exec(function(err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data);
        }
    });
};

var playerCount = function(callback) {
    User.count({}, function(err, total) {
        if (err) {
            callback(err);
        } else {
            callback(null, total || 0);
        }
    });
};

var getPlayerInfo = function(userId, callback) {
    User.findOne({
        userId: userId
    }, function(err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data);
        }
    })
};

var playerCountByNickName = function(nickName, callback) {
    var regex = new RegExp(nickName, 'i');
    User.count({
        nickname: regex
    }, function(err, total) {
        if (err) {
            callback(err);
        } else {
            callback(null, total || 0);
        }
    });
};
var getUserByNickName = function(start, limit, nickName, callback) {
    var regex = new RegExp(nickName, 'i');
    User.find({
        nickname: regex
    }).skip(parseInt(start)).limit(parseInt(limit)).sort({userId: -1}).exec(function(err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data);
        }
    });
};

var incUserData = function(userId, data, callback) {
    User.findOneAndUpdate({
        userId: userId
    }, {
        $inc: data
    }, {
        upsert: false,
        new: false
    }, function (err, ret) {
        if (err) {
            callback(err);
        } else {
            callback(null, ret);
        }
    })
};

var findOpenId = function(start, limit, callback) {
    User.find({
        openid:{$ne:null}
    },{
        openid: 1,
        lastOa: 1,
        nickname: 1
    }).skip(parseInt(start)).limit(parseInt(limit)).exec(function(err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data);
        }
    })
};

var findUserProperty = function(relation, ret, callback) {
    User.findOne(relation, ret, function (err, user) {
            if (err) {
                callback(err);
            } else {
                if (!user) {
                    callback(null);
                } else {
                    callback(null, user);
                }
            }
        }
    );
};

var findUserStream = function(relation, ret) {
    return User.findOne(relation, ret).cursor();
};

var findUserCount = function(callback) {
    User.find().count(function(err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data);
        }
    })
};

function MailInfo() {
    this.mailId = 0;
    this.sender = 0;
    this.senderNickname = "";
    this.avatarType = 0;
    this.avatarId = "";
    this.title = "";
    this.content = "";
    this.sendTime = 0;
    this.type = 0;
    this.level = 0;
    this.viewTime = 0;
    this.rewards = [];
    this.chooseRewards = []; //可选奖励
    this.isRead = 0;
    this.isObtain = 0;
}

/*
 * 邮件数据格式
 */
function mailFormatData( mail ) {
    if( !mail ){
        return null;
    }

    var oneMail      = new MailInfo();
    oneMail.mailId   = Date.now();
    oneMail.viewTime = 0;
    oneMail.isRead   = 0;
    oneMail.isObtain = 0;
    oneMail.sendTime = Date.now();

    for( var key in oneMail ){
        if( mail[key] != null && mail[key] != undefined ){
            oneMail[key] = mail[key];
        }
    }

    return oneMail;
}

//给玩家添加邮件
var addMailToUser = function ( params, callback) {
    var userId = params.userId;
    var email  = params;
    console.log( "Mongo API" );
    console.log( params  );
    MailModel.findOne({userId: userId}, function (err, data) {
        if (err) {
            return callback(err);
        }
        var oneMail = mailFormatData(email);
        if (!data) {
            var obj      = new MailModel();
            obj.userId   = userId;
            obj.mailList = [];
            obj.mailList.push(oneMail);
            obj.save(function (err) {
                if (err) {
                    return callback(err);
                } else {
                    return callback(null);
                }
            });
        } else {
            MailModel.findOneAndUpdate({
                    userId: userId
                }, {
                    $push : {
                        mailList : oneMail
                    }
                }, {
                    new: true,
                    upsert: true
                }, function(err, doc) {
                    if (err) {
                        return callback(err);
                    } else {
                        return callback(null);
                    }
                }
            );
        }
    });
};

module.exports = {
    playerCount: playerCount,
    getAllPlayer: getAllPlayer,
    getPlayerInfo: getPlayerInfo,
    getUserByNickName: getUserByNickName,
    incUserData: incUserData,
    playerCountByNickName: playerCountByNickName,
    findOpenId: findOpenId,
    findUserCount: findUserCount,
    addMailToUser: addMailToUser,
    findUserProperty: findUserProperty,
    findUserStream: findUserStream
};