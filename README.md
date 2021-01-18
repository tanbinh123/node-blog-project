使用Nodejs编写的博客系统  
html-test为客户端  
启动方式, 进入html-test目录执行
`npx http-server -p 8001 --proxy http://localhost:8000`  
访问: [前端入口](http://localhost:8001/login.html)


启动后端服务, 下面服务任意启动一个即可:  
 1:node-blog是没有使用框架写的后端服务，   
 2:express-blog是使用express重构的后端服务  
 3:koa2-blog是使用koa2重构的后端服务  
 

node-blog为服务端, 进入node-blog目录，执行以下命令
启动方式
`npm run dev`

express-blog为服务端, 进入express-blog目录，执行以下命令
启动方式
`npm run dev`

koa2-blog为服务端, 进入express-blog目录，执行以下命令
启动方式
`npm run dev`

lib/express 为手写express框架实现， 主要采用，发布订阅模式，收集中间件，当访问时，从收集的中间件中取出，并访问
