var configs = require('./configs.json');
var wechat = require('wechat');
var express     = require('express');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var request = require('request');
var $ = require('jquery');

var redis_ip = "woleige.ca",redis_port="6379";

var tmpRes = "";
var test = function(txt,res){
  request('http://www.baidu.com',function(error,response,body){
    console.log(response);
    console.log(body);
    console.log(res)
    var $doc = $(body):
    tmpRes.reply($doc.find("body #page #container .common_bd .common_mainwrap .common_main .result .list .fl h3 a"))
    tmpRes.reply("222");

  })
    //res("123321");
}
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
        //res.reply('hehe');
      console.log("test");
      //(function(txt,res){console.log("123");res.reply(txt)})(info.Content,res);
      tmpRes = res ;
      test(info.Content,res);

      //res.reply(req.wxsession.text);
    }
})));
app.listen(configs.port);

