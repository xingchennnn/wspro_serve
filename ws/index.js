const app = require('../http/index');
const http = require('http');
const WebSocket = require('ws');

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
   
const clients = new Set();

const messageList = []
   
wss.on('connection', (ws , req) => {
  const myURL = new URL(req.url, `http://${req.headers.host}`);
  let name = myURL.searchParams.get('name')
  if(messageList.length!==0){
    // 给这个人发送历史消息

    ws.send(JSON.stringify(messageList));
  }

  clients.add(ws);  //将新进入的加入房间列表里面

  clients.forEach((client) => {  //新进入的会给所有人发消息
    if (client.readyState === WebSocket.OPEN) {
      let res = JSON.stringify(name+'加入了房间')
      client.send(res);
    }  
  });
  
  ws.on('message', (message) => {
    console.log(`消息: ${message}`);
    //添加进历史消息
    messageList.push(JSON.parse(message))
    let str = []
    str.push(message)
    let data = str.toString()
    // console.log('data' , data)
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }  
    });
  });

  
  ws.on('close', () => {
    console.log('客户端连接断开');
    
    clients.delete(ws);
  });
});

module.exports = server;
