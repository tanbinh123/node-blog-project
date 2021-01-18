const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const session = require('koa-generic-session');
const redisStore = require('koa-redis');
const { REDIS_CONFIG } = require('./config/db')
const ResponseModel = require('./model/response-model')
// error handler
onerror(app)

const blog = require('./routes/blog')
const user = require('./routes/user')

// 自定义错误处理
app.use((async (ctx, next) => {
  try{
    await next()
  }catch (err) {
    app.env === 'dev' ? console.error("业务异常", err, ctx) : {};
    ctx.body = ResponseModel.ofStatus(null, err.message, err.code || 500)
  }
}))

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))
app.keys = ['blog']
app.use(session({
  prefix: 'koa:sess:',
  rolling: true,
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, //one day in ms,
    overwrite: true,
    signed: true
  },
  store: redisStore({all: REDIS_CONFIG.host})
}))
app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(blog.routes(), blog.allowedMethods())
app.use(user.routes(), user.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
