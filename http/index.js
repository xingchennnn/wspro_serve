const express = require('express');
const app = express();
const fs = require('fs')

const loginRouter = require("../routes/login")
// 处理 HTTP 请求
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// 路由 
app.use('/login', loginRouter)


// 404处理中间件
app.use(function (req, res, next) {
  res.send({ code: 404, msg: '未找到相关内容' })
});

// 错误处理中间件
app.use(function (err, req, res, next) {
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
