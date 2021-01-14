使用Nodejs编写的博客系统  
html-test为客户端  
启动方式, 进入html-test目录执行
`npx http-server -p 8001 --proxy http://localhost:8000`  
访问: [前端入口](http://localhost:8001/login.html)


启动后端服务, 下面两个任意启动一个即可， node-blog是没有使用框架写的后端服务， express-blog是使用express重构的后端服务

node-blog为服务端, 进入node-blog目录，执行以下命令
启动方式
`npm run dev`

express-blog为服务端, 进入express-blog目录，执行以下命令
启动方式
`npm run dev`

