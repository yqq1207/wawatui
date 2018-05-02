var request = require('request');
var logger = require('./logger.js');

function getWebContent(uri, method, data) {
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
    return new Promise(function (resolve, reject) {
        request(requestData, function (error, response, body) {
            if (error) {
                reject(error);
            } else {
                resolve(body);
            }
        });
    }).catch(function (err) {
        logger.error("getWebContent error:", err);
    });
}

exports.getWebContent = getWebContent;