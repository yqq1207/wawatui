var express = require('express');
var router = express.Router();

var Mysql = require('../db/MysqlAPI.js');

router.post('/redpackage', function(req, res) {
    var params = [200052,"1.0","1.0","1.0",1,10];
    Mysql.redPackageTest(params, function(err, data) {
        if (err) {
            res.send(err);
            return ;
        }
        console.log(data);
        res.send(data);
    });
});

router.get('/', function(req, res) {
    res.render('test', {title: 'test'});
});

module.exports = router;