var mymongo = require('./../common/myMongo');

var UserSchema = new mymongo.Schema({
    unionId: {type: String, index: true, unique: true},
    openid: {type: String, default: null},
    userId: {type: Number, index: true, unique: true},
    account: {type: String, index: true},
    // 默认为userId
    nickname: {type: String, index: true},
    country: {type: String, default: null},
    province: {type: String, default: null},
    city: {type: String, default: null},
    mobile: {type: Number, default: null},
    password: {type: String, default: null},
    mail: {type: String, default: null},
    // 设备类型 IOS, Android, Windows
    deviceType: {type: String, default: null},
    // iphone4s/SAMSUNG Note4
    deviceModel: {type: String, default: null},
    deviceId: {type: String, index: true},
    exp: {type: Number, default: 0},
    // 1-男, 2-女
    sex: {type: Number, default: 1},
    // 1-系统头像, 2-自定义头像
    avatarType: {type: Number, default: 1},
    // 头像的ID或者URL地址
    avatarId: {type: String, default: ""},
    // 用户来源渠道
    channel: {type: Number, default: 0},
    // 推送ID, 根据渠道进行划分
    pushId: {type: String, default: null},
    // 最后登录IP
    lastLoginIp: {type: String, default: null},
    // 最后登录时间
    lastLoginTime: {type: Date, default: Date.now()},
    // 上一次登录大厅时间
    newLastLoginTime: {type: Date, default: 0},
    createTime: {type: Date, default: Date.now()},
    status: {type: Number, default: 0},                       // 0-正常 1-限制 2-封号
    // 客户端版本号
    csVersion: {type: String, default: "1.0.0"},
    // 第一次使用自动登录的时间.
    firstAutoLoginTime: {type: Date, default: null},
    refreshToken: {type: String, default: ""},
    // 最后一次刷新token的时间.
    lastRefreshTokenTime: {type: Date, default: null},
    //有效期
    expiresIn: {type: Number, default: 72000},
    //累计必中值
    biZhong: {type: Number, default: 0},
    //所在娃娃机
    machine: {type: String, default: "N001"},
    //所在必中娃娃机
    bitslapMachine: {type: String, default: "BN001"},
    //金币
    gold: {type:Number, default: 1000},
    //抓红包次数
    redPackageNum: {type: Number, default: 1},
    //最后抓红包时间
    lastRedPackageTime: {type: Date, default: 0},

    //增加抓取次数时间微信好友
    incRedPackageTimeHY: {type: Date, default: Date.now()},
    //增加抓取次数时间微信朋友圈
    incRedPackageTimePYQ: {type: Date, default: Date.now()},
    //当天已增加抓取次数,qq
    incRedPackageTimeQQ: {type: Date, default: Date.now()},
    //当天已增加抓取次数,qq空间
    incRedPackageTimeQQKJ: {type: Date, default: Date.now()},
    //当天已增加抓取次数,新浪
    incRedPackageTimeSina: {type: Date, default: Date.now()},
    //当天已增加抓取次数,微信好友
    dayIncRedPackageHY: {type: Number, default:0},
    //当天已增加抓取次数,微信朋友圈
    dayIncRedPackagePYQ: {type: Number, default:0},
    //当天已增加抓取次数,qq
    dayIncRedPackageQQ: {type: Number, default:0},
    //当天已增加抓取次数,qq空间
    dayIncRedPackageQQKJ: {type: Number, default:0},
    //当天已增加抓取次数,新浪
    dayIncRedPackageSina: {type: Number, default:0},

    //是否关注公众号
    hasConcern: {type: Number, default:0},
    //领取时间
    concernRewardTime: {type: Date, default: 0},
    //当天已领取次数
    concernRewardCount: {type: Number, default:0},

    //是否是新号:
    newPlayer: {type: Number, default: 1},
    //金币必中
    goldBizhong: {type: Boolean, default: false},
    //是否从公从号进入
    inConcern: {type: Number, default: 0},      //0不是1是
    //所处活动索引
    actIndex : { type : Number, default : 1 },
    //转运礼包,一天一次,记录充值当天日期,大于记录的日期即可充值转运礼包
    zhuanyunLibao : {  type: String, default: null },
    zhuanyunLibaonew : {  type: String, default: null },
    zhuanyunLibaonewTimer : { type: String, default: null },

    // 邀请人
    shareUserId: {type: Number, default: 0},
    //是否玩过游戏
    hasPlay: {type: Number, default: 0},
    // 抓取次数
    playCount: {type: Number, default: 0},
    //首次提取标记false表示没有提取过
    firstPickUp: {type: Boolean, default: false},

    // 必中值增加值
    biZhongIncPercent: {type: Number, default: 0},

    // 新手任务标记
    newUserTaskFlag: {type: Boolean, default: false},
    //关注公众号列表
    oalist: {type: Object, default: {}},
    //最后进入公众号
    lastOa: {type: String, default: null}

});

module.exports = mymongo.model('User', UserSchema);