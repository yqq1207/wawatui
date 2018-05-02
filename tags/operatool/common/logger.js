var log4js = require("log4js");

function Logger() {
    var self = this;
    self.inited = false;

    if (self.inited) {
        return;
    }

    log4js.configure(logConf);

    self.inited = true;
    self.mainLogger = log4js.getLogger();
    self.mainLogger.level = 'debug';

    return self.mainLogger;
}

var logConf = {
    "appenders": {
        "access": {
            "type": "dateFile",
            "filename": "log/access.log",
            "pattern": "-yyyy-MM-dd"
        },
        "rule-console": {
            "type": "console"
        },
        "rule-file": {
            "type": "dateFile",
            "filename": "log/server-",
            "encoding": "utf-8",
            "maxLogSize": 10000000,
            "numBackups": 3,
            "pattern": "yyyy-MM-dd.log",
            "alwaysIncludePattern": true
        },
        "rule-error": {
            "type": "dateFile",
            "filename": "log/error-",
            "encoding": "utf-8",
            "maxLogSize": 1000000,
            "numBackups": 3,
            "pattern": "yyyy-MM-dd.log",
            "alwaysIncludePattern": true
        }
    },
    "categories": {
        "default": {
            "appenders": [
                "rule-console",
                "rule-file",
                "rule-error"
            ],
            "level": "debug"
        },
        "http": {
            "appenders": [
                "access"
            ],
            "level": "info"
        }
    }
};


module.exports = new Logger();
