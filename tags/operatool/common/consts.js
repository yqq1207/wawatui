
exports.LOGGER_DEBUG = true;
exports.redisMachine = {
    KEY: "zb_machines",
    PRV_FILED: "machine_"
};

exports.orders = ["内部单号","内部订单","内部订单号","InnerOrder","用户订单号"];
exports.companys = ["物流公司","快递公司"];
exports.devilys = ["运单号","快递单号"];
exports.names = ["收件人姓名", "姓名","玩家姓名","玩家昵称","昵称","收件人昵称","收件人","收方|联系人"];
exports.goodsName = ["品名", "娃娃","娃娃名称","娃娃名","名称","物品名称","商品名称","PetName","托寄物内容"];
exports.province = ["收件省","Province","省"];
exports.city = ["收件市","City","市"];
exports.address = ["收件人地址","地址","收货地址","Address","收件地址","收方|地址"];
exports.count = ["数量","个数", "商品数量","PetCount","托寄物数量"];
exports.orderTextId = 62192;    //订单短信模块id
exports.zhaoHuiTextId = 72817;  //短信召回模块 id
exports.zhaoHuiOldPublic = "《欢乐抓娃吧,抓趣娃娃机2,幻奇娃娃机》";
exports.zhaoHuiNewPublic = "《娃娃推I》,官方稳定入口公众号《魔术领域》";
exports.orderTextSign = "抓趣娃娃机"; //订单短信模块id
exports.publicAccoutn = "魔术领域"; //订单短信模块id
exports.wuliuservice = "misswang20171108"; //订单短信模块id

exports.orderState = {
    NO: 1,
    SIGN: 2,
    YES: 3
};

exports.msgUrl = "http://v3.zww.gm.imoyuu.com?inConcern=1";
exports.initMsg = "zq6";

//模板消息
exports.templateMsg = {
    "zq1": {            //欢乐抓娃吧
        sendGoods: "gp3Xlhng7tTQ_zkicAzw2yVXP94VITXcxJQmaisIiqs",        //发货通知
        sendNewPet: "-ZFojLRBVf9Y12XBJBTTn96t06nRP-nv_HIrya9wXcI"        //上新娃娃
    },
    "zq2": {            //抓趣娃娃机2
        sendGoods: "JlGAAvlrG82mD0T20QFdJs-D4m8W7HvUagYsQvUxDUU",        //发货通知
        sendNewPet: "_7L8w171RbJ2NHLuupEclq_qkBBhC8afwDBvQgThZ1E"        //上新娃娃
    },
    "zq4": {            //幻奇娃娃机
        sendGoods: "WBYEJPw2ry6iAW77lyxwLUMfIu9cm4vwj9OohUp02l8",        //发货通知
        sendNewPet: "-WCr9sr1-wb-yxBme9yxr3qSZ1jRFer5Y-77zl2MpXo"        //上新娃娃
    },
    "zq5": {            //抓趣娃娃机new
        sendGoods: "zKOW4FkgkZ1wb8f5jwcLwNqdcWpDOdZey4GaVkWBHZ0",        //发货通知
        sendNewPet: "nqHilFmsb9iZ88EzEQoTugYO3yjN733YBZEYkzrL3k0"        //上新娃娃
    },
    "zq6": {            //娃娃推I
        sendGoods: "Zdg4OpjsiL8b3ghlYQnnv5wxZXAuJ8gmtTFjzMQkHKY",        //发货通知
        sendNewPet: "_nXpYY2ELoaufYOs5kOFedpOKOoqlASkPUZ3RtI2C9M"        //上新娃娃
    }
};

//微信配置
exports.wechatcfg = {
    "zq1": {            //欢乐抓娃吧
        appId: "wx1861ef3f55aab523",
        secert: "fc2d91b0ae0b9eaea6a78351028aac84",
    },
    "zq2": {            //抓趣娃娃2
        appId: "wx85894c2c6c9dc6f5",
        secert: "772b20a21c4d5e0a5154bb44a38518b7"
    },
    "zq4": {            //幻奇娃娃机
        appId: "wx2010b454140dac1c",
        secert: "f9166143a28c965f4e15bec61b4eec3a"
    },
    "zq5": {            //抓趣娃娃机new
        appId: "wx09c1b1862b6f4d76",
        secert: "a57f0ab75d9fd2fa19f6cce8f8195894"
    },
    "zq6": {            //娃娃推I
        appId: "wxc1c61bc582a6b116",
        secert: "954e0461376872731c2143f22fb59e48"
    }
};

//京东配置
exports.jdcfg = {
    appKey: "5C96A0A05EF3552E3FD0935C6DB91899",
    appSecert: "4803bf493f3b47b8926be29fdeb8d90c",
    cbUrl: "http://operation.91moyo.com/backstage/",
    state: "myjd123456",
    isvsrc: "ISV0020000000105"
};


exports.petcfg = {
    lastPid: "lastPid",
    initSign: "PT",
    initNum: 1,
    petLen: 6
};
exports.machinecfg = {
    lastMachine: "lastMachine",
    initSign: "DT",
    initNum: 1,
    petLen: 6
};