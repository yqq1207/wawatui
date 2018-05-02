exports.ErrCode = {
    NOPLAYER: {
        code: 10011,
        msg: "没有玩家"
    },
    WRONGPARAMS: {
        code: 10012,
        msg: "参数有误"
    },
    WRONGQUERY: {
        code: 10013,
        msg: "查询错误"
    },
    UNKONW: {
        code: -1,
        msg: "未知"
    },
    SUCCESS: {
        code: 0,
        msg: "OK"
    },
    FAIL: {
        code: -2,
        msg: "Fail"
    },
    TEXTFAIL: {
        code: 10014,
        msg: "短信验证码不正确"
    },
    PWDFAIL: {
        code: 10015,
        msg: "两次密码不一致"
    },
    ACCOUTNFAIL: {
        code: 10016,
        msg: "账号重复"
    },
    PHONEFAIL: {
        code: 10017,
        msg: "手机号重复"
    },
    SIGNFAIL: {
        code: 10018,
        msg: "标识重复"
    },
    REPEAT: {
        code: 10019,
        msg: "数据重复"
    }
};