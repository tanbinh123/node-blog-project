/**
 *
 * @author  Ta_Mu
 * @date 2021/1/14 19:36
 */
const MockExpress = require('./mock-express')

const app = new MockExpress()

app.use((req, res, next) => {
  console.log(`接收到请求, url: ${req.url}, method: ${req.method}`)
  next()
})
app.use("/hello", (req, res, next) => {
  console.log(`hello use 被访问`)
  next()
})
app.get("/hello", (req, res, next) => {
  console.log('hello get 请求被访问')
  res.json({message: 'get hello'})
})
app.post("/hello", (req, res, next) => {
  console.log('hello post 被访问啦')
  res.json({message: 'post hello'})
})
app.post("/error", (req, res, next) => {
  throw new Error('错误哈哈哈哈')
})
const port = process.env.PORT  || 3000
app.listen(port)
app.onError((e) => {
  console.log('捕获到错误啦》。。')
})

console.log('服务启动成功, 端口:', port)
