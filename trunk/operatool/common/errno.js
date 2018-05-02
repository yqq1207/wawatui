var errno = {
    SUCCESS: 0,

    G_JSON_PARSE_FAILED: 1,                // json格式错误
    NOT_MODIFIED: 100,

    SESSION_KEY_INVALID: 12,        // sessionKey无效
    USER_REPEAT_LOGIN: 13,          // 用户重复登录
    SEND_MSG_TOO_FAST: 14,          // 信息发送太快

    SMS_HAS_SENT: 600,              // 短信已发送
    SMS_VERIFY_FAILED: 601,         // 验证码验证失败
    SMS_MSG_INVALID: 602,           // 验证码已失效
    SMS_AUTHCODE_GEN_FAILED: 603,   // 生成短信验证码失败
    SMS_MOBILE_INVALID: 604,        // 手机号不合法
    SMS_SEND_LIMIT_DAY: 605,        // 短信发送达到每天最大限值

    USER_MOBILE_UNBIND: 610,        // 手机未绑定
    USER_MOBILE_REGISTERED: 611,    // 手机已注册
    USER_MOBILE_PWD_ERR: 612,       // 手机密码错误
    USER_MOBILE_ISBIND: 613,        // 手机已绑定
    USER_MOBILE_USER_NO_EXIST: 614, // 用户手机号不存在

    USER_ACCOUNT_INVALID: 100,     // 账号无效
    USER_ACCOUNT_LEN_ERROR: 101,   // 账号长度错误
    USER_ACCOUNT_REPEAT: 102,      // 账号已存在

    USER_NICKNAME_INVALID: 103,     // 昵称无效
    USER_NICKNAME_LEN_ERROR: 104,   // 昵称长度错误
    USER_NICKNAME_MEATCHAR: 105,    // 包含特殊字符
    USER_NICKNAME_REPEAT: 106,      // 昵称已存在

    USER_PASSWORD_INVALID: 107,     // 密码无效
    USER_PASSWORD_LEN_ERROR: 108,   // 昵称长度错误

    USER_MOBILE_INVALID: 109,     	// 手机号无效
    USER_MAIL_INVALID: 110,     	// 邮箱无效
    USER_PARAMS_INVALID: 111,     	// 参数无效


    // mongo error
    MONGO_FIND_FAIL: 1001,
    MONGO_UPDATE_FAIL: 1002,
    MONGO_SAVE_FAIL: 1003,
    MONGO_USER_NOT_FOUND: 1004,
    MONGO_REMOVE_FAIL: 1005,

    // file error
    FILE_READ_ERROR: 1020,         // 读取文件错误

    // redis error
    REDIS_GET_FAIL: 2001,
    REDIS_SET_FAIL: 2002,
    REDIS_INC_FAIL: 2003,
    REDIS_DEL_FAIL: 2004,

    // mysql error
    MYSQL_GET_FAIL: 3001,
    MYSQL_SET_FAIL: 3002,
    MYSQL_INC_FAIL: 3003,
    MYSQL_DEL_FAIL: 3004,
    MYSQL_UPT_MULT: 3005,                   // 更新多条记录

    BAG_EXPIRE_TIME_INVALID :      4100,       // 过期时间无效
    BAG_EXPIRY_INVALID :          4101,        // 有效时长无效
    BAG_GOODS_CONF_EXIST :         4102,       // 配置背包物品已存在
    BAG_GOODS_CONF_NO_EXIST :       4103,      // 配置背包物品不存在
    BAG_GOODS_COUNT_NOT_ENOUGH :   4104,       // 物品数量不够
    BAG_GOODS_TYPE_INVALID :       4105,       // 无效的物品类型 1-虚拟 2-现金 3-实物

    REQ_PARAMETERS_INVALID :      9996,        // 参数值无效

    ERR_NULL_ID: 9999
};

module.exports = errno;