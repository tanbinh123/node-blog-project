const http = require('http')
const serverHandler = require('./handler/server-handler')
const exceptionHandler = require('./handler/exception-handler')
const PORT = 8000

const server = http.createServer(async (req, res) => {
  try {
    await serverHandler(req, res)
  } catch (e) {
    console.error(e)
    exceptionHandler(e, req, res)
  }
})
server.listen(PORT)
console.log('启动成功....')