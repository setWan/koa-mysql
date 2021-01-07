let dotenv = require('dotenv');
// 加载.env配置文件
dotenv.config('./env');

const Koa = require('koa');
const Boom = require('boom');
const bodyParser = require('koa-bodyparser');
const session = require('koa-session');
const koaRequest = require('koa-http-request');
const router = require('./routers/index');
const defaultRequest = require('./utils/request');
const utilsDB = require('./utils/db');
// 原生request请求
global.$http = defaultRequest;
global.$queryDB = utilsDB.queryDB
// var redis = require('redis');

const app = new Koa();

// 配置session
app.keys = ['some secret hurr'];
const sessionOption = {
  key: 'demoSessKey:sess', /** (string) cookie key (default is koa:sess) */
  /** (number || 'session') maxAge in ms (default is 1 days) */
  /** 'session' will result in a cookie that expires when session/browser is closed */
  /** Warning: If a session cookie is stolen, this cookie will never expire */
  maxAge: 86400000,
  autoCommit: true, /** (boolean) automatically commit headers (default true) */
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
  rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
  renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
};
app.use(session(sessionOption, app));

// 配置request
app.use(koaRequest({
  json: true, //automatically parsing of JSON response
  timeout: 10000,    //10s timeout
  host: ''
}));

// 配置Redis
// var client = redis.createClient({
//   host: "192.168.0.216",
//   port: "6379",
//   password: "Haoqiu2018"
// });
// client.on('error', function (err) {
//   console.log('Error ' + err);
// });

// 解析body
app.use(bodyParser());

// 配置路由
app.use(router.routes());
app.use(router.allowedMethods({
  throw: true,
  notImplemented: () => new Boom.notImplemented(),
  methodNotAllowed: () => new Boom.methodNotAllowed()
}));

// 错误处理
app.on('error', err => {
  console.error('server error', err);
});

app.listen(process.env.PORT, '0.0.0.0', () => {
  console.log('服务器启动成功，地址是:http://127.0.0.1:' + process.env.PORT)
})

module.exports = app;
