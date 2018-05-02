var express = require('express');
var router = express.Router();

router.get('/getInitMachine', function(req, res, next) {
    res.render('test', { title: '提取娃娃订单处理' });
});

module.exports = router;