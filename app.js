var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var config = require('config');
var session = require('express-session');
var request = require('request');

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
    res.redirect(authorization_uri);
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
        console.log("token: ", accessToken.token.access_token);
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
            'start_latitude': 39.98408,
            'start_longitude': 116.315811,
            'end_latitude': 39.929937,
            'end_longitude': 116.584917
            }
        }
        request.post(options,function(e,r,result){
            console.log("e", e);
            res.send(result.status + result.request_id);
        });
    }
});

app.get('/', function (req, res) {
    res.send('Hello<br><a href="/auth">Connect With uber</a>');
});

app.listen(port);

console.log("Listening on " + redirect_host + ":" + port);