var configs = require('./configs.json');
var wechat = require('wechat');
var express     = require('express');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var request = require('request');
var jsdom = require("jsdom");
var redis_ip = "woleige.ca",redis_port="6379";

var tmpRes = "";
var test = function(txt,res){
  request('http://drugs.dxy.cn/search/indication.htm?keyword='+txt,function(error,response,body){
    console.log("get HTML");
    var $doc = $(body);
    console.log("$body done")
    var test = $doc.find("body");
    console.log(test)
    var results = $doc.find("body #page #container .common_bd .common_mainwrap .common_main .result .list .fl h3 a");
    console.log(results);
    tmpRes.reply("222");
  })
}

var fuck=function(txt){
  
  jsdom.env("http://drugs.dxy.cn/search/indication.htm?keyword="+txt,['https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js',
            'http://drugs.dxy.cn/search/indication.htm?keyword='+txt],
           function(errors,window){
            console.log(window.$("#doc").html());
           })

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
      fuck(info.Content);
      //test(info.Content,res);

      //res.reply(req.wxsession.text);
    }
})));
app.listen(configs.port);

