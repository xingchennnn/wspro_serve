const app = require('../http/index');
const http = require('http');
const WebSocket = require('ws');

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
   
const clients = new Set();

   
wss.on('connection', (ws , req) => {
  const query = url.parse(req.url, true).query;
  let name = query.name
  clients.add(ws);  //将新进入的加入里面

  clients.forEach((client) => {  //新进入的会给所有人发消息
    if (client.readyState === WebSocket.OPEN) {
      let res = JSON.stringify(name+'加入了房间')
      client.send(res);
    }  
  });
  
  ws.on('message', (message) => {
    console.log(`消息: ${message}`);

    let data = message.toString()

    console.log(data)
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
