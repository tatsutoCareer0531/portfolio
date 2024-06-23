const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
// 追加機能
const history = require('connect-history-api-fallback');
const bodyParser = require('body-parser');
// ルーター
const loginRouter = require('./routes/login');
const photoRouter = require('./routes/photo');

const app = express();

// 追加機能
app.use(history());
app.use(bodyParser.json());

// CORSエラーを回避
// ※開発時front側でAPIを実行すると、POSTだとCORSエラーが起こってしまうため以下を記述
const allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers','Content-Type, Authorization, access_token');
  if ('OPTIONS' === req.method) {
    res.send(200)
  } else {
    next()
  }
}
app.use(allowCrossDomain);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// distファイル(vue)の読み込み
app.use(express.static(path.join(__dirname, 'dist')));

// ルーター定義
app.use('/login', loginRouter);
app.use('/photo', photoRouter);

module.exports = app;
