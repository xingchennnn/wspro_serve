const httpServer = require('./http/index');
const wsServer = require('./ws/index');
//http端口
const PORT = 55556;
//ws端口
const wsport = 55555;


//http服务器
httpServer.listen(PORT, () => {
  console.log(`HTTP 服务器连接在端口 ${PORT}`);
});

//ws服务器
wsServer.listen(wsport, () => {
  console.log(`WebSocket 服务器连接在端口 ${wsport}`);
});
