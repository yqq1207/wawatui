
module.exports = new MyDate();

function MyDate() {
    this.dateObj = new Date()
}

MyDate.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

MyDate.prototype.setExtraTimeStampSec = function(d) {
    this.dateObj = new Date(d * 1000);
};

MyDate.prototype.getMonth = function() {
    return this.dateObj.getMonth();
};

MyDate.prototype.getDate = function() {
    return this.dateObj.getDate();
};

MyDate.prototype.getHours = function() {
    return this.dateObj.getHours();
};

MyDate.prototype.getMinutes = function() {
    return this.dateObj.getMinutes();
};

MyDate.prototype.getSeconds = function() {
    return this.dateObj.getSeconds();
};

MyDate.prototype.getMilliseconds = function() {
    return this.dateObj.getMilliseconds();
};

MyDate.prototype.getFullYear = function() {
    return this.dateObj.getFullYear();
};

MyDate.prototype.getNow00Sec = function() {
    var time = 0;
    var now = Math.floor(Date.now() / 1000);

    time += this.getHours() * 60 * 60;
    time += this.getMinutes() * 60;
    time += this.getSeconds();

    return now - time;
};