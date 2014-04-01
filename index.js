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
  var session = req.wxsession ;
  var last_query = session.last || "" ;
  var last_query_list = session.last_list || [] ;

  console.log(last_query);
  console.log(last_query_list);

  if (info.Content === 'list') {
    req.wxsession.text = 'sucess';
    res.reply('view');
  }else if(info.Content === last_query){
    console.log("match last_query");
    var response = list.length!=0?response+list.join("\r\n")+"\r\n回复数字查询药价。":"对不起未查询到治疗"+info.Content+"症状的药品。";
    console.log(response);
    res.reply(response);
  }else if(last_query_list[info.Content-1]){
    console.log("bingo!")
  
  }else {
    console.log("query dxy "+info.Content);
    var response = "治疗"+info.Content+"的药物有：\r\n" ;
    jsdom.env(dxy_url+info.Content,[jquery_url,dxy_url+info.Content],function(errors, window) {
      console.log("querying "+info.Content)
      var tmplist = window.$("body #page #container .common_bd .common_mainwrap .common_main .result .list .fl h3 a");
      var list = new Array(tmplist.length);
      var i = 0 ;
      tmplist.each(function() {
        list[i++]=(i+"."+window.$(this).text().replace(/\s/g,"")).split("-")[0];
      });
      response = list.length!=0?response+list.join("\r\n")+"\r\n回复数字查询药价。":"对不起未查询到治疗"+info.Content+"症状的药品。";

      console.log(response);

      session.last = info.Content;
      session.last_list=list;

      res.reply(response);
      console.log("reply "+response)
    });
  }
})));

app.listen(configs.port);
