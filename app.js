var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var config = require('config');
var session = require('express-session');
var request = require('request');
var leanClound = require('./leanCloud.js').cloudHolder();

var wechat_cfg = require('./config/wechat.cfg');
var signature = require('./service/signature');
var time_price = require('./time_price_test.js');

// Application Settings
var clientId = config.get('uber.client_id');
var clientSecret = config.get('uber.client_secret');
var port = config.get('port') || 3000;
var redirect_host = config.get('uber.redirect_host');
var redirect_path = config.get('uber.redirect_path');

app.use(session({
    secret: config.get('secret'),
    resave: false,
    saveUninitialized: true
}));

app.use(express.static('./public'));
app.set('views', './views');
app.set('view engine', 'ejs');

var oauth2 = require('simple-oauth2')({
    clientID: config.get('uber.client_id'),
    clientSecret: config.get('uber.client_secret'),
    site: 'https://login.uber.com.cn',
    tokenPath: '/oauth/v2/token',
    authorizationPath: '/oauth/v2/authorize'
});

// Authorization uri definition
var authorization_uri = oauth2.authCode.authorizeURL({
    redirect_uri: redirect_host + ":" + port + redirect_path,
    scope: config.get('uber.scopes'),
    state: '3(#0/!~'
});

// Initial page redirecting to Uber
app.get('/auth', function (req, res) {
    startX = req.param('startX');
    startY = req.param('startY');
    endX = req.param('endX');
    endY = req.param('endY');
    openId = req.param('openId');
    res.redirect(authorization_uri + "#wechat_redirect");
});

// Callback service parsing the authorization token and asking for the access token
app.get(redirect_path, function (req, res) {
    var code = req.query.code;
    oauth2.authCode.getToken({
        code: code,
        redirect_uri: redirect_host + ":" + port + redirect_path
    }, saveToken);

    function saveToken(error, token) {
        if (error) {
            console.log('Access Token Error', error.message);
        }
        var accessToken = oauth2.accessToken.create(token);
        // console.log("token: ", accessToken.token.access_token);
        requestToCar(accessToken.token.access_token);
    }

    function requestToCar(access_token) {
        var options = {
          'url': 'https://sandbox-api.uber.com.cn/v1/requests',
          'headers': {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + access_token
          },
          'json': {
             'start_latitude': startX,
             'start_longitude': startY,
             'end_latitude': endX,
             'end_longitude': endY
            }
        }
        request.post(options,function(e,r,result){
            console.log("e", e);
            var addData = {
                    'name' : openId,
                    'requestId' : result.request_id
            };
            leanClound.addInfo(addData);
            res.send("已帮你预约车辆，尽请期待");
        });
    }
});

app.get('/join', function (req, res) {
    var url = req.protocol + '://' + req.host + ":3000" + req.url;
    var serverId = req.query.serverId;
    signature.sign(url,function(signatureMap){
      signatureMap.appId = wechat_cfg.appid;
      signatureMap.serverId = serverId;
      var access_token = signatureMap.access_token;

      /*
      {
        start : [req.query.x,req.query.y],
        end : [req.query.x,req.query.y]
      }*/

      time_price.getTimePrice(function(tp){
            tp.address = req.query.address;
            signatureMap.time_price = tp;
            console.log("signatureMap: ", signatureMap);
            res.render('join',signatureMap);
      });

    });

});

app.listen(port);

console.log("Listening on " + redirect_host + ":" + port);