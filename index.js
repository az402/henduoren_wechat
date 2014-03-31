var configs = require('configs.json');
var wechat = require('wechat');
var express     = require('express');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);

var redis_ip = "woleige.ca",redis_port="6379";


var app = express();
app.use(express.query());
app.use(express.cookieParser());
app.use(express.session({
  secret: 'wefew',
  store: new RedisStore({
    host: redis_ip,
    port: redis_port
  }),
}));
app.use('/wechat', wechat(configs.token, wechat.text(function (info, req, res, next) {
  if (info.Content === 'list') {
      req.wxsession.text = 'sucess';
      res.reply('view');
    } else {
        //res.reply('hehe');
      res.reply(requ.wxsession.text);
    }
})));
app.listen(configs.port);

