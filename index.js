var connect = require('connect');
var wechat = require('wechat');

var app = connect();
app.use(connect.query());
app.use(connect.cookieParser());
app.use(connect.session({secret: 'keyboard cat', cookie: {maxAge: 60000}}));
app.use('/wechat', wechat('some token', wechat.text(function (info, req, res, next) {
  if (info.Content === 'list') {
      res.wait('view');
    } else {
        res.reply('hehe');
    }
})));
app.listen(3000);

