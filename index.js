/**
 * 服务器的config代码，在此处修改服务器属性
 */

// 引用第三方代码
var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');
var bodyParser = require('body-parser');
var methodOverride = require("method-override");

// 引用我们自己的代码
var indexRoute = require('./routes/indexRoute');
var shopRoute = require('./routes/shop');
var pushRoute = require('./routes/push');

var server_url = process.env.SERVER_URL || 'http://localhost:5050/parse';
// var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;

// if (!databaseUri) {
//   console.log('DATABASE_URI not specified, falling back to localhost.');
// }

// 新建一个Parse服务器
var api = new ParseServer({
  databaseURI: 'mongodb://gellert:12345@ds062889.mlab.com:62889/fgpush', // 数据库URI
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js', // 云计算
  appId: process.env.APP_ID || 'freshgreen', // 应用ID，不是饿了么的ID
  masterKey: process.env.MASTER_KEY || 'freshgreen_secret', // 这个要保密
  serverURL: server_url,  // 服务器链接
  liveQuery: {
    classNames: ["Posts", "Comments"] // 实时获取信息，暂时不需要
  }
});
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

// 新建express app
var app = express();

// 一些宏量
app.use(function(req, res, next) {
  res.locals.domain = server_url;
  next();
});

// 使用我们的REST Routes
app.use(indexRoute);
app.use(shopRoute);
app.use(pushRoute);

// Serve static assets from the /public folder, and set the view engine as ejs(Embedded JavaScript)
app.set('view engine', 'ejs');
app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

// 启动服务器
var port = process.env.PORT || 5050;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('Fresh Green running on port ' + port + '.');
});

// This will enable the Live Query real-time server
//ParseServer.createLiveQueryServer(httpServer);
