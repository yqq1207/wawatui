var fs = require('fs');
var request = require('request');
var crypto= require('crypto');
var iconv = require('iconv-lite');

function isArray(o) {
    return Object.prototype.toString.call(o) === '[object Array]';
};

var readJSONSyncStr = function(file) {
    var data = fs.readFileSync(file).toString();
    return data;
};
var readJSONSync = function(file) {
    var data = JSON.parse(Buffer.from(fs.readFileSync(file).toString()));
    return data;
};
var isNull = function(str) {
    return !str || (typeof str == "undefined") || str == "";
};

var fileExist = function(file) {
    return fs.existsSync(file);
};

var makeFileName = function(path, name, suffix) {
    var file = path + name + suffix;

    if (fileExist(file)) {
        return makeFileName(path, name + "(1)", suffix);
    }
    return name + suffix;
};

var checkMobile = function(sMobile){
    if(!(/^1[3|4|5|8|7][0-9]\d{4,8}$/.test(sMobile))){
        return false;
    }

    return true;
};

/**
 * 写文件
 * @param path
 * @param data
 * @param flag  [a:追加]
 */
var writeFile = function(path, data, flag, cb) {
    fs.writeFile(file, data, {flag: flag, encoding:'utf-8',mode: '0666'},function(err) {
        if(err){
            cb(err);
        } else {
            cb(null);
        }
    });
};

async function getWebContent(uri, method, data) {
    method = method || "POST";
    var requestData = {
        "method": method,
        "uri": uri,
        "json": true
    };
    if (data) {
        requestData['body'] = data;
        requestData['qs'] = data;
    }

    return new Promise(function(resolve, reject) {
        request(requestData, function (error, response, body) {
            if (error) {
                reject(error);
            } else {
                resolve(body);
            }
        });
    });
}

function md5(str, isUp) {
    var md5Value = crypto.createHash('md5').update(str).digest('hex');

    if (isUp) {
        return md5Value.toUpperCase();
    }

    return md5Value;
};

function toQueryString(obj) {
    return Object.keys(obj).filter(function (key) {
        return obj[key] !== undefined && obj[key] !== '';
    }).sort().map(function (key) {
        return key + '=' + obj[key];
    }).join('&');
};

function encodeCode(str, code) {
    return iconv.encode(str, code);
};

function decodeCode(str, code) {
    return iconv.decode(str, code);
};

function addValue(str, len, val) {
    str = String(str);

    var strLen = str.length;
    var rlen = len - strLen;
    var ret = String(val);

    for(var i = 1; i < rlen; i++) {
        ret += String(val);
    }

    ret += str;
    return ret;
};

module.exports = {
    isArray: isArray,
    readJSONSyncStr: readJSONSyncStr,
    readJSONSync: readJSONSync,
    isNull: isNull,
    fileExist: fileExist,
    makeFileName: makeFileName,
    checkMobile: checkMobile,
    writeFile: writeFile,
    getWebContent: getWebContent,
    md5: md5,
    toQueryString: toQueryString,
    encodeCode: encodeCode,
    decodeCode: decodeCode,
    addValue: addValue
};