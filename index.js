var configs = require('./configs.json');
var wechat = require('wechat');
var express     = require('express');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var request = require('request');
var jsdom = require("jsdom");
var redis_ip = "woleige.ca",redis_port="6379";
var dxy_url = "http://drugs.dxy.cn/search/indication.htm?keyword=";
var jquery_url = "http://assets.dxycdn.com/core/jquery/1.7.2-min.js";

var app = express();
app.use(express.query());
app.use(express.cookieParser());
app.use(express.session({
  secret: 'wefew',
  cookie: {maxAge: 60000},
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
      console.log("query dxy "+info.Content);
      var response = "治疗"+txt+"的药物有：" ;
      jsdom.env(dxy_url+txt, [ jquery_url, dxy_url+txt], function(errors, window) {
        console.log("querying "+info.Content)
        window.$("body #page #container .common_bd .common_mainwrap .common_main .result .list .fl h3 a").each(function() {
          response+=window.$(this).text().replace(/\s/g,"");
          response+="\r\n";
        });
      });
      console.log("reply "+response)
      res.reply(response);
    }
  }
)));
app.listen(configs.port);
