const express = require('express');
const app = express();
const fs = require('fs')
const cors = require('cors')

const loginRouter = require("../routes/login")
const roomRouter = require("../routes/room")



// json转换
app.use(express.json());

// 跨域
app.use(cors());

// 路由 
app.use('/user', loginRouter)
app.use('/room', roomRouter)

// 404处理中间件
app.use(function (req, res, next) {
  console.log('404错误:', req.path);
  res.send({ code: 404, path: req.path, msg: '没有请求到路由' })
});

// 错误处理中间件
app.use(function (err, req, res, next) {
  console.error('服务器错误:', err.stack);
  // 文件路径
  const filePath = '.\\logs\\error.log';
  //错误信息
  const errMessage = `${getTime()} \n 服务器错误: ${err}\n`
  // 将错误信息写入文件
  fs.writeFile(filePath, errMessage, { flag: 'a' }, function (error) {
    if (error) {
      console.error('写入文件错误:', error);
    }
  });
  res.send({ code: 500, msg: '服务器出现错误' })
});

// 时间处理
function getTime() {
  const currentDate = new Date();
  // 获取年、月、日、时、分、秒
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const hours = String(currentDate.getHours()).padStart(2, '0');
  const minutes = String(currentDate.getMinutes()).padStart(2, '0');
  const seconds = String(currentDate.getSeconds()).padStart(2, '0');
  const milliseconds = String(currentDate.getMilliseconds()).padStart(3, '0');
  // 格式化输出
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${milliseconds}`
}



module.exports = app;
