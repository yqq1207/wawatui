var myMongo = require('../common/myMongo.js');

var UserPickUpPet = new myMongo.Schema({
    order: {type: String, default: null},
    userId : { type : Number, index : true },
    userName : {type: String, default: null},
    userCellPhone: {type: String, default: null},
    userProvince: {type: String, default: null},
    userCity: {type: String, default: null},
    userDetailAddress: {type: String, default: null},
    goodsId : { type : Array, default: []},                               // 提取ID
    getTime : { type : Number,  default : Date.now()/1000},                // 提取时间
    goodsType: {type: Number, default: 0}                                 //提取状态 0未提取，1审核中， 2己提取
});

module.exports = myMongo.model("UserPickUpPet", UserPickUpPet);