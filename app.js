const httpServer = require('./http/index');
const wsServer = require('./ws/index.js');
const socketIo = require('./wocketIo/index');


//http端口
const PORT = 55556;
//ws端口
const sport = 55555;
//socket.io端口
const socketImport = 55554;


//http服务器
httpServer.listen(PORT, () => {
  console.log(`HTTP 服务器连接在端口 ${PORT}`);
});

//ws服务器
wsServer.listen(sport, () => {
  console.log(`WebSocket 服务器连接在端口 ${sport}`);
});

//socket.io服务器
socketIo.listen(socketImport , () => {
  console.log(`socket.io 服务器连接在端口 ${socketImport}`);
});
