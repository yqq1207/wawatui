var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
//var logger = require('morgan');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var consts = require('./common/consts.js');

var router = require('./routes/routers.js');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
    secret: '12345',
    name: 'myzb',            //这里的name值得是cookie的name，默认cookie的name是：connect.sid
    cookie: {maxAge: 43200000},  //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
    resave: false,
    saveUninitialized: true,
}));

app.use(express.static(path.join(__dirname, 'public')));

app.all('*', function (req, res, next) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');

    if (req.method == "OPTIONS") {
        res.send(200);
        /*让options请求快速返回*/
    } else {
        var session = req.session;
        var loginUser = session.loginUser;
        var hideVal = req.body.hideVal;
        var isLogined = !!loginUser;

        var auth = req.query.auth;
        var code = req.query.code;
        var state = req.query.state;

        //console.log("session: ", session);
        //console.log("isLogined: ", isLogined, hideVal);
        //console.log("jdlogin[code, state]: ", code, state);

        if (req.path == "/") {
            res.render('bug/bugSend', {title: '工单管理'});
            return ;
        }
        if (req.path.indexOf("/page/bug/sendQuestion") == -1) {
            if (!isLogined && !hideVal && auth != "jd" && !code && !state && state != consts.jdcfg.state) {
                res.render('backstage/login', {title: '抓娃娃登陆'});
                return ;
            }
        }

        next();
    }
});

router(app);

app.listen(9050);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

process.on('uncaughtException', (err) => {
    console.error('有错误', err);
});


module.exports = app;
