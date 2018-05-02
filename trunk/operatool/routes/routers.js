var fsindex = require('./fsindex.js');
var bsindex = require('./bsindex.js');
var order = require('./order/order.js');
var testFun = require('./test.js');
var base = require('./base/baseconf.js');
var charge = require('./charge/charge.js');
var machine = require('./machine/machine.js');
var player = require('./player/player.js');
var mail = require('./mail/mail.js');
var account = require('./account/account.js');
var branch = require('./account/branch.js');
var msg = require('./msg/msgTemplate.js');
var pet = require('./machine/pet.js');
var bug = require('./bug/buglist.js');
var jd = require('./jd/jd.js');


module.exports = function(app) {
    app.use('/', fsindex);
    app.use('/backstage', bsindex);
    app.use('/page/order', order);
    app.use('/page/base', base);
    app.use('/page/charge', charge);
    app.use('/page/machine', machine);
    app.use('/page/pet', pet);
    app.use('/page/player', player);
    app.use('/page/account', account);
    app.use('/page/branch', branch);
    app.use('/page/msg', msg);
    app.use('/page/test', testFun);
    app.use('/page/mail', mail);
    app.use('/page/jd', jd);
    app.use('/page/bug', bug);
};