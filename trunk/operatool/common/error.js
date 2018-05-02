var util = require('util');
var debugFlag = false;

function CSError(code, msg) {
    CSError.super_.call(this);
    Error.captureStackTrace(this, this.constructor);
    this.code = code || 99;
    if (debugFlag) {
        this.message = (msg || 'CS Error') + ', [code:' + code + '].';
    } else {
        this.message = (msg || 'CS Error');
    }
}

util.inherits(CSError, Error);

CSError.prototype.name = 'CSError';

exports.CSError = CSError;
