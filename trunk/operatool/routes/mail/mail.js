var express = require('express');
var router = express.Router();

var logic = require('./logic.js');

router.post('/addMailToUser', function (req, res, next) {
    var params        = req.body;
    if(params["rewards"] && params["rewards"].length > 0){
        params["rewards"] = JSON.parse( params["rewards"] );
    }
    if(params["chooseRewards"] && params["chooseRewards"].length > 0){
        params["chooseRewards"] = JSON.parse( params["chooseRewards"] );
    }
    console.log( "params", JSON.stringify( params ) );
    logic.addMailToUser(params,res,next);
});

router.get('/getRewards', function(req, res, next) {
    logic.getRewards(res);
});

module.exports = router;