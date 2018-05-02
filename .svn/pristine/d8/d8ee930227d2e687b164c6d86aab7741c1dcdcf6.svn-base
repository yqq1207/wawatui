
// 确保网络畅通的情况下运行，安装依赖
// npm install request

var sender = require('./smsSender');

// 使用时请更换相应的 sdkappid 和 appkey。
// 创建sdkappid,appkey,签名模版等请参考接入指南：https://www.qcloud.com/document/product/382/3785
sender.config.sdkappid = 1400049522;
sender.config.appkey = 'b12cf79a116426891116cc6ab607a27f';

/*
var phoneNumbers = ['15800000000', '18600000000'];

//单发短信接口
sender.singleSmsSend(0, '86', phoneNumbers[0], '您已成功收到来自小明的1元转账，请登录钱包进行查看。', '', '', function (data) {
    var ret = JSON.parse(data);
    if (0 != ret.result) {
        console.log(ret);
    }
});

//带模板单发短信接口
sender.singleSmsSendWithParam('86', phoneNumbers[0], 184, ['小明','1'], '', '', '', function (data) {
    var ret = JSON.parse(data);
    if (0 != ret.result) {
        console.log(ret);
    }
});

//群发短信接口
sender.multiSmsSend(0, '86', phoneNumbers, '您已成功收到来自小明的1元转账，请登录钱包进行查看。', '', '', function (data) {
    var ret = JSON.parse(data);
    if (0 != ret.result) {
        console.log(ret);
    }
});

//带模板群发短信接口
sender.multiSmsSendWithParam('86', phoneNumbers, 184, ['小明','1'], '', '', '', function (data) {
    var ret = JSON.parse(data);
    if (0 != ret.result) {
        console.log(ret);
    }
});
*/

function sendShortMessage(phone, id, params, sign, callback) {

    console.log("sendShortMessage: ", phone, id, params, sign);

    sender.singleSmsSendWithParam('86', phone+"", id, params, sign, '', '', function (data) {
        var ret = JSON.parse(data);
       // console.log("real sendShortMessage ret:", ret);
        if (0 != ret.result) {
            console.log("real sendShortMessage error:", phone);
        }
        callback(null);
    });
}

exports.sendShortMessage = sendShortMessage;

