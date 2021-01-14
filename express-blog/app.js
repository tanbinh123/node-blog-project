const express = require('express');
// 异步异常处理
require('express-async-errors');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session')
const RedisStore = require('connect-redis')(session)
const { redisClient } = require('./src/main/db/redis')
const ResponseModel = require("./src/main/model/response-model");
// 引入路由
const blogRouter = require('./src/main/routes/blog');
const userRouter = require('./src/main/routes/user');


const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  store: new RedisStore({client: redisClient}),
  secret: "blog",
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 60 * 60 * 24 * 1000 // 一天
  }
}))
// 使用路由
app.use('/favicon.ico', () => {
  console.log('获取头像')
})
app.use('/api/blog', blogRouter);
app.use('/api/user', userRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  let message = err.message
  let code = err.status
  req.app.get('env') === 'dev' ? console.error(err) : {};
  res.json(ResponseModel.ofStatus(null, message, code))
});

module.exports = app;
