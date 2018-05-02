var myMongo = require('../common/myMongo.js');

var UserMailSchema = new myMongo.Schema({
    userId : { type : Number, index : true, unique: true },
    // 用户来源渠道
    channel : { type : String, default : 0 },
    // 邮件
    mailList : { type : Array, default: [] }
});

module.exports = myMongo.model('UserMail', UserMailSchema);