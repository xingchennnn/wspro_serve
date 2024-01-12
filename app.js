const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const url = require('url')

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

   
const clients = new Set();

   
wss.on('connection', (ws , req) => {
  const query = url.parse(req.url, true).query;
  let name = query.name
  clients.add(ws);  //将新进入的加入里面

  clients.forEach((client) => {  //新进入的会给所有人发消息
    if (client.readyState === WebSocket.OPEN) {
      client.send(name+'加入了房间');
    }  
  });
  
  ws.on('message', (message) => {
    // console.log(`消息: ${message}`);

    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }  
    });
  });

  
  ws.on('close', () => {
    console.log('客户端连接断开');
    
    
    clients.delete(ws);
  });
});

   
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

  
const PORT = process.env.PORT || 55555;
server.listen(PORT, () => {
  console.log(`服务器开启在:${PORT}端口`);
}); 
